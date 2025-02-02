CREATE TABLE IF NOT EXISTS "forum" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"email" text NOT NULL,
	"createdAt" date
);
--> statement-breakpoint
DROP TABLE "editorial" CASCADE;--> statement-breakpoint
DROP TABLE "questions" CASCADE;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "forum" ADD CONSTRAINT "forum_email_user_email_fk" FOREIGN KEY ("email") REFERENCES "public"."user"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
