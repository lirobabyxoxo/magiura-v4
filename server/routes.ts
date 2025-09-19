import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { MagiuraBot } from "./bot";
import authRoutes from "./api/auth";
import dashboardRoutes from "./api/dashboard";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Bot statistics endpoint
  app.get("/api/bot/stats", async (req, res) => {
    try {
      // This would get actual bot statistics
      res.json({
        guilds: 0,
        users: 0,
        commands: 0,
        uptime: process.uptime()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get bot statistics" });
    }
  });

  // Initialize Discord bot
  const bot = new MagiuraBot();
  await bot.start();

  const httpServer = createServer(app);
  return httpServer;
}
