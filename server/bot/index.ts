import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { storage } from '../storage';
import { setupCommands } from './commands';
import { setupEvents } from './events';

const DEVELOPER_ID = '1327725098701946987';

interface Command {
  name: string;
  description: string;
  execute: (interaction: any, client: Client) => Promise<void>;
}

interface BotClient extends Client {
  commands: Collection<string, Command>;
}

export class MagiuraBot {
  private client: BotClient;
  private token: string;

  constructor() {
    this.token = process.env.DISCORD_TOKEN || process.env.MAGIURA_BOT_TOKEN || 'MTQxODYxNTY4NTg2ODk0OTU2NQ.GLOPRS.V3gKn8Ov1dVzmEhj2hkn8RVk5BDnwm1j9fxQ28';
    
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences
      ]
    }) as BotClient;

    this.client.commands = new Collection();
    this.setupBot();
  }

  private async setupBot() {
    // Setup commands and events
    await setupCommands(this.client);
    setupEvents(this.client);

    // Bot ready event
    this.client.once('ready', async () => {
      console.log(`🤖 MAGIURA BOT is online! Logged in as ${this.client.user?.tag}`);
      
      // Notify developer
      try {
        const developer = await this.client.users.fetch(DEVELOPER_ID);
        await developer.send('🟢 **MAGIURA BOT** está online e funcionando!');
      } catch (error) {
        console.error('Could not notify developer:', error);
      }

      // Set bot status
      this.client.user?.setActivity('Serving servers with style! | .help', { type: 0 }); // 0 = Playing
    });

    // Error handling
    this.client.on('error', (error) => {
      console.error('Discord client error:', error);
    });

    process.on('unhandledRejection', (error) => {
      console.error('Unhandled promise rejection:', error);
    });
  }

  public async start() {
    try {
      await this.client.login(this.token);
    } catch (error) {
      console.error('Failed to login to Discord:', error);
      process.exit(1);
    }
  }

  public getClient(): BotClient {
    return this.client;
  }
}

// Commands setup
async function setupCommands(client: BotClient) {
  // Import all command modules
  const { setupAdminCommands } = await import('./commands/admin');
  const { setupRoleplayCommands } = await import('./commands/roleplay');
  const { setupUtilityCommands } = await import('./commands/utility');
  const { setupTinderCommands } = await import('./commands/tinder');
  const { setupMarriageCommands } = await import('./commands/marriage');
  const { setupClearCommands } = await import('./commands/clear');
  const { setupConfigCommands } = await import('./commands/config');

  // Setup each command category
  setupAdminCommands(client);
  setupRoleplayCommands(client);
  setupUtilityCommands(client);
  setupTinderCommands(client);
  setupMarriageCommands(client);
  setupClearCommands(client);
  setupConfigCommands(client);
}

// Events setup
function setupEvents(client: BotClient) {
  // Import and setup event handlers
  import('./events/messageCreate').then(({ default: messageCreate }) => {
    client.on('messageCreate', messageCreate);
  });
  
  import('./events/messageDelete').then(({ default: messageDelete }) => {
    client.on('messageDelete', messageDelete);
  });
  
  import('./events/messageUpdate').then(({ default: messageUpdate }) => {
    client.on('messageUpdate', messageUpdate);
  });
  
  import('./events/guildMemberAdd').then(({ default: guildMemberAdd }) => {
    client.on('guildMemberAdd', guildMemberAdd);
  });
  
  import('./events/guildMemberUpdate').then(({ default: guildMemberUpdate }) => {
    client.on('guildMemberUpdate', guildMemberUpdate);
  });
}

export { setupCommands, setupEvents };
