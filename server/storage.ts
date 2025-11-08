import { type User, type InsertUser, type PersonalScript, type InsertPersonalScript } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllScripts(): Promise<PersonalScript[]>;
  getCuratedScripts(): Promise<PersonalScript[]>;
  getPersonalScripts(): Promise<PersonalScript[]>;
  getPersonalScript(id: string): Promise<PersonalScript | undefined>;
  createPersonalScript(script: InsertPersonalScript): Promise<PersonalScript>;
  createCuratedScript(script: InsertPersonalScript): Promise<PersonalScript>;
  deletePersonalScript(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private personalScripts: Map<string, PersonalScript>;

  constructor() {
    this.users = new Map();
    this.personalScripts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllScripts(): Promise<PersonalScript[]> {
    return Array.from(this.personalScripts.values());
  }

  async getCuratedScripts(): Promise<PersonalScript[]> {
    return Array.from(this.personalScripts.values()).filter(script => !script.isPersonal);
  }

  async getPersonalScripts(): Promise<PersonalScript[]> {
    return Array.from(this.personalScripts.values()).filter(script => script.isPersonal);
  }

  async getPersonalScript(id: string): Promise<PersonalScript | undefined> {
    return this.personalScripts.get(id);
  }

  async createPersonalScript(insertScript: InsertPersonalScript): Promise<PersonalScript> {
    const id = randomUUID();
    const script: PersonalScript = { ...insertScript, id, isPersonal: true };
    this.personalScripts.set(id, script);
    return script;
  }

  async createCuratedScript(insertScript: InsertPersonalScript): Promise<PersonalScript> {
    const id = randomUUID();
    const script: PersonalScript = { ...insertScript, id, isPersonal: false };
    this.personalScripts.set(id, script);
    return script;
  }

  async deletePersonalScript(id: string): Promise<boolean> {
    return this.personalScripts.delete(id);
  }
}

export const storage = new MemStorage();
