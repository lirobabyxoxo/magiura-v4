import { GuildMember } from 'discord.js';
import { storage } from '../../storage';
import { createEmbed } from '../utils/embeds';

export default async function guildMemberUpdate(oldMember: GuildMember, newMember: GuildMember) {
  try {
    const guildConfig = await storage.getGuildConfig(newMember.guild.id);
    
    if (!guildConfig?.loggingEnabled || !guildConfig.logChannelMembers) return;

    const changes = [];
    
    // Check for nickname changes
    if (oldMember.nickname !== newMember.nickname) {
      changes.push({
        field: 'Nickname',
        before: oldMember.nickname || 'None',
        after: newMember.nickname || 'None'
      });
    }

    // Check for role changes
    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;
    
    const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
    const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

    if (addedRoles.size > 0) {
      changes.push({
        field: 'Roles Added',
        before: 'None',
        after: addedRoles.map(role => role.name).join(', ')
      });
    }

    if (removedRoles.size > 0) {
      changes.push({
        field: 'Roles Removed',
        before: removedRoles.map(role => role.name).join(', '),
        after: 'None'
      });
    }

    if (changes.length === 0) return;

    // Update guild member record
    await storage.updateGuildMember(newMember.id, newMember.guild.id, {
      nickname: newMember.nickname,
      roles: newMember.roles.cache.map(role => role.id)
    });

    // Send log to channel
    const logChannel = newMember.guild.channels.cache.get(guildConfig.logChannelMembers);
    
    if (logChannel && logChannel.isTextBased()) {
      const embed = createEmbed({
        title: '📝 Member Updated',
        thumbnail: newMember.user.displayAvatarURL({ size: 256 }),
        fields: [
          { name: 'User', value: newMember.user.tag, inline: true },
          { name: 'ID', value: newMember.id, inline: true },
          ...changes.map(change => ({
            name: change.field,
            value: `**Before:** ${change.before}\n**After:** ${change.after}`,
            inline: false
          }))
        ],
        color: 'Yellow'
      });

      await logChannel.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error('Guild member update event error:', error);
  }
}
