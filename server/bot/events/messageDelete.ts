import { Message } from 'discord.js';
import { storage } from '../../storage';
import { createEmbed } from '../utils/embeds';

export default async function messageDelete(message: Message) {
  if (message.author?.bot) return;
  if (!message.guild) return;

  try {
    const guildConfig = await storage.getGuildConfig(message.guild.id);
    
    if (!guildConfig?.loggingEnabled || !guildConfig.logChannelMessages) return;

    // Log message deletion
    await storage.createMessageLog({
      guildId: message.guild.id,
      channelId: message.channel.id,
      messageId: message.id,
      authorId: message.author?.id || 'Unknown',
      content: message.content || 'No content',
      action: 'delete'
    });

    // Send log to channel
    const logChannel = message.guild.channels.cache.get(guildConfig.logChannelMessages);
    
    if (logChannel && logChannel.isTextBased()) {
      const embed = createEmbed({
        title: '🗑️ Message Deleted',
        fields: [
          { name: 'Author', value: message.author?.tag || 'Unknown', inline: true },
          { name: 'Channel', value: `<#${message.channel.id}>`, inline: true },
          { name: 'Content', value: message.content || 'No content', inline: false },
          { name: 'Deleted At', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
        ],
        color: 'Red'
      });

      await logChannel.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error('Message delete event error:', error);
  }
}
