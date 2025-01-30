import { text, pgTable, date } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  email: text("email").primaryKey(),
  name: text("name").notNull(),
  googleid: text("googleid").notNull(),
});

export const forum = pgTable("forum", {
  question: text("question").notNull(),
  email: text("email")
    .references(() => user.email) // references the email in the user table (foreign key)
    .notNull(), 
  createdAt: date("createdAt")
    .default('CURRENT_DATE') // Set the default value to current date
});
