import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { conversations, messages, insertConversationSchema, insertMessageSchema } from "@workspace/db/schema";
import { openai } from "@workspace/integrations-openai-ai-server";
import { CreateOpenaiConversationBody, SendOpenaiMessageBody, GetOpenaiConversationParams, DeleteOpenaiConversationParams, SendOpenaiMessageParams, ListOpenaiMessagesParams } from "@workspace/api-zod";

const router = Router();

const STRUCTURED_SYSTEM_PROMPT = `You are Chunav Guide, an expert on Indian elections. When given a question, respond with ONLY a valid JSON object in exactly this format (no markdown, no extra text):

{
  "answer": "A direct, factual 2-3 sentence answer to the question. Be concise and informative.",
  "related": [
    {
      "keyword": "1-3 word label",
      "question": "A related question the user might want to know?",
      "brief": "One clear sentence answer to this related question.",
      "detailed": "A thorough 3-5 sentence explanation with specifics, facts, and context about this related topic."
    }
  ]
}

Rules:
- "answer" must be direct and factual, 2-3 sentences max
- "related" must contain exactly 5 objects covering genuinely related subtopics
- "keyword" must be 1-3 words, like a tag (e.g. "EVM", "Voter ID", "Model Code", "Lok Sabha", "VVPAT")
- "brief" is one sentence only
- "detailed" is 3-5 sentences with rich factual detail
- All content must be about Indian elections, democracy, and civic processes
- Respond in English unless the question is in Hindi`;

const SYSTEM_PROMPT = `You are Chunav Guide, a helpful assistant for Indian elections. You answer questions about:
- How Indian elections work (Lok Sabha, Rajya Sabha, Vidhan Sabha, Vidhan Parishad)
- Voter registration (Form 6, Form 7, Form 8, Form 8A, EPIC/Voter ID card)
- Voting process (Electronic Voting Machines/EVM, VVPAT, polling booths)
- Election Commission of India (ECI) rules and procedures
- Model Code of Conduct (MCC)
- Political parties, candidates, and electoral rolls
- cVIGIL app for reporting election violations
- Voter Helpline 1950
- Result counting and declaration process
- By-elections, Presidential elections, and other election types in India
- Historical and recent Indian election facts

Always be accurate, neutral, and helpful. If unsure, say so. Keep responses concise and easy to understand for Indian citizens. You may respond in Hindi or English depending on what the user prefers.`;

router.get("/openai/conversations", async (req, res) => {
  try {
    const result = await db.select().from(conversations).orderBy(conversations.createdAt);
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list conversations" });
  }
});

router.post("/openai/conversations", async (req, res) => {
  const parsed = CreateOpenaiConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const [conversation] = await db
      .insert(conversations)
      .values({ title: parsed.data.title })
      .returning();
    res.status(201).json(conversation);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

router.get("/openai/conversations/:id", async (req, res) => {
  const parsed = GetOpenaiConversationParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, parsed.data.id));
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, parsed.data.id))
      .orderBy(messages.createdAt);
    res.json({ ...conversation, messages: msgs });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get conversation" });
  }
});

router.delete("/openai/conversations/:id", async (req, res) => {
  const parsed = DeleteOpenaiConversationParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [deleted] = await db
      .delete(conversations)
      .where(eq(conversations.id, parsed.data.id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

router.get("/openai/conversations/:id/messages", async (req, res) => {
  const parsed = ListOpenaiMessagesParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, parsed.data.id))
      .orderBy(messages.createdAt);
    res.json(msgs);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list messages" });
  }
});

router.post("/openai/conversations/:id/messages", async (req, res) => {
  const paramsParsed = SendOpenaiMessageParams.safeParse(req.params);
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParsed = SendOpenaiMessageBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const conversationId = paramsParsed.data.id;
  const userContent = bodyParsed.data.content;

  try {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId));
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    await db.insert(messages).values(
      insertMessageSchema.parse({ conversationId, role: "user", content: userContent })
    );

    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);

    const chatMessages = history.map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...chatMessages],
      stream: true,
    });

    let fullContent = "";
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? "";
      if (delta) {
        fullContent += delta;
        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

    await db.insert(messages).values(
      insertMessageSchema.parse({ conversationId, role: "assistant", content: fullContent })
    );
  } catch (err) {
    req.log.error(err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to send message" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
      res.end();
    }
  }
});

router.post("/openai/ask", async (req, res) => {
  const question = req.body?.question;
  if (!question || typeof question !== "string" || question.trim().length === 0) {
    res.status(400).json({ error: "Missing question" });
    return;
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: STRUCTURED_SYSTEM_PROMPT },
        { role: "user", content: question.trim() },
      ],
      response_format: { type: "json_object" },
    });
    const raw = completion.choices[0]?.message?.content ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { answer: raw, related: [] };
    }
    res.json(parsed);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to process question" });
  }
});

export default router;

