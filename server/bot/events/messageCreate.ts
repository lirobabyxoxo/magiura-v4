import { Message } from 'discord.js';
import { storage } from '../../storage';

export default async function messageCreate(message: Message) {
  if (message.author.bot) return;
  if (!message.guild) return;

  try {
    // Log message creation
    const guildConfig = await storage.getGuildConfig(message.guild.id);
    
    if (guildConfig?.loggingEnabled && guildConfig.logChannelMessages) {
      await storage.createMessageLog({
        guildId: message.guild.id,
        channelId: message.channel.id,
        messageId: message.id,
        authorId: message.author.id,
        content: message.content,
        action: 'create'
      });
    }

    // Handle prefix commands
    const prefix = guildConfig?.prefix || '.';
    
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const client = message.client as any;
    const command = client.commands.get(commandName);

    if (!command) return;

    // Handle clear system trigger
    if (commandName === 'cl' || commandName === guildConfig?.clearTrigger?.replace('.', '')) {
      if (!guildConfig?.clearSystemEnabled) return;

      try {
        const amount = guildConfig.clearAmount || 100;
        
        if (message.channel && 'bulkDelete' in message.channel) {
          await message.delete();
          await message.channel.bulkDelete(amount, true);
        }
      } catch (error) {
        console.error('Clear system error:', error);
      }
      return;
    }

    // Execute command (convert to interaction-like object for compatibility)
    try {
      const fakeInteraction = {
        user: message.author,
        member: message.member,
        guild: message.guild,
        channel: message.channel,
        options: {
          getUser: (name: string) => message.mentions.users.first(),
          getString: (name: string) => args[0],
          getInteger: (name: string) => parseInt(args[0]) || null
        },
        reply: async (options: any) => {
          if (typeof options === 'string') {
            return message.reply(options);
          }
          return message.reply(options);
        }
      };

      await command.execute(fakeInteraction);
    } catch (error) {
      console.error('Command execution error:', error);
      await message.reply('❌ An error occurred while executing this command.');
    }
  } catch (error) {
    console.error('Message create event error:', error);
  }
}
