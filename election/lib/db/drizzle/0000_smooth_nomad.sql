CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" serial PRIMARY KEY NOT NULL,
	"myneta_id" integer,
	"name" text NOT NULL,
	"constituency" text NOT NULL,
	"state" text,
	"party" text NOT NULL,
	"party_short" text,
	"election_year" integer DEFAULT 2024 NOT NULL,
	"election_type" text DEFAULT 'Lok Sabha' NOT NULL,
	"criminal_cases" integer DEFAULT 0,
	"education" text,
	"total_assets_text" text,
	"total_assets_value" bigint,
	"liabilities_text" text,
	"liabilities_value" bigint,
	"is_winner" boolean DEFAULT false,
	"source_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "candidates_myneta_id_unique" UNIQUE("myneta_id")
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "candidates_name_idx" ON "candidates" USING btree ("name");--> statement-breakpoint
CREATE INDEX "candidates_constituency_idx" ON "candidates" USING btree ("constituency");--> statement-breakpoint
CREATE INDEX "candidates_party_idx" ON "candidates" USING btree ("party");--> statement-breakpoint
CREATE INDEX "candidates_election_year_idx" ON "candidates" USING btree ("election_year");