import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  discordId: varchar("discord_id").notNull().unique(),
  username: text("username").notNull(),
  discriminator: text("discriminator"),
  avatar: text("avatar"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const guilds = pgTable("guilds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  discordId: varchar("discord_id").notNull().unique(),
  name: text("name").notNull(),
  icon: text("icon"),
  ownerId: varchar("owner_id").notNull(),
  prefix: varchar("prefix").default("."),
  language: varchar("language").default("pt-BR"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const guildConfigs = pgTable("guild_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  guildId: varchar("guild_id").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  moderationEnabled: boolean("moderation_enabled").default(true),
  roleplayEnabled: boolean("roleplay_enabled").default(true),
  tinderEnabled: boolean("tinder_enabled").default(false),
  marriageEnabled: boolean("marriage_enabled").default(true),
  loggingEnabled: boolean("logging_enabled").default(false),
  clearSystemEnabled: boolean("clear_system_enabled").default(false),
  clearTrigger: varchar("clear_trigger").default(".cl"),
  clearAmount: integer("clear_amount").default(100),
  logChannelMessages: varchar("log_channel_messages"),
  logChannelMembers: varchar("log_channel_members"),
  logChannelServer: varchar("log_channel_server"),
  clearRoles: jsonb("clear_roles").default("[]"),
  clearUsers: jsonb("clear_users").default("[]"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tinderProfiles = pgTable("tinder_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  guildId: varchar("guild_id").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  bio: text("bio"),
  age: integer("age"),
  interests: jsonb("interests").default("[]"),
  active: boolean("active").default(true),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tinderLikes = pgTable("tinder_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").notNull(),
  toUserId: varchar("to_user_id").notNull(),
  guildId: varchar("guild_id").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  isMatch: boolean("is_match").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marriages = pgTable("marriages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId1: varchar("user_id_1").notNull(),
  userId2: varchar("user_id_2").notNull(),
  guildId: varchar("guild_id").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  active: boolean("active").default(true),
  marriedAt: timestamp("married_at").defaultNow(),
  divorcedAt: timestamp("divorced_at"),
});

export const marriageHistory = pgTable("marriage_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  partnerId: varchar("partner_id").notNull(),
  guildId: varchar("guild_id").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  marriedAt: timestamp("married_at").notNull(),
  divorcedAt: timestamp("divorced_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const moderationLogs = pgTable("moderation_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  guildId: varchar("guild_id").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  moderatorId: varchar("moderator_id").notNull(),
  targetId: varchar("target_id").notNull(),
  action: varchar("action").notNull(), // ban, kick, mute, unmute, unban
  reason: text("reason"),
  duration: integer("duration"), // in minutes for mutes
  createdAt: timestamp("created_at").defaultNow(),
});

export const messageLogs = pgTable("message_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  guildId: varchar("guild_id").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  channelId: varchar("channel_id").notNull(),
  messageId: varchar("message_id").notNull(),
  authorId: varchar("author_id").notNull(),
  content: text("content"),
  action: varchar("action").notNull(), // create, edit, delete
  oldContent: text("old_content"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const guildMembers = pgTable("guild_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  guildId: varchar("guild_id").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  nickname: text("nickname"),
  joinedAt: timestamp("joined_at").defaultNow(),
  roles: jsonb("roles").default("[]"),
  muted: boolean("muted").default(false),
  muteExpires: timestamp("mute_expires"),
});

// Relations
export const guildsRelations = relations(guilds, ({ one, many }) => ({
  config: one(guildConfigs, {
    fields: [guilds.id],
    references: [guildConfigs.guildId],
  }),
  tinderProfiles: many(tinderProfiles),
  tinderLikes: many(tinderLikes),
  marriages: many(marriages),
  moderationLogs: many(moderationLogs),
  messageLogs: many(messageLogs),
  members: many(guildMembers),
}));

export const guildConfigsRelations = relations(guildConfigs, ({ one }) => ({
  guild: one(guilds, {
    fields: [guildConfigs.guildId],
    references: [guilds.id],
  }),
}));

export const tinderProfilesRelations = relations(tinderProfiles, ({ one }) => ({
  guild: one(guilds, {
    fields: [tinderProfiles.guildId],
    references: [guilds.id],
  }),
}));

export const tinderLikesRelations = relations(tinderLikes, ({ one }) => ({
  guild: one(guilds, {
    fields: [tinderLikes.guildId],
    references: [guilds.id],
  }),
}));

export const marriagesRelations = relations(marriages, ({ one }) => ({
  guild: one(guilds, {
    fields: [marriages.guildId],
    references: [guilds.id],
  }),
}));

export const marriageHistoryRelations = relations(marriageHistory, ({ one }) => ({
  guild: one(guilds, {
    fields: [marriageHistory.guildId],
    references: [guilds.id],
  }),
}));

export const moderationLogsRelations = relations(moderationLogs, ({ one }) => ({
  guild: one(guilds, {
    fields: [moderationLogs.guildId],
    references: [guilds.id],
  }),
}));

export const messageLogsRelations = relations(messageLogs, ({ one }) => ({
  guild: one(guilds, {
    fields: [messageLogs.guildId],
    references: [guilds.id],
  }),
}));

export const guildMembersRelations = relations(guildMembers, ({ one }) => ({
  guild: one(guilds, {
    fields: [guildMembers.guildId],
    references: [guilds.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertGuildSchema = createInsertSchema(guilds).omit({ id: true, createdAt: true });
export const insertGuildConfigSchema = createInsertSchema(guildConfigs).omit({ id: true, createdAt: true });
export const insertTinderProfileSchema = createInsertSchema(tinderProfiles).omit({ id: true, createdAt: true });
export const insertTinderLikeSchema = createInsertSchema(tinderLikes).omit({ id: true, createdAt: true });
export const insertMarriageSchema = createInsertSchema(marriages).omit({ id: true });
export const insertMarriageHistorySchema = createInsertSchema(marriageHistory).omit({ id: true, createdAt: true });
export const insertModerationLogSchema = createInsertSchema(moderationLogs).omit({ id: true, createdAt: true });
export const insertMessageLogSchema = createInsertSchema(messageLogs).omit({ id: true, createdAt: true });
export const insertGuildMemberSchema = createInsertSchema(guildMembers).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Guild = typeof guilds.$inferSelect;
export type InsertGuild = z.infer<typeof insertGuildSchema>;
export type GuildConfig = typeof guildConfigs.$inferSelect;
export type InsertGuildConfig = z.infer<typeof insertGuildConfigSchema>;
export type TinderProfile = typeof tinderProfiles.$inferSelect;
export type InsertTinderProfile = z.infer<typeof insertTinderProfileSchema>;
export type TinderLike = typeof tinderLikes.$inferSelect;
export type InsertTinderLike = z.infer<typeof insertTinderLikeSchema>;
export type Marriage = typeof marriages.$inferSelect;
export type InsertMarriage = z.infer<typeof insertMarriageSchema>;
export type MarriageHistory = typeof marriageHistory.$inferSelect;
export type InsertMarriageHistory = z.infer<typeof insertMarriageHistorySchema>;
export type ModerationLog = typeof moderationLogs.$inferSelect;
export type InsertModerationLog = z.infer<typeof insertModerationLogSchema>;
export type MessageLog = typeof messageLogs.$inferSelect;
export type InsertMessageLog = z.infer<typeof insertMessageLogSchema>;
export type GuildMember = typeof guildMembers.$inferSelect;
export type InsertGuildMember = z.infer<typeof insertGuildMemberSchema>;
