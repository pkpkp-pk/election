# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (conversations/messages/bios); Supabase JS client (candidates)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: Gemini (`gemini-2.5-flash`) via `@workspace/integrations-gemini-ai`
- **Deployment**: Vercel-compatible (see `vercel.json`)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/scripts run scrape-myneta` — scrape ALL ~8,338 Lok Sabha 2024 candidates from myneta.info

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### election-guide (React + Vite, path: `/`)
The main Chunav Guide web app. Pages: Candidates, How Elections Work, Voter Registration, Timeline, Voting Day, Types, FAQ, Glossary.

### api-server (Express 5, path: `/api`)
REST API with:
- `/api/openai/ask` — structured AI Q&A about Indian elections
- `/api/openai/candidate-search` — Supabase candidate search (name, constituency, party, state)
- `/api/openai/candidate-bio` — AI biographical supplement (Gemini, cached in DB)
- `/api/openai/conversations` — multi-turn chat conversations
- `/api/openai/candidate` — legacy AI-only profile endpoint

## Database

### Candidates (Supabase — `candidates` table)
Queried via `@supabase/supabase-js`. Snake_case columns mapped to camelCase in `mapCandidate()`.
Requires `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_ANON_KEY`) env vars.

### Other tables (Drizzle ORM — PostgreSQL via `DATABASE_URL`)
- **conversations** / **messages** — chat history
- **candidate_bios** — cached Gemini-generated bios

For Vercel, `DATABASE_URL` should be the Supabase Transaction mode pooler connection string.

## AI Integration

- **Replit**: uses `AI_INTEGRATIONS_GEMINI_API_KEY` + `AI_INTEGRATIONS_GEMINI_BASE_URL` (auto-set)
- **Vercel**: uses `GEMINI_API_KEY` (direct Google API key from aistudio.google.com)
- The client in `lib/integrations-gemini-ai/src/client.ts` supports both automatically

## Vercel Deployment

See `vercel.json` at project root and `.env.example` for all required env vars.

- Build command: `pnpm install --no-frozen-lockfile && pnpm --filter @workspace/election-guide run build`
- Output directory: `artifacts/election-guide/dist/public`
- API serverless function: `api/index.ts` (wraps Express app)
- Routing: Vercel rewrites `/api/:path*` → `api/index.ts`

**Required Vercel env vars:**
- `DATABASE_URL` — Supabase Transaction mode pooler URL
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
- `GEMINI_API_KEY` — Google AI Studio API key

See `.env.example` for full details.

## Workflows

- `artifacts/election-guide: web` — Vite dev server for the React frontend
- `artifacts/api-server: API Server` — Express backend
- `Scraper: myneta.info` — background scraper

## Frontend: Candidate Cards

The `Candidates.tsx` page shows:
- Photo: myneta.info affidavit photo (DB `photoUrl`) → falls back to Wikipedia → falls back to party initials
- Age, profession (shown in card header row)
- Criminal cases badge (red/amber/green)
- Expanded section: criminal cases, education, assets, liabilities, age, profession, parentage tiles
- AI-generated biography (Gemini 2.5 Flash, uses all available affidavit context)
