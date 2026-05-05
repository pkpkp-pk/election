import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Parse the DATABASE_URL manually to bypass pg-connection-string's SSL handling.
// When passing a connectionString, pg internally uses pg-connection-string which
// can re-apply sslmode from the URL and override our explicit ssl config — causing
// "self-signed certificate in certificate chain" errors on Supabase's pooler.
// By parsing ourselves and passing individual options, we retain full SSL control.
const dbUrl = new URL(process.env.DATABASE_URL);
const isLocal = dbUrl.hostname === "localhost" || dbUrl.hostname === "127.0.0.1";

export const pool = new Pool({
  host: dbUrl.hostname,
  port: dbUrl.port ? parseInt(dbUrl.port, 10) : 5432,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1), // strip leading "/"
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });

export * from "./schema";
