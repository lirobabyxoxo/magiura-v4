import { ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, GuildMember } from 'discord.js';
import { createEmbed } from '../utils/embeds';
import { hasPermission } from '../utils/permissions';
import { storage } from '../../storage';

export function setupClearCommands(client: any) {
  // CL Command (Quick Clear)
  const clCommand = {
    name: 'cl',
    description: 'Quick clear messages (configurable)',
    async execute(interaction: ChatInputCommandInteraction) {
      try {
        const guildConfig = await storage.getGuildConfig(interaction.guild!.id);
        
        if (!guildConfig?.clearSystemEnabled) {
          return interaction.reply({ content: '❌ Clear system is disabled in this server.', ephemeral: true });
        }

        // Check if user has permission
        const member = interaction.member as GuildMember;
        const clearRoles = (guildConfig.clearRoles as string[]) || [];
        const clearUsers = (guildConfig.clearUsers as string[]) || [];
        
        const hasRolePermission = clearRoles.some(roleId => member.roles.cache.has(roleId));
        const hasUserPermission = clearUsers.includes(member.id);
        const hasManageMessages = hasPermission(member, 'ManageMessages');
        
        if (!hasRolePermission && !hasUserPermission && !hasManageMessages) {
          return interaction.reply({ content: '❌ You don\'t have permission to use the clear system.', ephemeral: true });
        }

        const amount = guildConfig.clearAmount || 100;
        
        const channel = interaction.channel;
        if (!channel || !('bulkDelete' in channel)) {
          return interaction.reply({ content: '❌ Cannot clear messages in this channel.', ephemeral: true });
        }

        const deleted = await channel.bulkDelete(amount, true);
        
        const embed = createEmbed({
          title: '🗑️ Quick Clear',
          description: `Successfully deleted ${deleted.size} messages.`,
          color: 'Green'
        });

        const reply = await interaction.reply({ embeds: [embed], ephemeral: true });
        
        // Delete the confirmation message after 3 seconds
        setTimeout(() => {
          reply.delete().catch(() => {});
        }, 3000);
      } catch (error) {
        console.error('CL command error:', error);
        await interaction.reply({ content: '❌ An error occurred while clearing messages.', ephemeral: true });
      }
    }
  };

  // Clear Setup Command
  const clearSetupCommand = {
    name: 'clearsetup',
    description: 'Configure the clear system',
    async execute(interaction: ChatInputCommandInteraction) {
      if (!hasPermission(interaction.member as GuildMember, 'ManageGuild')) {
        return interaction.reply({ content: '❌ You don\'t have permission to configure the clear system.', ephemeral: true });
      }

      try {
        const guildConfig = await storage.getGuildConfig(interaction.guild!.id);
        
        const embed = createEmbed({
          title: '🛠️ Clear System Setup',
          description: 'Configure the clear system settings',
          fields: [
            { 
              name: 'Status', 
              value: guildConfig?.clearSystemEnabled ? '✅ Enabled' : '❌ Disabled', 
              inline: true 
            },
            { 
              name: 'Trigger Command', 
              value: guildConfig?.clearTrigger || '.cl', 
              inline: true 
            },
            { 
              name: 'Clear Amount', 
              value: (guildConfig?.clearAmount || 100).toString(), 
              inline: true 
            },
            {
              name: 'Authorized Roles',
              value: guildConfig?.clearRoles ? (guildConfig.clearRoles as string[]).map(id => `<@&${id}>`).join(', ') || 'None' : 'None',
              inline: false
            },
            {
              name: 'Authorized Users',
              value: guildConfig?.clearUsers ? (guildConfig.clearUsers as string[]).map(id => `<@${id}>`).join(', ') || 'None' : 'None',
              inline: false
            }
          ],
          color: 'Blue'
        });

        const buttons = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('clear_toggle')
              .setLabel(guildConfig?.clearSystemEnabled ? 'Disable' : 'Enable')
              .setStyle(guildConfig?.clearSystemEnabled ? ButtonStyle.Danger : ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId('clear_config_roles')
              .setLabel('Configure Roles')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId('clear_config_users')
              .setLabel('Configure Users')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId('clear_config_settings')
              .setLabel('Settings')
              .setStyle(ButtonStyle.Primary)
          );

        await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true });
      } catch (error) {
        console.error('Clear setup error:', error);
        await interaction.reply({ content: '❌ An error occurred while showing clear setup.', ephemeral: true });
      }
    }
  };

  // Handle button interactions
  client.on('interactionCreate', async (interaction: any) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'clear_toggle') {
      if (!hasPermission(interaction.member as GuildMember, 'ManageGuild')) {
        return interaction.reply({ content: '❌ You don\'t have permission to configure the clear system.', ephemeral: true });
      }

      try {
        const guildConfig = await storage.getGuildConfig(interaction.guild!.id);
        const newStatus = !guildConfig?.clearSystemEnabled;
        
        if (guildConfig) {
          await storage.updateGuildConfig(interaction.guild!.id, {
            clearSystemEnabled: newStatus
          });
        } else {
          await storage.createGuildConfig({
            guildId: interaction.guild!.id,
            clearSystemEnabled: newStatus
          });
        }

        const embed = createEmbed({
          title: '✅ Clear System Updated',
          description: `Clear system is now ${newStatus ? 'enabled' : 'disabled'}.`,
          color: 'Green'
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        console.error('Clear toggle error:', error);
        await interaction.reply({ content: '❌ An error occurred while updating clear system.', ephemeral: true });
      }
    }

    if (interaction.customId === 'clear_config_roles') {
      const embed = createEmbed({
        title: 'Configure Roles',
        description: 'Use `/clearsetup roles add @role` or `/clearsetup roles remove @role` to configure authorized roles.',
        color: 'Blue'
      });
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId === 'clear_config_users') {
      const embed = createEmbed({
        title: 'Configure Users',
        description: 'Use `/clearsetup users add @user` or `/clearsetup users remove @user` to configure authorized users.',
        color: 'Blue'
      });
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId === 'clear_config_settings') {
      const embed = createEmbed({
        title: 'Configure Settings',
        description: 'Use `/clearsetup trigger <new_trigger>` and `/clearsetup amount <number>` to configure settings.',
        color: 'Blue'
      });
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  });

  // Register commands
  client.commands.set('cl', clCommand);
  client.commands.set('clearsetup', clearSetupCommand);
}
