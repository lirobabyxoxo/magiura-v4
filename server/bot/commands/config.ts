import { ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, GuildMember } from 'discord.js';
import { createEmbed } from '../utils/embeds';
import { hasPermission } from '../utils/permissions';
import { storage } from '../../storage';

const DEVELOPER_ID = '1327725098701946987';

export function setupConfigCommands(client: any) {
  // Configurar Command (Admin Dashboard)
  const configurarCommand = {
    name: 'configurar',
    description: 'Open admin configuration dashboard',
    async execute(interaction: ChatInputCommandInteraction) {
      if (!hasPermission(interaction.member as GuildMember, 'ManageGuild')) {
        return interaction.reply({ content: '❌ You don\'t have permission to configure the bot.', ephemeral: true });
      }

      try {
        // Send configuration dashboard to user's DM
        const user = interaction.user;
        
        const dashboardEmbed = createEmbed({
          title: '⚙️ MAGIURA BOT Configuration Dashboard',
          description: `Configuration panel for **${interaction.guild!.name}**`,
          fields: [
            { name: '🛡️ Moderation', value: 'Configure ban, kick, mute settings', inline: true },
            { name: '🎭 Roleplay', value: 'Enable/disable roleplay commands', inline: true },
            { name: '💕 Tinder System', value: 'Configure dating system', inline: true },
            { name: '💒 Marriage System', value: 'Configure marriage features', inline: true },
            { name: '📝 Logging System', value: 'Set up server logs', inline: true },
            { name: '🗑️ Clear System', value: 'Configure quick clear', inline: true },
            { name: '🌍 Language', value: 'Change bot language', inline: true },
            { name: '🔧 General Settings', value: 'Bot prefix and other settings', inline: true }
          ],
          color: 'Blue'
        });

        const buttons = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`config_moderation_${interaction.guild!.id}`)
              .setLabel('Moderation')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(`config_features_${interaction.guild!.id}`)
              .setLabel('Features')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId(`config_logging_${interaction.guild!.id}`)
              .setLabel('Logging')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(`config_general_${interaction.guild!.id}`)
              .setLabel('General')
              .setStyle(ButtonStyle.Secondary)
          );

        const buttons2 = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`config_language_${interaction.guild!.id}`)
              .setLabel('Language')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(`config_help_${interaction.guild!.id}`)
              .setLabel('Help')
              .setStyle(ButtonStyle.Secondary)
          );

        try {
          await user.send({ embeds: [dashboardEmbed], components: [buttons, buttons2] });
          
          const confirmEmbed = createEmbed({
            title: '✅ Configuration Dashboard Sent',
            description: 'Check your DMs for the configuration dashboard!',
            color: 'Green'
          });
          
          await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
        } catch (error) {
          console.error('Failed to send DM:', error);
          await interaction.reply({ content: '❌ I couldn\'t send you a DM. Please make sure your DMs are open.', ephemeral: true });
        }
      } catch (error) {
        console.error('Configurar command error:', error);
        await interaction.reply({ content: '❌ An error occurred while opening the configuration dashboard.', ephemeral: true });
      }
    }
  };

  // Developer Configuration Command
  const devConfigCommand = {
    name: 'devconfig',
    description: 'Developer configuration panel',
    async execute(interaction: ChatInputCommandInteraction) {
      if (interaction.user.id !== DEVELOPER_ID) {
        return interaction.reply({ content: '❌ This command is only available to the developer.', ephemeral: true });
      }

      const embed = createEmbed({
        title: '👨‍💻 Developer Configuration Panel',
        description: 'Special configuration panel for bot developer',
        fields: [
          { name: '🤖 Bot Status', value: 'Change bot status and activity', inline: true },
          { name: '🖼️ Bot Avatar', value: 'Update bot profile picture', inline: true },
          { name: '🏷️ Bot Banner', value: 'Update bot banner', inline: true },
          { name: '📊 Bot Statistics', value: 'View bot usage statistics', inline: true },
          { name: '🔄 Bot Restart', value: 'Restart bot processes', inline: true },
          { name: '🗄️ Database Management', value: 'Manage bot database', inline: true }
        ],
        color: 'Purple'
      });

      const buttons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('dev_status')
            .setLabel('Bot Status')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('dev_avatar')
            .setLabel('Bot Avatar')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('dev_stats')
            .setLabel('Statistics')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('dev_restart')
            .setLabel('Restart')
            .setStyle(ButtonStyle.Danger)
        );

      await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true });
    }
  };

  // Handle button interactions
  client.on('interactionCreate', async (interaction: any) => {
    if (!interaction.isButton()) return;

    // Configuration buttons
    if (interaction.customId.startsWith('config_moderation_')) {
      const guildId = interaction.customId.split('_')[2];
      const guild = client.guilds.cache.get(guildId);
      
      if (!guild) {
        return interaction.reply({ content: '❌ Guild not found.', ephemeral: true });
      }

      const embed = createEmbed({
        title: '🛡️ Moderation Configuration',
        description: `Configure moderation settings for **${guild.name}**`,
        fields: [
          { name: 'Status', value: '✅ Enabled', inline: true },
          { name: 'Auto-Moderation', value: '❌ Disabled', inline: true },
          { name: 'Mod Log Channel', value: 'Not set', inline: true }
        ],
        color: 'Red'
      });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId.startsWith('config_features_')) {
      const guildId = interaction.customId.split('_')[2];
      const guild = client.guilds.cache.get(guildId);
      
      if (!guild) {
        return interaction.reply({ content: '❌ Guild not found.', ephemeral: true });
      }

      try {
        const guildConfig = await storage.getGuildConfig(guildId);
        
        const embed = createEmbed({
          title: '🎮 Features Configuration',
          description: `Configure features for **${guild.name}**`,
          fields: [
            { name: 'Moderation', value: guildConfig?.moderationEnabled ? '✅ Enabled' : '❌ Disabled', inline: true },
            { name: 'Roleplay', value: guildConfig?.roleplayEnabled ? '✅ Enabled' : '❌ Disabled', inline: true },
            { name: 'Tinder System', value: guildConfig?.tinderEnabled ? '✅ Enabled' : '❌ Disabled', inline: true },
            { name: 'Marriage System', value: guildConfig?.marriageEnabled ? '✅ Enabled' : '❌ Disabled', inline: true },
            { name: 'Logging System', value: guildConfig?.loggingEnabled ? '✅ Enabled' : '❌ Disabled', inline: true },
            { name: 'Clear System', value: guildConfig?.clearSystemEnabled ? '✅ Enabled' : '❌ Disabled', inline: true }
          ],
          color: 'Blue'
        });

        const buttons = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`toggle_moderation_${guildId}`)
              .setLabel('Toggle Moderation')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(`toggle_roleplay_${guildId}`)
              .setLabel('Toggle Roleplay')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(`toggle_tinder_${guildId}`)
              .setLabel('Toggle Tinder')
              .setStyle(ButtonStyle.Secondary)
          );

        await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true });
      } catch (error) {
        console.error('Features config error:', error);
        await interaction.reply({ content: '❌ An error occurred while loading features configuration.', ephemeral: true });
      }
    }

    if (interaction.customId.startsWith('config_logging_')) {
      const guildId = interaction.customId.split('_')[2];
      const guild = client.guilds.cache.get(guildId);
      
      const embed = createEmbed({
        title: '📝 Logging Configuration',
        description: `Configure logging settings for **${guild?.name}**`,
        fields: [
          { name: 'Message Logs', value: 'Not configured', inline: true },
          { name: 'Member Logs', value: 'Not configured', inline: true },
          { name: 'Server Logs', value: 'Not configured', inline: true }
        ],
        color: 'Orange'
      });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId.startsWith('config_language_')) {
      const embed = createEmbed({
        title: '🌍 Language Configuration',
        description: 'Select bot language',
        color: 'Green'
      });

      const buttons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('lang_ptbr')
            .setLabel('🇧🇷 Português (Brasil)')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('lang_en')
            .setLabel('🇺🇸 English')
            .setStyle(ButtonStyle.Secondary)
        );

      await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true });
    }

    // Developer buttons
    if (interaction.customId === 'dev_status') {
      if (interaction.user.id !== DEVELOPER_ID) return;

      const embed = createEmbed({
        title: '🤖 Bot Status Configuration',
        description: 'Current status: `Online - Serving servers with style!`',
        color: 'Green'
      });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId === 'dev_stats') {
      if (interaction.user.id !== DEVELOPER_ID) return;

      const embed = createEmbed({
        title: '📊 Bot Statistics',
        fields: [
          { name: 'Servers', value: client.guilds.cache.size.toString(), inline: true },
          { name: 'Users', value: client.users.cache.size.toString(), inline: true },
          { name: 'Uptime', value: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m`, inline: true }
        ],
        color: 'Blue'
      });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Language selection
    if (interaction.customId === 'lang_ptbr') {
      const embed = createEmbed({
        title: '✅ Idioma Alterado',
        description: 'Bot configurado para Português (Brasil)',
        color: 'Green'
      });
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId === 'lang_en') {
      const embed = createEmbed({
        title: '✅ Language Changed',
        description: 'Bot configured for English',
        color: 'Green'
      });
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  });

  // Register commands
  client.commands.set('configurar', configurarCommand);
  client.commands.set('devconfig', devConfigCommand);
}
