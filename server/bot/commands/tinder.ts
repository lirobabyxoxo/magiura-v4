import { ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { createEmbed } from '../utils/embeds';
import { storage } from '../../storage';

export function setupTinderCommands(client: any) {
  // Tinder Profile Command
  const tinderProfileCommand = {
    name: 'tinder',
    description: 'Manage your Tinder profile',
    async execute(interaction: ChatInputCommandInteraction) {
      const subcommand = interaction.options.getSubcommand();
      
      if (subcommand === 'profile') {
        await handleTinderProfile(interaction);
      } else if (subcommand === 'setup') {
        await handleTinderSetup(interaction);
      } else if (subcommand === 'like') {
        await handleTinderLike(interaction);
      } else if (subcommand === 'browse') {
        await handleTinderBrowse(interaction);
      }
    }
  };

  async function handleTinderProfile(interaction: ChatInputCommandInteraction) {
    try {
      const profile = await storage.getTinderProfile(interaction.user.id, interaction.guild!.id);
      
      if (!profile) {
        const embed = createEmbed({
          title: '💔 No Tinder Profile',
          description: 'You don\'t have a Tinder profile yet! Use `/tinder setup` to create one.',
          color: 'Red'
        });
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const likes = await storage.getTinderLikes(interaction.user.id, interaction.guild!.id);
      
      const embed = createEmbed({
        title: '❤️ Your Tinder Profile',
        thumbnail: interaction.user.displayAvatarURL({ size: 256 }),
        fields: [
          { name: 'Bio', value: profile.bio || 'No bio set', inline: false },
          { name: 'Age', value: profile.age?.toString() || 'Not specified', inline: true },
          { name: 'Interests', value: Array.isArray(profile.interests) ? (profile.interests as string[]).join(', ') || 'None' : 'None', inline: true },
          { name: 'Likes Received', value: likes.length.toString(), inline: true },
          { name: 'Status', value: profile.active ? '✅ Active' : '❌ Inactive', inline: true }
        ],
        color: 'Pink'
      });

      const buttons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('tinder_edit_profile')
            .setLabel('Edit Profile')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('tinder_toggle_status')
            .setLabel(profile.active ? 'Deactivate' : 'Activate')
            .setStyle(profile.active ? ButtonStyle.Danger : ButtonStyle.Success)
        );

      await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true });
    } catch (error) {
      console.error('Tinder profile error:', error);
      await interaction.reply({ content: '❌ An error occurred while fetching your profile.', ephemeral: true });
    }
  }

  async function handleTinderSetup(interaction: ChatInputCommandInteraction) {
    const bio = interaction.options.getString('bio');
    const age = interaction.options.getInteger('age');
    const interests = interaction.options.getString('interests');

    if (!bio || !age) {
      return interaction.reply({ content: '❌ Please provide both bio and age.', ephemeral: true });
    }

    if (age < 18 || age > 100) {
      return interaction.reply({ content: '❌ Age must be between 18 and 100.', ephemeral: true });
    }

    try {
      const existingProfile = await storage.getTinderProfile(interaction.user.id, interaction.guild!.id);
      
      const interestsArray = interests ? interests.split(',').map(i => i.trim()) : [];
      
      if (existingProfile) {
        await storage.updateTinderProfile(existingProfile.id, {
          bio,
          age,
          interests: interestsArray,
          active: true
        });
      } else {
        await storage.createTinderProfile({
          userId: interaction.user.id,
          guildId: interaction.guild!.id,
          bio,
          age,
          interests: interestsArray,
          active: true
        });
      }

      const embed = createEmbed({
        title: '✅ Tinder Profile Updated',
        description: 'Your Tinder profile has been successfully updated!',
        fields: [
          { name: 'Bio', value: bio, inline: false },
          { name: 'Age', value: age.toString(), inline: true },
          { name: 'Interests', value: interestsArray.join(', ') || 'None', inline: true }
        ],
        color: 'Green'
      });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error('Tinder setup error:', error);
      await interaction.reply({ content: '❌ An error occurred while setting up your profile.', ephemeral: true });
    }
  }

  async function handleTinderLike(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser('user');
    
    if (!target) {
      return interaction.reply({ content: '❌ Please specify a user to like.', ephemeral: true });
    }

    if (target.id === interaction.user.id) {
      return interaction.reply({ content: '❌ You cannot like yourself!', ephemeral: true });
    }

    try {
      const targetProfile = await storage.getTinderProfile(target.id, interaction.guild!.id);
      
      if (!targetProfile || !targetProfile.active) {
        return interaction.reply({ content: '❌ This user doesn\'t have an active Tinder profile.', ephemeral: true });
      }

      // Check if already liked
      const existingLikes = await storage.getTinderLikes(target.id, interaction.guild!.id);
      const alreadyLiked = existingLikes.some(like => like.fromUserId === interaction.user.id);
      
      if (alreadyLiked) {
        return interaction.reply({ content: '❌ You already liked this user!', ephemeral: true });
      }

      // Create the like
      await storage.createTinderLike({
        fromUserId: interaction.user.id,
        toUserId: target.id,
        guildId: interaction.guild!.id
      });

      // Check for match
      const reverseQuery = await storage.getTinderLikes(interaction.user.id, interaction.guild!.id);
      const isMatch = reverseQuery.some(like => like.fromUserId === target.id);

      if (isMatch) {
        // It's a match! Update both likes
        const embed = createEmbed({
          title: '💕 It\'s a Match!',
          description: `You and ${target.username} liked each other!`,
          color: 'Pink'
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });

        // Notify the other user via DM
        try {
          const matchEmbed = createEmbed({
            title: '💕 New Match!',
            description: `You have a new match with ${interaction.user.username} in ${interaction.guild!.name}!`,
            color: 'Pink'
          });
          await target.send({ embeds: [matchEmbed] });
        } catch (error) {
          console.error('Failed to send match notification:', error);
        }
      } else {
        const embed = createEmbed({
          title: '❤️ Like Sent',
          description: `You liked ${target.username}!`,
          color: 'Pink'
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch (error) {
      console.error('Tinder like error:', error);
      await interaction.reply({ content: '❌ An error occurred while processing the like.', ephemeral: true });
    }
  }

  async function handleTinderBrowse(interaction: ChatInputCommandInteraction) {
    // This would implement a browsing system with buttons for like/pass
    const embed = createEmbed({
      title: '🔍 Tinder Browse',
      description: 'Browse feature coming soon! Use `/tinder like @user` for now.',
      color: 'Blue'
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // Handle button interactions
  client.on('interactionCreate', async (interaction: any) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'tinder_edit_profile') {
      const embed = createEmbed({
        title: '✏️ Edit Profile',
        description: 'Use `/tinder setup` to edit your profile.',
        color: 'Blue'
      });
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId === 'tinder_toggle_status') {
      try {
        const profile = await storage.getTinderProfile(interaction.user.id, interaction.guild!.id);
        
        if (profile) {
          await storage.updateTinderProfile(profile.id, {
            active: !profile.active
          });

          const embed = createEmbed({
            title: '✅ Status Updated',
            description: `Your profile is now ${!profile.active ? 'active' : 'inactive'}.`,
            color: 'Green'
          });

          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
      } catch (error) {
        console.error('Tinder toggle error:', error);
        await interaction.reply({ content: '❌ An error occurred.', ephemeral: true });
      }
    }
  });

  // Register commands
  client.commands.set('tinder', tinderProfileCommand);
}
