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

const CANDIDATE_SYSTEM_PROMPT = `You are an expert on Indian politics and elections. When given the name of an Indian politician or candidate, return ONLY a valid JSON object in exactly this format (no markdown, no extra text):

{
  "name": "Full official name",
  "aliases": ["Common name", "Nickname if any"],
  "born": "Birth year or approximate",
  "gender": "Male/Female/Other",
  "current_party": "Current party name or 'None/Independent'",
  "current_party_short": "Short abbreviation like BJP, INC, AAP etc",
  "career_start": "Year political career began",
  "career_years": 25,
  "status": "Active/Retired/Deceased",
  "current_position": "Current designation if any, e.g. 'Member of Parliament, Varanasi'",
  "constituencies": [
    { "name": "Constituency name", "state": "State", "from": "Year", "to": "Year or present", "type": "Lok Sabha/Rajya Sabha/MLA" }
  ],
  "parties": [
    { "party": "Party name", "short": "Abbreviation", "from": "Year", "to": "Year or present", "role": "Role in party if notable" }
  ],
  "criminal_cases": {
    "count": 0,
    "severity": "None/Minor/Serious/Heinous",
    "details": ["Case description if any"],
    "source": "ADR (Association for Democratic Reforms) data",
    "note": "Data based on self-declared affidavits filed during elections"
  },
  "popularity": {
    "score": 7,
    "level": "National/State/Regional/Local",
    "description": "2-3 sentences on how well-known they are and why"
  },
  "major_works": [
    { "title": "Work/achievement title", "description": "Brief description" }
  ],
  "brief": "2-3 sentence biographical summary",
  "disclaimer": "This profile is AI-generated based on publicly available information. It may contain inaccuracies. Always verify with official sources like ECI, ADR, or the candidate's official affidavit."
}

Rules:
- criminal_cases.count must be a number (0 if none known)
- career_years must be a number
- popularity.score must be 1-10
- parties array must be chronological oldest first
- major_works should have 3-5 items
- constituencies should be chronological
- If the person is not a known Indian politician, set name to the input, brief to "No verified information found for this person as an Indian politician.", and all arrays to []
- Never fabricate specific criminal case details — if unsure, set count to 0 and add a note
- Be factually accurate about well-known politicians`;

router.post("/openai/candidate", async (req, res) => {
  const name = req.body?.name;
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: "Missing candidate name" });
    return;
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: CANDIDATE_SYSTEM_PROMPT },
        { role: "user", content: `Get profile for Indian politician: ${name.trim()}` },
      ],
      response_format: { type: "json_object" },
    });
    const raw = completion.choices[0]?.message?.content ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { name: name.trim(), brief: "Failed to parse response.", parties: [], constituencies: [], criminal_cases: { count: 0, details: [] }, major_works: [], popularity: { score: 0, description: "" } };
    }
    res.json(parsed);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch candidate info" });
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

