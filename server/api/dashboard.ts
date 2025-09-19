import express from "express";
import { storage } from "../storage";

const router = express.Router();

// Authentication middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

// Get user's guilds
router.get("/guilds", requireAuth, async (req: any, res) => {
  try {
    const user = req.session.user;
    
    // In a real implementation, this would fetch guilds from Discord API
    // where the bot is present and the user has manage permissions
    const guilds = [
      {
        id: "example-guild-1",
        name: "Example Server",
        icon: null,
        memberCount: 1234,
        botPresent: true,
        permissions: ["MANAGE_GUILD"]
      }
    ];

    res.json(guilds);
  } catch (error) {
    console.error('Error fetching guilds:', error);
    res.status(500).json({ message: "Failed to fetch guilds" });
  }
});

// Get guild configuration
router.get("/guild/:guildId/config", requireAuth, async (req: any, res) => {
  try {
    const { guildId } = req.params;
    
    const guild = await storage.getGuildByDiscordId(guildId);
    if (!guild) {
      return res.status(404).json({ message: "Guild not found" });
    }

    const config = await storage.getGuildConfig(guild.id);
    res.json(config);
  } catch (error) {
    console.error('Error fetching guild config:', error);
    res.status(500).json({ message: "Failed to fetch guild configuration" });
  }
});

// Update guild configuration
router.put("/guild/:guildId/config", requireAuth, async (req: any, res) => {
  try {
    const { guildId } = req.params;
    const configUpdate = req.body;

    let guild = await storage.getGuildByDiscordId(guildId);
    if (!guild) {
      // Create guild if it doesn't exist
      guild = await storage.createGuild({
        discordId: guildId,
        name: "Unknown Guild", // This would be fetched from Discord API
        ownerId: req.session.user.discordId,
      });
    }

    let config = await storage.getGuildConfig(guild.id);
    if (!config) {
      config = await storage.createGuildConfig({
        guildId: guild.id,
        ...configUpdate
      });
    } else {
      config = await storage.updateGuildConfig(guild.id, configUpdate);
    }

    res.json(config);
  } catch (error) {
    console.error('Error updating guild config:', error);
    res.status(500).json({ message: "Failed to update guild configuration" });
  }
});

// Get moderation logs
router.get("/guild/:guildId/logs/moderation", requireAuth, async (req: any, res) => {
  try {
    const { guildId } = req.params;
    
    const guild = await storage.getGuildByDiscordId(guildId);
    if (!guild) {
      return res.status(404).json({ message: "Guild not found" });
    }

    const logs = await storage.getModerationLogs(guild.id);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching moderation logs:', error);
    res.status(500).json({ message: "Failed to fetch moderation logs" });
  }
});

// Get message logs
router.get("/guild/:guildId/logs/messages", requireAuth, async (req: any, res) => {
  try {
    const { guildId } = req.params;
    
    const guild = await storage.getGuildByDiscordId(guildId);
    if (!guild) {
      return res.status(404).json({ message: "Guild not found" });
    }

    const logs = await storage.getMessageLogs(guild.id);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching message logs:', error);
    res.status(500).json({ message: "Failed to fetch message logs" });
  }
});

// Get bot statistics
router.get("/stats", requireAuth, async (req: any, res) => {
  try {
    // This would get real statistics from the bot
    const stats = {
      guilds: 0,
      users: 0,
      commands: 0,
      uptime: process.uptime(),
      features: {
        moderation: true,
        roleplay: true,
        tinder: false,
        marriage: true,
        logging: false,
        clearSystem: false
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching bot stats:', error);
    res.status(500).json({ message: "Failed to fetch bot statistics" });
  }
});

export default router;
