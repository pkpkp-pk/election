# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/scripts run scrape-myneta` — scrape ALL ~8,338 Lok Sabha 2024 candidates from myneta.info (sequential, 1.5s delay, resumes from /tmp/scraper_state_v2.json)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### election-guide (React + Vite, path: `/`)
The main Chunav Guide web app. Pages: Candidates, How Elections Work, Voter Registration, Timeline, Voting Day, Types, FAQ, Glossary.

### api-server (Express 5, path: `/api`)
REST API with:
- `/api/openai/ask` — structured AI Q&A about Indian elections
- `/api/openai/candidate-search` — DB-first candidate search (name, constituency, party/partyShort, state)
- `/api/openai/candidate-bio` — AI biographical supplement for a specific candidate (uses age, profession, parentage from DB)
- `/api/openai/conversations` — multi-turn chat conversations
- `/api/openai/candidate` — legacy AI-only profile endpoint (kept for backward compat)

## Database

**candidates** table (`lib/db/src/schema/candidates.ts`):

Schema columns:
- id, mynetaId, name, constituency, state, party, partyShort
- electionYear, electionType
- criminalCases, education, age, profession, parentage, photoUrl
- totalAssetsText, totalAssetsValue, liabilitiesText, liabilitiesValue
- isWinner, sourceUrl, createdAt

**Data source**: ADR/myneta.info (public ECI affidavit data, Lok Sabha 2024)

**Collection strategy**: `scripts/src/scrape-myneta.ts` scans candidate IDs 1–9750 sequentially
- Each individual candidate page has name, party, constituency, state, winner, criminal cases, age, profession, parentage, and photo URL in plain HTML
- Sequential scrape with 1.5s polite delay; resumes from `/tmp/scraper_state_v2.json`
- Runs as the "Scraper: myneta.info" workflow (console outputType)
- Upserts on `myneta_id` conflict using COALESCE to preserve richer existing data

**ID range**: Lok Sabha 2024 candidate IDs span 1–~9700 (empirically: 9500 is valid, 9800 is "Page Not Found")
**Total candidates**: ~8,338 (confirmed by myneta.info summary page)

## Workflows

- `artifacts/election-guide: web` — Vite dev server for the React frontend
- `artifacts/api-server: API Server` — Express backend
- `Scraper: myneta.info` — background scraper (runs until all IDs 1–9750 processed, ~4 hours)

## Frontend: Candidate Cards

The `Candidates.tsx` page shows:
- Photo: myneta.info affidavit photo (DB `photoUrl`) → falls back to Wikipedia → falls back to party initials
- Age, profession (shown in card header row)
- Criminal cases badge (red/amber/green)
- Expanded section: criminal cases, education, assets, liabilities, age, profession, parentage tiles
- AI-generated biography (gpt-4o-mini, uses all available affidavit context)
