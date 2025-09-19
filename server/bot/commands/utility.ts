import { ChatInputCommandInteraction, GuildMember, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { createEmbed } from '../utils/embeds';
import { hasPermission } from '../utils/permissions';

export function setupUtilityCommands(client: any) {
  // Avatar Command
  const avatarCommand = {
    name: 'av',
    description: 'Show user avatar',
    async execute(interaction: ChatInputCommandInteraction) {
      const target = interaction.options.getUser('user') || interaction.user;
      
      const embed = createEmbed({
        title: `${target.username}'s Avatar`,
        image: target.displayAvatarURL({ size: 512 }),
        color: 'Blue',
        footer: 'created by lirolegal'
      });

      await interaction.reply({ embeds: [embed] });
    }
  };

  // User Info Command
  const userinfoCommand = {
    name: 'userinfo',
    description: 'Show detailed user information',
    async execute(interaction: ChatInputCommandInteraction) {
      const target = interaction.options.getUser('user') || interaction.user;
      const member = await interaction.guild?.members.fetch(target.id);
      
      if (!member) {
        return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
      }

      const joinedTimestamp = Math.floor(member.joinedTimestamp! / 1000);
      const createdTimestamp = Math.floor(target.createdTimestamp / 1000);
      
      const roles = member.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => role.toString())
        .slice(0, 10)
        .join(', ') || 'None';

      const embed = createEmbed({
        title: `User Information - ${target.username}`,
        thumbnail: target.displayAvatarURL({ size: 256 }),
        fields: [
          { name: 'Username', value: target.username, inline: true },
          { name: 'Discriminator', value: target.discriminator || 'None', inline: true },
          { name: 'ID', value: target.id, inline: true },
          { name: 'Account Created', value: `<t:${createdTimestamp}:F>`, inline: true },
          { name: 'Joined Server', value: `<t:${joinedTimestamp}:F>`, inline: true },
          { name: 'Nickname', value: member.nickname || 'None', inline: true },
          { name: 'Roles', value: roles, inline: false },
          { name: 'Permissions', value: member.permissions.has('Administrator') ? 'Administrator' : 'Member', inline: true }
        ],
        color: 'Blue',
        footer: 'created by lirolegal'
      });

      // Create buttons for additional info
      const buttons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`userinfo_avatars_${target.id}`)
            .setLabel('Avatar History')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`userinfo_names_${target.id}`)
            .setLabel('Name History')
            .setStyle(ButtonStyle.Secondary)
        );

      await interaction.reply({ embeds: [embed], components: [buttons] });
    }
  };

  // Clear Command
  const clearCommand = {
    name: 'clear',
    description: 'Clear messages from channel (Staff only)',
    async execute(interaction: ChatInputCommandInteraction) {
      if (!hasPermission(interaction.member as GuildMember, 'ManageMessages')) {
        return interaction.reply({ content: '❌ You don\'t have permission to clear messages.', ephemeral: true });
      }

      const amount = interaction.options.getInteger('amount') || 10;
      
      if (amount < 1 || amount > 100) {
        return interaction.reply({ content: '❌ Please specify a number between 1 and 100.', ephemeral: true });
      }

      try {
        const channel = interaction.channel;
        if (!channel || !('bulkDelete' in channel)) {
          return interaction.reply({ content: '❌ Cannot clear messages in this channel.', ephemeral: true });
        }

        const deleted = await channel.bulkDelete(amount, true);
        
        const embed = createEmbed({
          title: '🗑️ Messages Cleared',
          description: `Successfully deleted ${deleted.size} messages.`,
          color: 'Green',
          footer: 'created by lirolegal'
        });

        const reply = await interaction.reply({ embeds: [embed], ephemeral: true });
        
        // Delete the confirmation message after 5 seconds
        setTimeout(() => {
          reply.delete().catch(() => {});
        }, 5000);
      } catch (error) {
        console.error('Clear command error:', error);
        await interaction.reply({ content: '❌ An error occurred while clearing messages.', ephemeral: true });
      }
    }
  };

  // Handle button interactions for userinfo
  client.on('interactionCreate', async (interaction: any) => {
    if (!interaction.isButton()) return;

    if (interaction.customId.startsWith('userinfo_avatars_')) {
      const userId = interaction.customId.split('_')[2];
      const user = await client.users.fetch(userId);
      
      const embed = createEmbed({
        title: `${user.username}'s Avatar History`,
        description: 'Avatar history feature coming soon!',
        color: 'Blue',
        footer: 'created by lirolegal'
      });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId.startsWith('userinfo_names_')) {
      const userId = interaction.customId.split('_')[2];
      const user = await client.users.fetch(userId);
      
      const embed = createEmbed({
        title: `${user.username}'s Name History`,
        description: 'Name history feature coming soon!',
        color: 'Blue',
        footer: 'created by lirolegal'
      });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  });

  // Register commands
  client.commands.set('av', avatarCommand);
  client.commands.set('userinfo', userinfoCommand);
  client.commands.set('clear', clearCommand);
}
