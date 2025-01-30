import { text, pgTable } from "drizzle-orm/pg-core";

// user table schema remains the same
export const user = pgTable("user", {
  email: text("email").primaryKey(), // make email the primary key
  name: text("name").notNull(),
  googleid: text("googleid").notNull(),
});
