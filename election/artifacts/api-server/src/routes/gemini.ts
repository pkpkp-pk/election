import { Router } from "express";
import { eq } from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";
import { db } from "@workspace/db";
import { conversations, messages, insertConversationSchema, insertMessageSchema, candidateBios } from "@workspace/db/schema";
import { ai } from "@workspace/integrations-gemini-ai";
import { CreateOpenaiConversationBody, SendOpenaiMessageBody, GetOpenaiConversationParams, DeleteOpenaiConversationParams, SendOpenaiMessageParams, ListOpenaiMessagesParams } from "@workspace/api-zod";

// ─── Supabase client (for candidates table) ───────────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const router = Router();

// ─── Grounding context injected into every prompt ────────────────────────────
const ELECTION_FACTS = `
KEY FACTS — Lok Sabha 2024 General Election (COMPLETED):
- 7 phases: April 19 – June 1, 2024. Results declared June 4, 2024.
- Total seats: 543. Majority mark: 272.
- NDA won 293 seats: BJP 240, TDP 16, JD(U) 12, Shiv Sena (Shinde) 7, LJP(RV) 5, others.
- INDIA alliance won 234 seats: INC 99, SP 37, TMC 29, DMK 22, others.
- Narendra Modi sworn in as Prime Minister for a third consecutive term on June 9, 2024.
- Rahul Gandhi won from Wayanad and Rae Bareli (vacated Wayanad, won from Rae Bareli).
- Voter turnout: ~66.3%. Total electors: ~970 million.
- This election is COMPLETE. All results are final.
`.trim();

const STRUCTURED_SYSTEM_PROMPT = `You are Chunav Guide, an expert on Indian elections. You have full knowledge of the completed Lok Sabha 2024 election results.

${ELECTION_FACTS}

When given a question, respond with ONLY a valid JSON object in exactly this format (no markdown, no extra text):

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

const SYSTEM_PROMPT = `You are Chunav Guide, an Election Assistant designed to help Indian citizens understand the election process in a clear, simple, and interactive way. You have full knowledge of the completed Lok Sabha 2024 election results.

${ELECTION_FACTS}

## Your Goals
- Explain how Indian elections work step-by-step
- Guide users through election timelines (before, during, and after elections)
- Help users understand what actions they need to take (e.g., voter registration, checking eligibility, voting)
- Answer questions about Indian election procedures in an easy-to-follow manner

## Behavior Guidelines
- Always use simple, non-technical language — assume no prior knowledge
- Break explanations into steps or stages
- Prefer short paragraphs or bullet points over long walls of text
- Be interactive: ask helpful follow-up questions when appropriate (e.g., "Would you like to know how to register to vote?")
- Adapt explanations for beginners

## Content Structure
When explaining a process, organize your response into:
1. **What this stage is** — a one-line plain-English summary
2. **Why it matters** — brief context on why this step exists
3. **What the user should do** (if applicable) — clear, actionable steps

For timeline questions, clearly divide into phases:
- **Pre-election** — voter registration, candidate nomination, electoral rolls
- **Campaign period** — Model Code of Conduct, rallies, manifestos
- **Voting day** — polling booths, EVMs, VVPAT, what to bring
- **Counting and results** — how votes are counted, result declaration, winning criteria

## Accuracy & Safety
- Provide neutral, factual, and unbiased information only
- Do not promote or criticize any political party or candidate
- If unsure about a specific rule or local detail, say so clearly and suggest checking official sources (ECI website: eci.gov.in, Voter Helpline 1950)
- Never invent facts, statistics, or data

## Candidate-Related Queries
- Only use structured data provided by the system (affidavit data from ECI via ADR/myneta.info)
- Do not guess or fabricate information about candidates
- If data is missing, clearly state: "I don't have verified information on that"
- Summarize candidate facts clearly and objectively — highlight experience, party, and public record

## Tone
- Friendly, clear, and informative
- Encouraging but never persuasive or partisan
- Guide users like a helpful companion, not just a question-answering bot

## Output Style
- Use **headings**, numbered steps, and bullet points for clarity
- Keep responses concise but complete
- Avoid jargon — if a technical term is necessary, explain it immediately
- You may respond in Hindi or English depending on what the user prefers`;

router.get("/gemini/conversations", async (req, res) => {
  try {
    const result = await db.select().from(conversations).orderBy(conversations.createdAt);
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list conversations" });
  }
});

router.post("/gemini/conversations", async (req, res) => {
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

router.get("/gemini/conversations/:id", async (req, res) => {
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

router.delete("/gemini/conversations/:id", async (req, res) => {
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

router.get("/gemini/conversations/:id/messages", async (req, res) => {
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

router.post("/gemini/conversations/:id/messages", async (req, res) => {
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
      role: m.role === "assistant" ? "model" : "user" as "model" | "user",
      parts: [{ text: m.content }],
    }));

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: chatMessages,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 8192,
      },
    });

    let fullContent = "";
    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        fullContent += text;
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
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

// ─── Candidate Search: DB-first, AI supplement ───────────────────────────────

const CANDIDATE_BIO_PROMPT = `You are an expert on Indian politics. You have full knowledge of the completed Lok Sabha 2024 election results.

${ELECTION_FACTS}

Given a candidate's real affidavit data (name, party, constituency, criminal cases, assets), generate biographical details in ONLY this JSON format (no markdown):

{
  "aliases": ["Common nickname if any"],
  "born": "Birth year or approximate",
  "career_start": "Year political career began",
  "career_years": 10,
  "status": "Active/Retired/Deceased",
  "current_position": "Current designation if any",
  "constituencies_history": [
    { "name": "Constituency", "state": "State", "from": "Year", "to": "Year or present", "type": "Lok Sabha/Rajya Sabha/MLA" }
  ],
  "parties_history": [
    { "party": "Party name", "short": "Abbreviation", "from": "Year", "to": "Year or present" }
  ],
  "popularity": {
    "score": 5,
    "level": "National/State/Regional/Local",
    "description": "2-3 sentences on recognition and influence"
  },
  "major_works": [
    { "title": "Achievement", "description": "Brief description" }
  ],
  "brief": "2-3 sentence biographical summary",
  "disclaimer": "Affidavit data (criminal cases, assets) is from ECI via ADR/myneta.info and is self-declared by the candidate. Biographical details are AI-generated and may be inaccurate."
}

Rules:
- career_years must be a number
- popularity.score must be 1-10
- major_works: 2-5 items
- If this is an obscure/unknown candidate, set brief to a short neutral statement and keep arrays minimal
- Never fabricate specific criminal case details (real data is provided separately)`;

// ─── Candidate search cache ───────────────────────────────────────────────────

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const CACHE_MAX_ENTRIES = 200;

type CacheEntry<T> = { value: T; expiresAt: number };

class TtlCache<T> {
  private store = new Map<string, CacheEntry<T>>();

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: T): void {
    if (this.store.size >= CACHE_MAX_ENTRIES) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) this.store.delete(oldestKey);
    }
    this.store.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  }

  stats() {
    return { size: this.store.size, maxSize: CACHE_MAX_ENTRIES, ttlMs: CACHE_TTL_MS };
  }
}

const candidateSearchCache = new TtlCache<ReturnType<typeof mapCandidate>[]>();

// ─── Candidate Search (GET + POST) ───────────────────────────────────────────

type SupabaseCandidate = {
  id: number;
  myneta_id: number | null;
  name: string;
  constituency: string;
  state: string | null;
  party: string;
  party_short: string | null;
  election_year: number;
  election_type: string;
  criminal_cases: number | null;
  education: string | null;
  age: number | null;
  profession: string | null;
  parentage: string | null;
  photo_url: string | null;
  total_assets_text: string | null;
  total_assets_value: number | null;
  liabilities_text: string | null;
  liabilities_value: number | null;
  is_winner: boolean | null;
  source_url: string | null;
  created_at: string;
};

function mapCandidate(row: SupabaseCandidate) {
  return {
    id: row.id,
    mynetaId: row.myneta_id,
    name: row.name,
    constituency: row.constituency,
    state: row.state,
    party: row.party,
    partyShort: row.party_short,
    electionYear: row.election_year,
    electionType: row.election_type,
    criminalCases: row.criminal_cases,
    education: row.education,
    age: row.age,
    profession: row.profession,
    parentage: row.parentage,
    photoUrl: row.photo_url,
    totalAssetsText: row.total_assets_text,
    totalAssetsValue: row.total_assets_value,
    liabilitiesText: row.liabilities_text,
    liabilitiesValue: row.liabilities_value,
    isWinner: row.is_winner,
    sourceUrl: row.source_url,
    createdAt: row.created_at,
  };
}

async function searchCandidates(q: string): Promise<{ rows: ReturnType<typeof mapCandidate>[]; fromCache: boolean }> {
  const cacheKey = q.toLowerCase().trim();

  const cached = candidateSearchCache.get(cacheKey);
  if (cached) {
    return { rows: cached, fromCache: true };
  }

  if (!supabase) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY).");
  }

  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .or(
      `name.ilike.%${q}%,constituency.ilike.%${q}%,party.ilike.%${q}%,party_short.ilike.%${q}%,state.ilike.%${q}%`
    )
    .order("name")
    .limit(20);

  if (error) throw error;

  const rows = ((data ?? []) as SupabaseCandidate[])
    .sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(q.toLowerCase()) ? 0 : 1;
      const bStarts = b.name.toLowerCase().startsWith(q.toLowerCase()) ? 0 : 1;
      return aStarts - bStarts || a.name.localeCompare(b.name);
    })
    .map(mapCandidate);

  candidateSearchCache.set(cacheKey, rows);
  return { rows, fromCache: false };
}

// GET /api/gemini/candidate-search?q=Modi
router.get("/gemini/candidate-search", async (req, res) => {
  const q = (req.query.q as string | undefined)?.trim() ?? "";
  if (!q) { res.status(400).json({ error: "Missing ?q= query param" }); return; }
  try {
    const { rows, fromCache } = await searchCandidates(q);
    res.json({ query: q, total: rows.length, candidates: rows, fromCache, source: "ADR/myneta.info via ECI affidavits" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to search candidates" });
  }
});

// POST /api/gemini/candidate-search { query: "..." }
router.post("/gemini/candidate-search", async (req, res) => {
  const q = (req.body?.query as string | undefined)?.trim() ?? "";
  if (!q) { res.status(400).json({ error: "Missing search query" }); return; }
  try {
    const { rows, fromCache } = await searchCandidates(q);
    res.json({ query: q, total: rows.length, candidates: rows, fromCache, source: "ADR/myneta.info via ECI affidavits" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to search candidates" });
  }
});

// GET /api/gemini/candidate-search/cache-stats — useful for monitoring
router.get("/gemini/candidate-search/cache-stats", (_req, res) => {
  res.json(candidateSearchCache.stats());
});

// Endpoint: get AI bio for a specific candidate — cache-first, generate with Gemini on miss
router.post("/gemini/candidate-bio", async (req, res) => {
  const { mynetaId, name, party, constituency, criminalCases, totalAssetsText, age, profession, parentage } = req.body ?? {};

  if (!name || typeof name !== "string") {
    res.status(400).json({ error: "Missing candidate name" });
    return;
  }

  try {
    // ── 1. Cache lookup by myneta_id (skip if no ID provided) ───────────────
    if (mynetaId != null) {
      const [cached] = await db
        .select()
        .from(candidateBios)
        .where(eq(candidateBios.mynetaId, Number(mynetaId)))
        .limit(1);

      if (cached) {
        let bio: unknown;
        try { bio = JSON.parse(cached.bioJson); } catch { bio = {}; }
        res.json({ bio, candidateName: name, cached: true });
        return;
      }
    }

    // ── 2. Generate with Gemini ────────────────────────────────────────────
    const contextLines = [
      `Candidate: ${name}`,
      `Party: ${party ?? "Unknown"}`,
      `Constituency: ${constituency ?? "Unknown"}`,
      age != null ? `Age: ${age}` : null,
      profession ? `Profession: ${profession}` : null,
      parentage ? `Parentage: ${parentage}` : null,
      `Criminal cases declared: ${criminalCases ?? "Not available"}`,
      `Total assets declared: ${totalAssetsText ?? "Not available"}`,
      `Source: ECI affidavit (Lok Sabha 2024)`,
    ].filter(Boolean);

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `Generate biographical details for this candidate:\n\n${contextLines.join("\n")}` }],
          },
        ],
        config: {
          systemInstruction: CANDIDATE_BIO_PROMPT,
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
        },
      });
    } catch (e: any) {
      req.log.warn({ err: e }, "gemini-2.5-flash failed for candidate-bio, falling back to gemini-1.5-flash");
      response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `Generate biographical details for this candidate:\n\n${contextLines.join("\n")}` }],
          },
        ],
        config: {
          systemInstruction: CANDIDATE_BIO_PROMPT,
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
        },
      });
    }

    const raw = response.text ?? "{}";
    let bio: unknown;
    try { bio = JSON.parse(raw); } catch {
      bio = { brief: "Biographical information not available.", parties_history: [], constituencies_history: [], major_works: [], popularity: { score: 3, description: "No data" } };
    }

    // ── 3. Persist to cache if we have a myneta_id ───────────────────────────
    if (mynetaId != null) {
      try {
        await db.insert(candidateBios).values({
          mynetaId: Number(mynetaId),
          bioJson: JSON.stringify(bio),
          modelVersion: "gemini-2.5-flash",
        }).onConflictDoNothing();
      } catch (cacheErr) {
        req.log.warn({ cacheErr }, "Bio cache write failed — returning result anyway");
      }
    }

    res.json({ bio, candidateName: name, cached: false });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch candidate bio" });
  }
});

// Legacy endpoint (kept for backward compat, uses AI only)
router.post("/gemini/candidate", async (req, res) => {
  const name = req.body?.name;
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: "Missing candidate name" });
    return;
  }

  const LEGACY_PROMPT = `You are an expert on Indian politics and elections. When given the name of an Indian politician or candidate, return ONLY a valid JSON object in exactly this format (no markdown, no extra text):

{
  "name": "Full official name",
  "aliases": ["Common name"],
  "born": "Birth year",
  "gender": "Male/Female/Other",
  "current_party": "Current party name",
  "current_party_short": "Abbreviation",
  "career_start": "Year",
  "career_years": 10,
  "status": "Active/Retired/Deceased",
  "current_position": "Current designation",
  "constituencies": [{ "name": "Constituency", "state": "State", "from": "Year", "to": "Year", "type": "Lok Sabha" }],
  "parties": [{ "party": "Party", "short": "Short", "from": "Year", "to": "Year", "role": "Role" }],
  "criminal_cases": { "count": 0, "severity": "None", "details": [], "source": "ADR", "note": "Self-declared affidavit" },
  "popularity": { "score": 5, "level": "National", "description": "Description" },
  "major_works": [{ "title": "Work", "description": "Description" }],
  "brief": "2-3 sentence summary",
  "disclaimer": "AI-generated profile. Verify with official sources."
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `Get profile for Indian politician: ${name.trim()}` }],
        },
      ],
      config: {
        systemInstruction: LEGACY_PROMPT,
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });
    const raw = response.text ?? "{}";
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

router.post("/gemini/ask", async (req, res) => {
  const question = req.body?.question;
  if (!question || typeof question !== "string" || question.trim().length === 0) {
    res.status(400).json({ error: "Missing question" });
    return;
  }
  try {
    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: question.trim() }],
          },
        ],
        config: {
          systemInstruction: STRUCTURED_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
        },
      });
    } catch (e: any) {
      // Fallback to 1.5 if 2.5 is overloaded (503)
      req.log.warn({ err: e }, "gemini-2.5-flash failed, falling back to gemini-1.5-flash");
      response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: question.trim() }],
          },
        ],
        config: {
          systemInstruction: STRUCTURED_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
        },
      });
    }

    const raw = response.text ?? "{}";
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
