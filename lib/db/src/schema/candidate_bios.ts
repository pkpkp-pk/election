import { pgTable, serial, integer, text, timestamp, index } from "drizzle-orm/pg-core";

export const candidateBios = pgTable("candidate_bios", {
  id: serial("id").primaryKey(),
  mynetaId: integer("myneta_id").unique().notNull(),
  bioJson: text("bio_json").notNull(),
  modelVersion: text("model_version").notNull().default("gpt-5.4"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("candidate_bios_myneta_id_idx").on(table.mynetaId),
]);

export type CandidateBio = typeof candidateBios.$inferSelect;
