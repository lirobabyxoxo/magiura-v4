import { GuildMember } from 'discord.js';
import { storage } from '../../storage';
import { createEmbed } from '../utils/embeds';

export default async function guildMemberAdd(member: GuildMember) {
  try {
    // Create guild member record
    await storage.createGuildMember({
      userId: member.id,
      guildId: member.guild.id,
      nickname: member.nickname,
      joinedAt: member.joinedAt || new Date(),
      roles: member.roles.cache.map(role => role.id)
    });

    const guildConfig = await storage.getGuildConfig(member.guild.id);
    
    if (!guildConfig?.loggingEnabled || !guildConfig.logChannelMembers) return;

    // Send log to channel
    const logChannel = member.guild.channels.cache.get(guildConfig.logChannelMembers);
    
    if (logChannel && logChannel.isTextBased()) {
      const embed = createEmbed({
        title: '✅ Member Joined',
        thumbnail: member.user.displayAvatarURL({ size: 256 }),
        fields: [
          { name: 'User', value: member.user.tag, inline: true },
          { name: 'ID', value: member.id, inline: true },
          { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
          { name: 'Joined At', value: `<t:${Math.floor((member.joinedAt?.getTime() || Date.now()) / 1000)}:F>`, inline: false }
        ],
        color: 'Green'
      });

      await logChannel.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error('Guild member add event error:', error);
  }
}
