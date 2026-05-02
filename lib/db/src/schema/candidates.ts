import { pgTable, serial, text, integer, bigint, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  mynetaId: integer("myneta_id").unique(),
  name: text("name").notNull(),
  constituency: text("constituency").notNull(),
  state: text("state"),
  party: text("party").notNull(),
  partyShort: text("party_short"),
  electionYear: integer("election_year").notNull().default(2024),
  electionType: text("election_type").notNull().default("Lok Sabha"),
  criminalCases: integer("criminal_cases"),
  education: text("education"),
  age: integer("age"),
  profession: text("profession"),
  parentage: text("parentage"),
  photoUrl: text("photo_url"),
  totalAssetsText: text("total_assets_text"),
  totalAssetsValue: bigint("total_assets_value", { mode: "number" }),
  liabilitiesText: text("liabilities_text"),
  liabilitiesValue: bigint("liabilities_value", { mode: "number" }),
  isWinner: boolean("is_winner").default(false),
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("candidates_name_idx").on(table.name),
  index("candidates_constituency_idx").on(table.constituency),
  index("candidates_party_idx").on(table.party),
  index("candidates_election_year_idx").on(table.electionYear),
]);

export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true,
  createdAt: true,
});

export type Candidate = typeof candidates.$inferSelect;
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
