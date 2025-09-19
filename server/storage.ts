import {
  users, guilds, guildConfigs, tinderProfiles, tinderLikes, marriages, marriageHistory,
  moderationLogs, messageLogs, guildMembers,
  type User, type InsertUser, type Guild, type InsertGuild, type GuildConfig, type InsertGuildConfig,
  type TinderProfile, type InsertTinderProfile, type TinderLike, type InsertTinderLike,
  type Marriage, type InsertMarriage, type MarriageHistory, type InsertMarriageHistory,
  type ModerationLog, type InsertModerationLog, type MessageLog, type InsertMessageLog,
  type GuildMember, type InsertGuildMember
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, or } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByDiscordId(discordId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;

  // Guilds
  getGuild(id: string): Promise<Guild | undefined>;
  getGuildByDiscordId(discordId: string): Promise<Guild | undefined>;
  createGuild(guild: InsertGuild): Promise<Guild>;
  updateGuild(id: string, guild: Partial<InsertGuild>): Promise<Guild>;

  // Guild Configs
  getGuildConfig(guildId: string): Promise<GuildConfig | undefined>;
  createGuildConfig(config: InsertGuildConfig): Promise<GuildConfig>;
  updateGuildConfig(guildId: string, config: Partial<InsertGuildConfig>): Promise<GuildConfig>;

  // Tinder System
  getTinderProfile(userId: string, guildId: string): Promise<TinderProfile | undefined>;
  createTinderProfile(profile: InsertTinderProfile): Promise<TinderProfile>;
  updateTinderProfile(id: string, profile: Partial<InsertTinderProfile>): Promise<TinderProfile>;
  getTinderLikes(userId: string, guildId: string): Promise<TinderLike[]>;
  createTinderLike(like: InsertTinderLike): Promise<TinderLike>;
  checkTinderMatch(userId1: string, userId2: string, guildId: string): Promise<boolean>;

  // Marriage System
  getMarriage(userId: string, guildId: string): Promise<Marriage | undefined>;
  createMarriage(marriage: InsertMarriage): Promise<Marriage>;
  endMarriage(marriageId: string): Promise<void>;
  getMarriageHistory(userId: string, guildId: string): Promise<MarriageHistory[]>;
  createMarriageHistory(history: InsertMarriageHistory): Promise<MarriageHistory>;

  // Moderation
  createModerationLog(log: InsertModerationLog): Promise<ModerationLog>;
  getModerationLogs(guildId: string): Promise<ModerationLog[]>;

  // Message Logging
  createMessageLog(log: InsertMessageLog): Promise<MessageLog>;
  getMessageLogs(guildId: string): Promise<MessageLog[]>;

  // Guild Members
  getGuildMember(userId: string, guildId: string): Promise<GuildMember | undefined>;
  createGuildMember(member: InsertGuildMember): Promise<GuildMember>;
  updateGuildMember(userId: string, guildId: string, member: Partial<InsertGuildMember>): Promise<GuildMember>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByDiscordId(discordId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.discordId, discordId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return user;
  }

  // Guilds
  async getGuild(id: string): Promise<Guild | undefined> {
    const [guild] = await db.select().from(guilds).where(eq(guilds.id, id));
    return guild || undefined;
  }

  async getGuildByDiscordId(discordId: string): Promise<Guild | undefined> {
    const [guild] = await db.select().from(guilds).where(eq(guilds.discordId, discordId));
    return guild || undefined;
  }

  async createGuild(insertGuild: InsertGuild): Promise<Guild> {
    const [guild] = await db.insert(guilds).values(insertGuild).returning();
    return guild;
  }

  async updateGuild(id: string, updateData: Partial<InsertGuild>): Promise<Guild> {
    const [guild] = await db.update(guilds).set(updateData).where(eq(guilds.id, id)).returning();
    return guild;
  }

  // Guild Configs
  async getGuildConfig(guildId: string): Promise<GuildConfig | undefined> {
    const [config] = await db.select().from(guildConfigs).where(eq(guildConfigs.guildId, guildId));
    return config || undefined;
  }

  async createGuildConfig(insertConfig: InsertGuildConfig): Promise<GuildConfig> {
    const [config] = await db.insert(guildConfigs).values(insertConfig).returning();
    return config;
  }

  async updateGuildConfig(guildId: string, updateData: Partial<InsertGuildConfig>): Promise<GuildConfig> {
    const [config] = await db.update(guildConfigs).set(updateData).where(eq(guildConfigs.guildId, guildId)).returning();
    return config;
  }

  // Tinder System
  async getTinderProfile(userId: string, guildId: string): Promise<TinderProfile | undefined> {
    const [profile] = await db.select().from(tinderProfiles)
      .where(and(eq(tinderProfiles.userId, userId), eq(tinderProfiles.guildId, guildId)));
    return profile || undefined;
  }

  async createTinderProfile(insertProfile: InsertTinderProfile): Promise<TinderProfile> {
    const [profile] = await db.insert(tinderProfiles).values(insertProfile).returning();
    return profile;
  }

  async updateTinderProfile(id: string, updateData: Partial<InsertTinderProfile>): Promise<TinderProfile> {
    const [profile] = await db.update(tinderProfiles).set(updateData).where(eq(tinderProfiles.id, id)).returning();
    return profile;
  }

  async getTinderLikes(userId: string, guildId: string): Promise<TinderLike[]> {
    return await db.select().from(tinderLikes)
      .where(and(eq(tinderLikes.toUserId, userId), eq(tinderLikes.guildId, guildId)));
  }

  async createTinderLike(insertLike: InsertTinderLike): Promise<TinderLike> {
    const [like] = await db.insert(tinderLikes).values(insertLike).returning();
    return like;
  }

  async checkTinderMatch(userId1: string, userId2: string, guildId: string): Promise<boolean> {
    const [match] = await db.select().from(tinderLikes)
      .where(and(
        or(
          and(eq(tinderLikes.fromUserId, userId1), eq(tinderLikes.toUserId, userId2)),
          and(eq(tinderLikes.fromUserId, userId2), eq(tinderLikes.toUserId, userId1))
        ),
        eq(tinderLikes.guildId, guildId),
        eq(tinderLikes.isMatch, true)
      ));
    return !!match;
  }

  // Marriage System
  async getMarriage(userId: string, guildId: string): Promise<Marriage | undefined> {
    const [marriage] = await db.select().from(marriages)
      .where(and(
        or(eq(marriages.userId1, userId), eq(marriages.userId2, userId)),
        eq(marriages.guildId, guildId),
        eq(marriages.active, true)
      ));
    return marriage || undefined;
  }

  async createMarriage(insertMarriage: InsertMarriage): Promise<Marriage> {
    const [marriage] = await db.insert(marriages).values(insertMarriage).returning();
    return marriage;
  }

  async endMarriage(marriageId: string): Promise<void> {
    await db.update(marriages)
      .set({ active: false, divorcedAt: new Date() })
      .where(eq(marriages.id, marriageId));
  }

  async getMarriageHistory(userId: string, guildId: string): Promise<MarriageHistory[]> {
    return await db.select().from(marriageHistory)
      .where(and(eq(marriageHistory.userId, userId), eq(marriageHistory.guildId, guildId)))
      .orderBy(desc(marriageHistory.marriedAt));
  }

  async createMarriageHistory(insertHistory: InsertMarriageHistory): Promise<MarriageHistory> {
    const [history] = await db.insert(marriageHistory).values(insertHistory).returning();
    return history;
  }

  // Moderation
  async createModerationLog(insertLog: InsertModerationLog): Promise<ModerationLog> {
    const [log] = await db.insert(moderationLogs).values(insertLog).returning();
    return log;
  }

  async getModerationLogs(guildId: string): Promise<ModerationLog[]> {
    return await db.select().from(moderationLogs)
      .where(eq(moderationLogs.guildId, guildId))
      .orderBy(desc(moderationLogs.createdAt));
  }

  // Message Logging
  async createMessageLog(insertLog: InsertMessageLog): Promise<MessageLog> {
    const [log] = await db.insert(messageLogs).values(insertLog).returning();
    return log;
  }

  async getMessageLogs(guildId: string): Promise<MessageLog[]> {
    return await db.select().from(messageLogs)
      .where(eq(messageLogs.guildId, guildId))
      .orderBy(desc(messageLogs.createdAt));
  }

  // Guild Members
  async getGuildMember(userId: string, guildId: string): Promise<GuildMember | undefined> {
    const [member] = await db.select().from(guildMembers)
      .where(and(eq(guildMembers.userId, userId), eq(guildMembers.guildId, guildId)));
    return member || undefined;
  }

  async createGuildMember(insertMember: InsertGuildMember): Promise<GuildMember> {
    const [member] = await db.insert(guildMembers).values(insertMember).returning();
    return member;
  }

  async updateGuildMember(userId: string, guildId: string, updateData: Partial<InsertGuildMember>): Promise<GuildMember> {
    const [member] = await db.update(guildMembers).set(updateData)
      .where(and(eq(guildMembers.userId, userId), eq(guildMembers.guildId, guildId)))
      .returning();
    return member;
  }
}

export const storage = new DatabaseStorage();
