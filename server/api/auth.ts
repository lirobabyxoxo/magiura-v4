import express from "express";
import session from "express-session";
import { storage } from "../storage";

const router = express.Router();

// Session middleware
router.use(session({
  secret: process.env.SESSION_SECRET || 'magiura-bot-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      discordId: string;
      username: string;
      discriminator?: string;
      avatar?: string;
      email?: string;
    };
  }
}

// Get current user
router.get("/user", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  res.json(req.session.user);
});

// Discord OAuth login
router.get("/discord", async (req, res) => {
  const clientId = process.env.DISCORD_CLIENT_ID || '1418615685868949565';
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI || 'http://localhost:5000/api/auth/discord/callback');
  const scope = encodeURIComponent('identify email guilds');
  
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  
  res.redirect(discordAuthUrl);
});

// Discord OAuth callback
router.get("/discord/callback", async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.redirect('/login?error=no_code');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID || '1418615685868949565',
        client_secret: process.env.DISCORD_CLIENT_SECRET || '',
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: process.env.DISCORD_REDIRECT_URI || 'http://localhost:5000/api/auth/discord/callback',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Discord token error:', tokenData);
      return res.redirect('/login?error=token_error');
    }

    // Get user info from Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const discordUser = await userResponse.json();

    if (!userResponse.ok) {
      console.error('Discord user error:', discordUser);
      return res.redirect('/login?error=user_error');
    }

    // Create or update user in database
    let user = await storage.getUserByDiscordId(discordUser.id);
    
    if (!user) {
      user = await storage.createUser({
        discordId: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator,
        avatar: discordUser.avatar,
        email: discordUser.email,
      });
    } else {
      user = await storage.updateUser(user.id, {
        username: discordUser.username,
        discriminator: discordUser.discriminator,
        avatar: discordUser.avatar,
        email: discordUser.email,
      });
    }

    // Store user in session
    req.session.user = {
      id: user.id,
      discordId: user.discordId,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
      email: user.email,
    };

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Discord OAuth error:', error);
    res.redirect('/login?error=oauth_error');
  }
});

// Logout
router.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
