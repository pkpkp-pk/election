import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { pool } from "@workspace/db";

const router: IRouter = Router();

// ─── Simple liveness probe (unchanged) ────────────────────────────────────────
router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

// ─── Deep readiness probe ─────────────────────────────────────────────────────
// Checks every backing service and returns a structured report.
// Returns 200 when all configured services are reachable, 503 otherwise.
// Safe to call at any time — each check has a 3-second timeout.
router.get("/health", async (req, res) => {
  const CHECK_TIMEOUT_MS = 3000;
  const overallStart = Date.now();

  type ServiceResult =
    | { configured: false }
    | { configured: true; ok: boolean; latencyMs: number; error?: string };

  type SupabaseResult = { configured: true; ok: boolean; latencyMs: number; error?: string; rowCount?: number };

  const results: {
    postgres: ServiceResult;
    supabase: ServiceResult | SupabaseResult;
    gemini: { configured: boolean };
  } = {
    postgres: { configured: false },
    supabase: { configured: false },
    gemini: { configured: false },
  };

  // ── Gemini — key presence only (no actual API call) ─────────────────────────
  results.gemini.configured = !!(
    process.env.AI_INTEGRATIONS_GEMINI_API_KEY || process.env.GEMINI_API_KEY
  );

  // ── Postgres — SELECT 1 via the shared pool ───────────────────────────────────
  results.postgres = { configured: true, ok: false, latencyMs: 0 };
  {
    const t = Date.now();
    try {
      await Promise.race([
        pool.query("SELECT 1"),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("timeout after 3s")), CHECK_TIMEOUT_MS),
        ),
      ]);
      results.postgres = { configured: true, ok: true, latencyMs: Date.now() - t };
    } catch (err) {
      results.postgres = {
        configured: true,
        ok: false,
        latencyMs: Date.now() - t,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  // ── Supabase — lightweight HEAD query against the candidates table ────────────
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    results.supabase = { configured: true, ok: false, latencyMs: 0 };
    const t = Date.now();
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const client = createClient(supabaseUrl, supabaseKey);

      const result = await Promise.race([
        client.from("candidates").select("id", { count: "exact", head: true }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("timeout after 3s")), CHECK_TIMEOUT_MS),
        ),
      ]);

      if (result.error) throw new Error(result.error.message);

      const supabaseResult: SupabaseResult = {
        configured: true,
        ok: true,
        latencyMs: Date.now() - t,
        ...(result.count != null ? { rowCount: result.count } : {}),
      };
      results.supabase = supabaseResult;
    } catch (err) {
      results.supabase = {
        configured: true,
        ok: false,
        latencyMs: Date.now() - t,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  // ── Overall status ────────────────────────────────────────────────────────────
  const checks = [results.postgres, results.supabase]
    .filter((s): s is Extract<ServiceResult, { configured: true }> => s.configured)
    .map((s) => s.ok);

  const status =
    checks.length === 0
      ? "unconfigured"
      : checks.every(Boolean)
        ? "ok"
        : checks.some(Boolean)
          ? "degraded"
          : "error";

  req.log.info({ status, services: results }, "health check");

  res.status(status === "error" ? 503 : 200).json({
    status,
    uptimeMs: Date.now() - overallStart,
    env: {
      vercel: !!process.env.VERCEL,
      nodeEnv: process.env.NODE_ENV ?? "unknown",
    },
    services: results,
  });
});

export default router;
