import { text, pgTable, date, serial } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  email: text("email").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
});

export const forum = pgTable("forum", {
  id: serial("id").primaryKey(), 
  question: text("question").notNull(),
  email: text("email")
    .references(() => user.email) // references the email in the user table (foreign key)
    .notNull(), 
  createdAt: date("createdAt")
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctAnswer: text("correct_answer").notNull() // this is type of correct answer
})