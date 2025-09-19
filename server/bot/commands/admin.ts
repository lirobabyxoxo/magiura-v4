import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { createEmbed } from '../utils/embeds';
import { hasPermission } from '../utils/permissions';
import { getLanguage } from '../utils/language';
import { storage } from '../../storage';

export function setupAdminCommands(client: any) {
  // Ban Command
  const banCommand = {
    name: 'ban',
    description: 'Ban a member from the server',
    async execute(interaction: ChatInputCommandInteraction) {
      if (!hasPermission(interaction.member as GuildMember, 'BanMembers')) {
        return interaction.reply({ content: '❌ You don\'t have permission to ban members.', ephemeral: true });
      }

      const target = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';

      if (!target) {
        return interaction.reply({ content: '❌ Please specify a user to ban.', ephemeral: true });
      }

      try {
        const member = await interaction.guild?.members.fetch(target.id);
        if (!member) {
          return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
        }

        if (!member.bannable) {
          return interaction.reply({ content: '❌ I cannot ban this user.', ephemeral: true });
        }

        await member.ban({ reason });

        // Log the action
        await storage.createModerationLog({
          guildId: interaction.guild!.id,
          moderatorId: interaction.user.id,
          targetId: target.id,
          action: 'ban',
          reason
        });

        const embed = createEmbed({
          title: '🔨 Member Banned',
          description: `**User:** ${target.tag}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`,
          color: 'Red'
        });

        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error('Ban command error:', error);
        await interaction.reply({ content: '❌ An error occurred while banning the user.', ephemeral: true });
      }
    }
  };

  // Kick Command
  const kickCommand = {
    name: 'kick',
    description: 'Kick a member from the server',
    async execute(interaction: ChatInputCommandInteraction) {
      if (!hasPermission(interaction.member as GuildMember, 'KickMembers')) {
        return interaction.reply({ content: '❌ You don\'t have permission to kick members.', ephemeral: true });
      }

      const target = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';

      if (!target) {
        return interaction.reply({ content: '❌ Please specify a user to kick.', ephemeral: true });
      }

      try {
        const member = await interaction.guild?.members.fetch(target.id);
        if (!member) {
          return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
        }

        if (!member.kickable) {
          return interaction.reply({ content: '❌ I cannot kick this user.', ephemeral: true });
        }

        await member.kick(reason);

        // Log the action
        await storage.createModerationLog({
          guildId: interaction.guild!.id,
          moderatorId: interaction.user.id,
          targetId: target.id,
          action: 'kick',
          reason
        });

        const embed = createEmbed({
          title: '👢 Member Kicked',
          description: `**User:** ${target.tag}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`,
          color: 'Orange'
        });

        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error('Kick command error:', error);
        await interaction.reply({ content: '❌ An error occurred while kicking the user.', ephemeral: true });
      }
    }
  };

  // Mute Command
  const muteCommand = {
    name: 'mute',
    description: 'Mute a member in the server',
    async execute(interaction: ChatInputCommandInteraction) {
      if (!hasPermission(interaction.member as GuildMember, 'ModerateMembers')) {
        return interaction.reply({ content: '❌ You don\'t have permission to mute members.', ephemeral: true });
      }

      const target = interaction.options.getUser('user');
      const duration = interaction.options.getInteger('duration') || 60; // minutes
      const reason = interaction.options.getString('reason') || 'No reason provided';

      if (!target) {
        return interaction.reply({ content: '❌ Please specify a user to mute.', ephemeral: true });
      }

      try {
        const member = await interaction.guild?.members.fetch(target.id);
        if (!member) {
          return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
        }

        if (!member.moderatable) {
          return interaction.reply({ content: '❌ I cannot mute this user.', ephemeral: true });
        }

        const muteExpires = new Date(Date.now() + duration * 60 * 1000);
        await member.timeout(duration * 60 * 1000, reason);

        // Update guild member in database
        const guildMember = await storage.getGuildMember(target.id, interaction.guild!.id);
        if (guildMember) {
          await storage.updateGuildMember(target.id, interaction.guild!.id, {
            muted: true,
            muteExpires
          });
        }

        // Log the action
        await storage.createModerationLog({
          guildId: interaction.guild!.id,
          moderatorId: interaction.user.id,
          targetId: target.id,
          action: 'mute',
          reason,
          duration
        });

        const embed = createEmbed({
          title: '🔇 Member Muted',
          description: `**User:** ${target.tag}\n**Duration:** ${duration} minutes\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`,
          color: 'Yellow'
        });

        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error('Mute command error:', error);
        await interaction.reply({ content: '❌ An error occurred while muting the user.', ephemeral: true });
      }
    }
  };

  // Unmute Command
  const unmuteCommand = {
    name: 'unmute',
    description: 'Unmute a member in the server',
    async execute(interaction: ChatInputCommandInteraction) {
      if (!hasPermission(interaction.member as GuildMember, 'ModerateMembers')) {
        return interaction.reply({ content: '❌ You don\'t have permission to unmute members.', ephemeral: true });
      }

      const target = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';

      if (!target) {
        return interaction.reply({ content: '❌ Please specify a user to unmute.', ephemeral: true });
      }

      try {
        const member = await interaction.guild?.members.fetch(target.id);
        if (!member) {
          return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
        }

        await member.timeout(null, reason);

        // Update guild member in database
        const guildMember = await storage.getGuildMember(target.id, interaction.guild!.id);
        if (guildMember) {
          await storage.updateGuildMember(target.id, interaction.guild!.id, {
            muted: false,
            muteExpires: null
          });
        }

        // Log the action
        await storage.createModerationLog({
          guildId: interaction.guild!.id,
          moderatorId: interaction.user.id,
          targetId: target.id,
          action: 'unmute',
          reason
        });

        const embed = createEmbed({
          title: '🔊 Member Unmuted',
          description: `**User:** ${target.tag}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`,
          color: 'Green'
        });

        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error('Unmute command error:', error);
        await interaction.reply({ content: '❌ An error occurred while unmuting the user.', ephemeral: true });
      }
    }
  };

  // Unban Command
  const unbanCommand = {
    name: 'unban',
    description: 'Unban a user from the server',
    async execute(interaction: ChatInputCommandInteraction) {
      if (!hasPermission(interaction.member as GuildMember, 'BanMembers')) {
        return interaction.reply({ content: '❌ You don\'t have permission to unban members.', ephemeral: true });
      }

      const userId = interaction.options.getString('user_id');
      const reason = interaction.options.getString('reason') || 'No reason provided';

      if (!userId) {
        return interaction.reply({ content: '❌ Please specify a user ID to unban.', ephemeral: true });
      }

      try {
        await interaction.guild?.members.unban(userId, reason);

        // Log the action
        await storage.createModerationLog({
          guildId: interaction.guild!.id,
          moderatorId: interaction.user.id,
          targetId: userId,
          action: 'unban',
          reason
        });

        const embed = createEmbed({
          title: '✅ User Unbanned',
          description: `**User ID:** ${userId}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`,
          color: 'Green'
        });

        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error('Unban command error:', error);
        await interaction.reply({ content: '❌ An error occurred while unbanning the user. Make sure the user ID is correct and the user is banned.', ephemeral: true });
      }
    }
  };

  // Register commands
  client.commands.set('ban', banCommand);
  client.commands.set('kick', kickCommand);
  client.commands.set('mute', muteCommand);
  client.commands.set('unmute', unmuteCommand);
  client.commands.set('unban', unbanCommand);
}
