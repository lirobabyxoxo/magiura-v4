import { Message } from 'discord.js';
import { storage } from '../../storage';
import { createEmbed } from '../utils/embeds';

export default async function messageUpdate(oldMessage: Message, newMessage: Message) {
  if (newMessage.author?.bot) return;
  if (!newMessage.guild) return;
  if (oldMessage.content === newMessage.content) return;

  try {
    const guildConfig = await storage.getGuildConfig(newMessage.guild.id);
    
    if (!guildConfig?.loggingEnabled || !guildConfig.logChannelMessages) return;

    // Log message edit
    await storage.createMessageLog({
      guildId: newMessage.guild.id,
      channelId: newMessage.channel.id,
      messageId: newMessage.id,
      authorId: newMessage.author?.id || 'Unknown',
      content: newMessage.content || 'No content',
      action: 'edit',
      oldContent: oldMessage.content || 'No content'
    });

    // Send log to channel
    const logChannel = newMessage.guild.channels.cache.get(guildConfig.logChannelMessages);
    
    if (logChannel && logChannel.isTextBased()) {
      const embed = createEmbed({
        title: '✏️ Message Edited',
        fields: [
          { name: 'Author', value: newMessage.author?.tag || 'Unknown', inline: true },
          { name: 'Channel', value: `<#${newMessage.channel.id}>`, inline: true },
          { name: 'Before', value: oldMessage.content || 'No content', inline: false },
          { name: 'After', value: newMessage.content || 'No content', inline: false },
          { name: 'Edited At', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
        ],
        color: 'Yellow'
      });

      await logChannel.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error('Message update event error:', error);
  }
}
