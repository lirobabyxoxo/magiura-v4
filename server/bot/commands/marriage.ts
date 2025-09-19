import { ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { createEmbed } from '../utils/embeds';
import { storage } from '../../storage';

const DEVELOPER_ID = '1327725098701946987';

export function setupMarriageCommands(client: any) {
  // Marry Command
  const marryCommand = {
    name: 'marry',
    description: 'Propose marriage to someone',
    async execute(interaction: ChatInputCommandInteraction) {
      const target = interaction.options.getUser('user');
      
      if (!target) {
        return interaction.reply({ content: '❌ Please specify someone to marry.', ephemeral: true });
      }

      if (target.id === interaction.user.id) {
        return interaction.reply({ content: '❌ You cannot marry yourself!', ephemeral: true });
      }

      if (target.bot) {
        return interaction.reply({ content: '❌ You cannot marry a bot!', ephemeral: true });
      }

      try {
        // Check if user is already married
        const existingMarriage = await storage.getMarriage(interaction.user.id, interaction.guild!.id);
        if (existingMarriage) {
          return interaction.reply({ content: '❌ You are already married! Use `/divorce` first.', ephemeral: true });
        }

        // Check if target is already married
        const targetMarriage = await storage.getMarriage(target.id, interaction.guild!.id);
        if (targetMarriage) {
          return interaction.reply({ content: '❌ This person is already married!', ephemeral: true });
        }

        // Create proposal embed
        const embed = createEmbed({
          title: '💍 Marriage Proposal',
          description: `${interaction.user} wants to marry ${target}!\n\n${target}, do you accept this proposal?`,
          color: 'Pink'
        });

        const buttons = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`marry_accept_${interaction.user.id}_${target.id}`)
              .setLabel('Accept 💕')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId(`marry_decline_${interaction.user.id}_${target.id}`)
              .setLabel('Decline 💔')
              .setStyle(ButtonStyle.Danger)
          );

        await interaction.reply({ embeds: [embed], components: [buttons] });
      } catch (error) {
        console.error('Marry command error:', error);
        await interaction.reply({ content: '❌ An error occurred while processing the proposal.', ephemeral: true });
      }
    }
  };

  // Marriage Status Command
  const marriageStatusCommand = {
    name: 'marriage',
    description: 'Check marriage status',
    async execute(interaction: ChatInputCommandInteraction) {
      const target = interaction.options.getUser('user') || interaction.user;

      try {
        const marriage = await storage.getMarriage(target.id, interaction.guild!.id);
        
        if (!marriage) {
          const embed = createEmbed({
            title: '💔 Single',
            description: `${target.username} tu não tem ninguém 🤣`,
            color: 'Red'
          });
          return interaction.reply({ embeds: [embed] });
        }

        const partnerId = marriage.userId1 === target.id ? marriage.userId2 : marriage.userId1;
        const partner = await client.users.fetch(partnerId);
        
        const marriedDuration = Date.now() - marriage.marriedAt.getTime();
        const days = Math.floor(marriedDuration / (1000 * 60 * 60 * 24));
        const hours = Math.floor((marriedDuration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((marriedDuration % (1000 * 60 * 60)) / (1000 * 60));

        const history = await storage.getMarriageHistory(target.id, interaction.guild!.id);

        const embed = createEmbed({
          title: '💕 Marriage Status',
          thumbnail: partner.displayAvatarURL({ size: 256 }),
          fields: [
            { name: 'Partner', value: partner.username, inline: true },
            { name: 'Married For', value: `${days} days, ${hours} hours, ${minutes} minutes`, inline: true },
            { name: 'Marriage Date', value: `<t:${Math.floor(marriage.marriedAt.getTime() / 1000)}:F>`, inline: false }
          ],
          color: 'Pink'
        });

        const buttons = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`marriage_history_${target.id}`)
              .setLabel(`Marriage History (${history.length})`)
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(`divorce_${marriage.id}`)
              .setLabel('Divorce 💔')
              .setStyle(ButtonStyle.Danger)
          );

        await interaction.reply({ embeds: [embed], components: [buttons] });
      } catch (error) {
        console.error('Marriage status error:', error);
        await interaction.reply({ content: '❌ An error occurred while checking marriage status.', ephemeral: true });
      }
    }
  };

  // Marriage Reset Command (Developer only)
  const marriageResetCommand = {
    name: 'marriagereset',
    description: 'Reset all marriages (Developer only)',
    async execute(interaction: ChatInputCommandInteraction) {
      if (interaction.user.id !== DEVELOPER_ID) {
        return interaction.reply({ content: '❌ This command is only available to the developer.', ephemeral: true });
      }

      const target = interaction.options.getUser('user');
      
      if (!target) {
        return interaction.reply({ content: '❌ Please specify a user to reset.', ephemeral: true });
      }

      try {
        const marriage = await storage.getMarriage(target.id, interaction.guild!.id);
        
        if (marriage) {
          await storage.endMarriage(marriage.id);
          
          const embed = createEmbed({
            title: '✅ Marriage Reset',
            description: `${target.username}'s marriage has been reset.`,
            color: 'Green'
          });

          await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          await interaction.reply({ content: '❌ This user is not married.', ephemeral: true });
        }
      } catch (error) {
        console.error('Marriage reset error:', error);
        await interaction.reply({ content: '❌ An error occurred while resetting marriage.', ephemeral: true });
      }
    }
  };

  // Handle button interactions
  client.on('interactionCreate', async (interaction: any) => {
    if (!interaction.isButton()) return;

    // Marriage proposal responses
    if (interaction.customId.startsWith('marry_accept_')) {
      const [, , proposerId, targetId] = interaction.customId.split('_');
      
      if (interaction.user.id !== targetId) {
        return interaction.reply({ content: '❌ This proposal is not for you!', ephemeral: true });
      }

      try {
        const proposer = await client.users.fetch(proposerId);
        
        // Create marriage
        const marriage = await storage.createMarriage({
          userId1: proposerId,
          userId2: targetId,
          guildId: interaction.guild!.id,
          marriedAt: new Date()
        });

        // Add to marriage history
        await storage.createMarriageHistory({
          userId: proposerId,
          partnerId: targetId,
          guildId: interaction.guild!.id,
          marriedAt: new Date()
        });

        await storage.createMarriageHistory({
          userId: targetId,
          partnerId: proposerId,
          guildId: interaction.guild!.id,
          marriedAt: new Date()
        });

        const embed = createEmbed({
          title: '💒 Marriage Accepted!',
          description: `${proposer.username} and ${interaction.user.username} are now married! 🎉`,
          color: 'Green'
        });

        await interaction.update({ embeds: [embed], components: [] });
      } catch (error) {
        console.error('Marriage accept error:', error);
        await interaction.reply({ content: '❌ An error occurred while processing the marriage.', ephemeral: true });
      }
    }

    if (interaction.customId.startsWith('marry_decline_')) {
      const [, , proposerId, targetId] = interaction.customId.split('_');
      
      if (interaction.user.id !== targetId) {
        return interaction.reply({ content: '❌ This proposal is not for you!', ephemeral: true });
      }

      const proposer = await client.users.fetch(proposerId);
      
      const embed = createEmbed({
        title: '💔 Marriage Declined',
        description: `${interaction.user.username} declined ${proposer.username}'s proposal.`,
        color: 'Red'
      });

      await interaction.update({ embeds: [embed], components: [] });
    }

    // Marriage history
    if (interaction.customId.startsWith('marriage_history_')) {
      const userId = interaction.customId.split('_')[2];
      
      try {
        const history = await storage.getMarriageHistory(userId, interaction.guild!.id);
        
        if (history.length === 0) {
          const embed = createEmbed({
            title: '📜 Marriage History',
            description: 'No marriage history found.',
            color: 'Blue'
          });
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const historyText = history.map((h, index) => {
          const partner = client.users.cache.get(h.partnerId);
          const marriedDate = `<t:${Math.floor(h.marriedAt.getTime() / 1000)}:d>`;
          const divorcedDate = h.divorcedAt ? `<t:${Math.floor(h.divorcedAt.getTime() / 1000)}:d>` : 'Current';
          return `${index + 1}. ${partner?.username || 'Unknown'} (${marriedDate} - ${divorcedDate})`;
        }).join('\n');

        const embed = createEmbed({
          title: '📜 Marriage History',
          description: historyText,
          color: 'Blue'
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        console.error('Marriage history error:', error);
        await interaction.reply({ content: '❌ An error occurred while fetching marriage history.', ephemeral: true });
      }
    }

    // Divorce
    if (interaction.customId.startsWith('divorce_')) {
      const marriageId = interaction.customId.split('_')[1];
      
      try {
        const marriage = await storage.getMarriage(interaction.user.id, interaction.guild!.id);
        
        if (!marriage || marriage.id !== marriageId) {
          return interaction.reply({ content: '❌ You are not in this marriage!', ephemeral: true });
        }

        const partnerId = marriage.userId1 === interaction.user.id ? marriage.userId2 : marriage.userId1;
        const partner = await client.users.fetch(partnerId);

        // End marriage
        await storage.endMarriage(marriageId);

        // Update marriage history
        const userHistory = await storage.getMarriageHistory(interaction.user.id, interaction.guild!.id);
        const partnerHistory = await storage.getMarriageHistory(partnerId, interaction.guild!.id);
        
        // This would require updating the existing history records with divorce date
        // For simplicity, we'll leave it as is for now

        const embed = createEmbed({
          title: '💔 Divorce Completed',
          description: `${interaction.user.username} and ${partner.username} are now divorced.`,
          color: 'Red'
        });

        await interaction.update({ embeds: [embed], components: [] });
      } catch (error) {
        console.error('Divorce error:', error);
        await interaction.reply({ content: '❌ An error occurred while processing the divorce.', ephemeral: true });
      }
    }
  });

  // Register commands
  client.commands.set('marry', marryCommand);
  client.commands.set('marriage', marriageStatusCommand);
  client.commands.set('marriagereset', marriageResetCommand);
}
