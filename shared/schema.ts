import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const githubSearchSchema = z.object({
  query: z.string().min(1),
  page: z.number().optional().default(1),
  perPage: z.number().optional().default(30),
});

export type GitHubSearchQuery = z.infer<typeof githubSearchSchema>;

export interface GitHubSearchResult {
  id: string;
  repository: string;
  owner: string;
  fileName: string;
  filePath: string;
  stars: number;
  description: string;
  codePreview: string;
  url: string;
  downloadUrl: string;
  language: "AHK v1" | "AHK v2";
}

export const personalScriptSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  content: z.string().min(1),
  tags: z.array(z.string()),
  version: z.enum(["v1", "v2"]),
});

export type InsertPersonalScript = z.infer<typeof personalScriptSchema>;

export interface PersonalScript extends InsertPersonalScript {
  id: string;
  isPersonal: boolean;
}
