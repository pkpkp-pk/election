# Chunav Guide — Indian Election Assistant

An AI-powered guide for Indian elections, built with React + Vite (frontend) and Express (backend), powered by Google Gemini AI.

## Features

- Ask any question about Indian elections and get instant AI answers
- Explore Lok Sabha 2024 candidate data (criminal cases, assets, profession) sourced from ECI affidavits via ADR/myneta.info
- AI-generated candidate biographies using Gemini
- Streaming chat conversations with Chunav Guide
- Interactive related-topics explorer

---

## Deploy on Vercel

### 1. Connect your GitHub repo to Vercel

Go to [vercel.com](https://vercel.com), import the `pkpkp-pk/election` repository.

### 2. Set Environment Variables

In your Vercel project → **Settings → Environment Variables**, add:

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key. Get one at [aistudio.google.com](https://aistudio.google.com/apikey) |
| `DATABASE_URL` | **Yes** | PostgreSQL connection string for conversation history (e.g. from Neon, Supabase, Railway) |
| `SUPABASE_URL` | No | Supabase project URL — only needed for the Candidate Search feature |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service role key — only needed for the Candidate Search feature |

> The app works without Supabase — candidate search will be unavailable, but all other features work normally.

### 3. Build & Output Settings

These are already configured in `vercel.json` — no changes needed:

```json
{
  "installCommand": "pnpm install --no-frozen-lockfile",
  "buildCommand": "pnpm --filter @workspace/api-server run build && pnpm --filter @workspace/election-guide run build",
  "outputDirectory": "artifacts/election-guide/dist/public"
}
```

### 4. Deploy

Click **Deploy** in Vercel. The build will:
1. Install all workspace packages with pnpm
2. Build the Express API server (bundled via esbuild → `artifacts/api-server/dist/`)
3. Build the React frontend (Vite → `artifacts/election-guide/dist/public/`)
4. Serve the frontend as a static site and the API as a serverless function at `/api`

---

## Local Development

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A PostgreSQL database
- A Gemini API key

### Setup

```bash
# Install dependencies
pnpm install

# Create a .env file in the project root (or set env vars in your shell)
# Required:
export GEMINI_API_KEY=your_gemini_api_key
export DATABASE_URL=postgresql://user:password@host:5432/dbname
export PORT=3001
export BASE_PATH=/

# Optional (for candidate search):
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Run the API server

```bash
cd artifacts/api-server
pnpm dev
# Runs on http://localhost:3001
```

### Run the frontend

```bash
cd artifacts/election-guide
pnpm dev
# Runs on http://localhost:3000
```

---

## Project Structure

```
├── api/
│   └── index.ts                  # Vercel serverless function entry
├── artifacts/
│   ├── api-server/               # Express API server
│   │   └── src/
│   │       ├── routes/
│   │       │   ├── gemini.ts     # Chat, candidate search & AI routes
│   │       │   └── health.ts     # Health check endpoints
│   │       └── app.ts            # Express app setup
│   └── election-guide/           # React + Vite frontend
│       └── src/
│           ├── pages/            # Home, Candidates, FAQ, etc.
│           └── components/       # Chat UI, layout, shared components
├── lib/
│   ├── db/                       # Drizzle ORM + PostgreSQL schema
│   ├── integrations-gemini-ai/   # Google Gemini AI client
│   ├── api-spec/                 # OpenAPI specification
│   └── api-client-react/         # Generated typed API client
└── vercel.json                   # Vercel deployment config
```

## API Routes

All routes are prefixed with `/api`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/healthz` | Health check |
| `POST` | `/api/gemini/ask` | Ask a question (structured JSON response) |
| `GET` | `/api/gemini/conversations` | List chat conversations |
| `POST` | `/api/gemini/conversations` | Create a new conversation |
| `GET` | `/api/gemini/conversations/:id` | Get conversation with messages |
| `DELETE` | `/api/gemini/conversations/:id` | Delete a conversation |
| `POST` | `/api/gemini/conversations/:id/messages` | Send message (SSE streaming) |
| `GET` | `/api/gemini/candidate-search` | Search candidates by query |
| `POST` | `/api/gemini/candidate-search` | Search candidates (POST body) |
| `POST` | `/api/gemini/candidate-bio` | Generate AI biography for a candidate |

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, TanStack Query, Radix UI, Wouter
- **Backend**: Express 5, Pino logger, Drizzle ORM, PostgreSQL
- **AI**: Google Gemini 2.5 Flash via `@google/genai`
- **Data**: Supabase (candidate affidavit data from ECI via ADR/myneta.info)
- **Deployment**: Vercel (serverless functions + static hosting)
