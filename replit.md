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
- `pnpm --filter @workspace/scripts run seed-candidates` — seed the candidate DB with Lok Sabha 2024 data

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### election-guide (React + Vite, path: `/`)
The main Chunav Guide web app. Pages: Candidates, How Elections Work, Voter Registration, Timeline, Voting Day, Types, FAQ, Glossary.

### api-server (Express 5, path: `/api`)
REST API with:
- `/api/openai/ask` — structured AI Q&A about Indian elections
- `/api/openai/candidate-search` — DB-first candidate search (name, constituency, party/partyShort, state)
- `/api/openai/candidate-bio` — AI biographical supplement for a specific candidate
- `/api/openai/conversations` — multi-turn chat conversations
- `/api/openai/candidate` — legacy AI-only profile endpoint (kept for backward compat)

## Database

**candidates** table (`lib/db/src/schema/candidates.ts`):
- 191 Lok Sabha 2024 candidates seeded from ECI official results + ADR affidavit data
- Covers winners (112) and notable losers (79) across 24 parties
- Schema: id, mynetaId, name, constituency, state, party, partyShort, electionYear, electionType, criminalCases, education, totalAssetsText, totalAssetsValue, liabilitiesText, liabilitiesValue, isWinner, sourceUrl, createdAt

Seed data source: ECI official results (public domain) + ADR/myneta.info affidavit disclosures.
Re-seed command: `pnpm --filter @workspace/scripts run seed-candidates`
