# Overview

This is a comprehensive Discord bot application called MAGIURA BOT that provides moderation, roleplay, social features, and server management tools. The application is built as a full-stack TypeScript project with a React frontend dashboard and an Express.js backend that integrates with Discord.js for bot functionality. The bot includes advanced features like a Tinder-style dating system, marriage system, extensive logging capabilities, and multi-language support (Portuguese and English).

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Custom component system built on Radix UI primitives with Tailwind CSS
- **Styling**: Dark-themed design system using CSS custom properties and Tailwind CSS
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for client-side routing
- **Component Structure**: Modular component architecture with reusable UI components in `/components/ui/`

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Discord Integration**: Discord.js v14 for bot functionality with comprehensive command handling
- **API Structure**: RESTful API with separate route modules for authentication and dashboard functionality
- **Session Management**: Express sessions for user authentication
- **Bot Commands**: Modular command system supporting both slash commands and prefix commands

## Database Layer
- **ORM**: Drizzle ORM with PostgreSQL as the database engine
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Design**: Comprehensive relational schema supporting users, guilds, configurations, tinder profiles, marriages, and logging
- **Migration System**: Drizzle Kit for schema migrations and database management

## Bot Features Architecture
- **Moderation System**: Ban, kick, mute, unmute, unban commands with permission checks and logging
- **Roleplay System**: Interactive commands with anime GIF integration (kiss, hug, pat, slap, kill)
- **Tinder System**: Complete dating platform with profiles, likes, matches, and browsing functionality
- **Marriage System**: Proposal system with acceptance/decline mechanics and relationship history tracking
- **Logging System**: Comprehensive event logging for messages, member changes, and server events
- **Clear System**: Configurable bulk message deletion with role-based permissions
- **Multi-language Support**: Portuguese (PT-BR) and English language switching

## Authentication & Authorization
- **Discord OAuth2**: Integration for user authentication via Discord
- **Session-based Auth**: Server-side session management for dashboard access
- **Permission System**: Role-based and permission-based access control for bot commands
- **Developer Privileges**: Special permissions for bot developer (ID: 1327725098701946987)

## Configuration Management
- **Guild Configurations**: Per-server settings stored in database
- **Feature Toggles**: Enable/disable features per server
- **Dashboard Configuration**: Web-based configuration interface with real-time updates
- **DM Configuration**: Private message configuration system for administrators

# External Dependencies

## Discord Integration
- **Discord.js**: Primary library for Discord API interaction
- **Discord Developer Portal**: Bot registration and token management
- **Discord OAuth2**: User authentication and server access verification

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Database Connection**: Connection pooling via @neondatabase/serverless

## UI Component Libraries
- **Radix UI**: Headless UI component primitives for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide Icons**: Icon library for UI elements
- **Font Awesome**: Additional icons for bot-specific UI elements

## Development Tools
- **Vite**: Frontend build tool and development server
- **ESBuild**: Backend bundling for production deployment
- **TypeScript**: Type safety across the entire application
- **Replit Integration**: Development environment plugins for Replit platform

## Third-party APIs
- **Anime GIF APIs**: Integration placeholder for services like Nekos.life or Tenor for roleplay commands
- **WebSocket Support**: For real-time Discord connection via ws library