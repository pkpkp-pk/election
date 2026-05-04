/**
 * Scraper: Lok Sabha 2024 — myneta.info
 * Source: https://www.myneta.info/LokSabha2024/ (public domain, ADR / ECI affidavits)
 *
 * Strategy:
 *   Scan candidate IDs 1–MAX_ID sequentially.
 *   Each individual candidate page has name, party, constituency, state, winner,
 *   criminal cases, age, parentage, profession, and photo URL in plain HTML.
 *   Education and assets are obfuscated on individual pages but available for
 *   winners on constituency listing pages — handled as a future enhancement.
 *
 *   Progress is checkpointed to STATE_FILE every UPSERT_BATCH records.
 *   Safe to interrupt and resume at any time.
 *
 * Run: pnpm --filter @workspace/scripts run scrape-myneta
 */

import { exec } from "child_process";
import { promisify } from "util";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { db } from "@workspace/db";
import { candidates } from "@workspace/db/schema";
import { sql } from "drizzle-orm";

const execAsync = promisify(exec);

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE = "https://www.myneta.info/LokSabha2024";
const MAX_ID = 9750;           // upper bound from empirical testing (9500 valid, 9800 invalid)
const START_ID = 1;
const DELAY_MS = 1500;         // polite crawl delay matching Python reference scraper
const UPSERT_BATCH = 50;       // flush to DB every N records
const STATE_FILE = "/tmp/scraper_state_v2.json";
const MIN_VALID_SIZE = 30000;  // "Page Not Found" pages are ~13 KB; real pages are 100KB+

// ─── Types ────────────────────────────────────────────────────────────────────

interface CandidateRow {
  mynetaId: number;
  name: string;
  constituency: string;
  state: string;
  party: string;
  isWinner: boolean;
  criminalCases: number | null;
  age: number | null;
  profession: string | null;
  parentage: string | null;
  photoUrl: string | null;
  sourceUrl: string;
}

interface ScraperState {
  nextId: number;
  inserted: number;
  skipped: number;
  failed: number;
}

// ─── HTTP via curl (bypasses Node undici TLS fingerprint bot-detection) ───────

async function fetchHtml(url: string, retries = 3): Promise<string | null> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const { stdout } = await execAsync(
        `curl -s --max-time 20 -L \
          -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" \
          -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
          -H "Accept-Language: en-US,en;q=0.9" \
          -H "Referer: https://www.myneta.info/LokSabha2024/" \
          "${url}"`,
        { maxBuffer: 10 * 1024 * 1024 },
      );
      if (stdout && stdout.length >= MIN_VALID_SIZE) return stdout;
      if (stdout && stdout.length > 0) return null; // page not found
      // empty = rate-limited; back off
      if (attempt < retries - 1) {
        const backoff = 5000 * (attempt + 1);
        console.log(`  [rate-limit] backing off ${backoff / 1000}s…`);
        await sleep(backoff);
      }
    } catch {
      if (attempt < retries - 1) await sleep(3000);
    }
  }
  return null;
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

// ─── State persistence ────────────────────────────────────────────────────────

function saveState(state: ScraperState) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function loadState(): ScraperState | null {
  if (!existsSync(STATE_FILE)) return null;
  try {
    return JSON.parse(readFileSync(STATE_FILE, "utf8")) as ScraperState;
  } catch {
    return null;
  }
}

// ─── Parser ───────────────────────────────────────────────────────────────────

/**
 * Parse an individual candidate page.
 * Only accepts candidates that:
 *   1. Have the Lok Sabha 2024 election tag (w3-khaki panel — not just breadcrumb nav)
 *   2. Have a candidate photograph (alt='profile image' with images_candidate/LokSabha2024/)
 */
function parseCandidatePage(html: string, mynetaId: number): CandidateRow | null {
  if (!html || html.includes("Page Not Found")) return null;

  // Reject pure CAPTCHA pages (imagebuilder.php is also in footer forms on real pages,
  // so only reject when it's the dominant content — i.e. no election tag panel present)
  // Must have the Lok Sabha 2024 election tag panel (w3-khaki), not just the breadcrumb
  if (!html.includes("w3-khaki") || !html.includes("Lok Sabha 2024")) return null;

  // Must have a candidate photograph (the profile image from ECI affidavit)
  const photoUrl =
    html.match(
      /src=(https?:\/\/(?:www\.)?myneta\.info\/images_candidate\/LokSabha2024\/[^\s"'<>]+)[^>]*alt='profile image'/,
    )?.[1] ??
    html.match(
      /alt='profile image'[^>]*src=(https?:\/\/(?:www\.)?myneta\.info\/images_candidate\/LokSabha2024\/[^\s"'<>]+)/,
    )?.[1] ?? null;

  if (!photoUrl) return null; // skip candidates with no affidavit photo

  const name = html.match(/<h2>([^<(]+)/)?.[1]?.trim();
  if (!name || name.trim().length < 2) return null;

  // Constituency and state: <h5>CONSTITUENCY (STATE)</h5>
  const h5 = html.match(/<h5>\s*([^(<\n]+?)\s*\(([^)]+)\)/);
  const constituency = h5?.[1]?.trim().toUpperCase() ?? "";
  const state = h5?.[2]?.trim().toUpperCase() ?? "";

  const isWinner = /\(Winner\)/i.test(html);
  const party = html.match(/<b>Party:<\/b>\s*([^\n<]+)/)?.[1]?.trim() ?? "";

  const ageStr = html.match(/<b>Age:<\/b>\s*(\d+)/)?.[1];
  const age = ageStr ? parseInt(ageStr) : null;
  const parentage =
    html.match(/<b>S\/o\|D\/o\|W\/o:<\/b>\s*([^\n<]+)/)?.[1]?.trim() || null;
  const profession =
    html.match(/<b>Self Profession:<\/b>\s*([^\n<]+)/)?.[1]?.trim() || null;

  const crimStr = html.match(
    /Number of Criminal Cases:\s*<span[^>]*>\s*(\d+)\s*<\/span>/,
  )?.[1];
  const criminalCases = crimStr != null ? parseInt(crimStr) : null;

  if (!constituency || !party) return null;

  return {
    mynetaId,
    name: name.trim(),
    constituency,
    state,
    party: party.trim(),
    isWinner,
    criminalCases,
    age: age != null && !isNaN(age) ? age : null,
    parentage,
    profession,
    photoUrl,
    sourceUrl: `${BASE}/candidate.php?candidate_id=${mynetaId}`,
  };
}

// ─── DB upsert ────────────────────────────────────────────────────────────────

async function upsertBatch(rows: CandidateRow[]) {
  if (rows.length === 0) return;
  await db
    .insert(candidates)
    .values(
      rows.map((r) => ({
        mynetaId: r.mynetaId,
        name: r.name,
        constituency: r.constituency,
        state: r.state || null,
        party: r.party,
        partyShort: r.party.length <= 10 ? r.party : null,
        electionYear: 2024,
        electionType: "Lok Sabha",
        criminalCases: r.criminalCases ?? null,
        education: null,
        age: r.age ?? null,
        profession: r.profession ?? null,
        parentage: r.parentage ?? null,
        photoUrl: r.photoUrl ?? null,
        totalAssetsText: null,
        totalAssetsValue: null,
        liabilitiesText: null,
        liabilitiesValue: null,
        isWinner: r.isWinner ?? false,
        sourceUrl: r.sourceUrl,
      })),
    )
    .onConflictDoUpdate({
      target: candidates.mynetaId,
      set: {
        name: sql`EXCLUDED.name`,
        constituency: sql`EXCLUDED.constituency`,
        state: sql`COALESCE(EXCLUDED.state, candidates.state)`,
        party: sql`EXCLUDED.party`,
        partyShort: sql`COALESCE(EXCLUDED.party_short, candidates.party_short)`,
        isWinner: sql`EXCLUDED.is_winner`,
        criminalCases: sql`COALESCE(EXCLUDED.criminal_cases, candidates.criminal_cases)`,
        age: sql`COALESCE(EXCLUDED.age, candidates.age)`,
        profession: sql`COALESCE(EXCLUDED.profession, candidates.profession)`,
        parentage: sql`COALESCE(EXCLUDED.parentage, candidates.parentage)`,
        photoUrl: sql`COALESCE(EXCLUDED.photo_url, candidates.photo_url)`,
        sourceUrl: sql`EXCLUDED.source_url`,
      },
    });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Chunav Guide — myneta.info sequential scraper ===");
  console.log(`Scanning candidate IDs ${START_ID}–${MAX_ID} at ${DELAY_MS}ms delay`);
  console.log(`Estimated total time: ~${Math.ceil(((MAX_ID - START_ID) * DELAY_MS) / 60000)} min\n`);

  let state: ScraperState = loadState() ?? {
    nextId: START_ID,
    inserted: 0,
    skipped: 0,
    failed: 0,
  };

  if (state.nextId > START_ID) {
    console.log(
      `Resuming from ID ${state.nextId} (inserted=${state.inserted} skipped=${state.skipped} failed=${state.failed})`,
    );
  }

  const pending: CandidateRow[] = [];

  async function flush() {
    if (pending.length === 0) return;
    const batch = pending.splice(0);
    await upsertBatch(batch);
    state.inserted += batch.length;
    saveState(state);
  }

  let lastLogTime = Date.now();

  for (let id = state.nextId; id <= MAX_ID; id++) {
    state.nextId = id;

    const url = `${BASE}/candidate.php?candidate_id=${id}`;
    const html = await fetchHtml(url);

    if (!html) {
      state.skipped++;
    } else {
      const row = parseCandidatePage(html, id);
      if (row) {
        pending.push(row);
      } else {
        state.skipped++;
      }
    }

    // Progress log every 10 seconds
    const now = Date.now();
    if (now - lastLogTime >= 10_000 || id === MAX_ID) {
      const pct = (((id - START_ID) / (MAX_ID - START_ID)) * 100).toFixed(1);
      const rate = (((id - START_ID) * DELAY_MS) / 60000).toFixed(0);
      console.log(
        `  ID ${id}/${MAX_ID} (${pct}%) | inserted=${state.inserted + pending.length} | skipped=${state.skipped} | elapsed=${rate}min`,
      );
      lastLogTime = now;
    }

    if (pending.length >= UPSERT_BATCH) await flush();
    if (id < MAX_ID) await sleep(DELAY_MS);
  }

  await flush();

  // Final count from DB
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(candidates)
    .where(sql`election_year = 2024 AND election_type = 'Lok Sabha'`);

  console.log("\n=== Scrape complete ===");
  console.log(`Total Lok Sabha 2024 candidates in DB: ${count}`);
  console.log(`Inserted/updated: ${state.inserted} | Skipped: ${state.skipped} | Failed: ${state.failed}`);

  try {
    const { unlinkSync } = await import("fs");
    unlinkSync(STATE_FILE);
  } catch {}

  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
