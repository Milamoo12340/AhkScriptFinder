import { type User, type InsertUser, type PersonalMacro, type InsertPersonalMacro, users, personalMacros as personalMacrosTable } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllMacros(): Promise<PersonalMacro[]>;
  getCuratedMacros(): Promise<PersonalMacro[]>;
  getPersonalMacros(): Promise<PersonalMacro[]>;
  getPersonalMacro(id: string): Promise<PersonalMacro | undefined>;
  createPersonalMacro(macro: InsertPersonalMacro): Promise<PersonalMacro>;
  createCuratedMacro(macro: InsertPersonalMacro): Promise<PersonalMacro>;
  deletePersonalMacro(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllMacros(): Promise<PersonalMacro[]> {
    return await db.select().from(personalMacrosTable);
  }

  async getCuratedMacros(): Promise<PersonalMacro[]> {
    return await db.select().from(personalMacrosTable).where(eq(personalMacrosTable.isPersonal, false));
  }

  async getPersonalMacros(): Promise<PersonalMacro[]> {
    return await db.select().from(personalMacrosTable).where(eq(personalMacrosTable.isPersonal, true));
  }

  async getPersonalMacro(id: string): Promise<PersonalMacro | undefined> {
    const [macro] = await db.select().from(personalMacrosTable).where(eq(personalMacrosTable.id, id));
    return macro;
  }

  async createPersonalMacro(insertMacro: InsertPersonalMacro): Promise<PersonalMacro> {
    const [macro] = await db.insert(personalMacrosTable).values({ ...insertMacro, isPersonal: true }).returning();
    return macro;
  }

  async createCuratedMacro(insertMacro: InsertPersonalMacro): Promise<PersonalMacro> {
    const [macro] = await db.insert(personalMacrosTable).values({ ...insertMacro, isPersonal: false }).returning();
    return macro;
  }

  async deletePersonalMacro(id: string): Promise<boolean> {
    const [deleted] = await db.delete(personalMacrosTable).where(eq(personalMacrosTable.id, id)).returning();
    return !!deleted;
  }
}

export const storage = new DatabaseStorage();
