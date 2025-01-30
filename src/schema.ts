import { text, pgTable, date, serial } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  email: text("email").primaryKey(),
  name: text("name").notNull(),
  googleid: text("googleid").notNull(),
});

export const forum = pgTable("forum", {
  id: serial("id").primaryKey(), 
  question: text("question").notNull(),
  email: text("email")
    .references(() => user.email) // references the email in the user table (foreign key)
    .notNull(), 
  createdAt: date("createdAt")
});
