import { EmbedBuilder, ColorResolvable } from 'discord.js';

interface EmbedOptions {
  title?: string;
  description?: string;
  color?: ColorResolvable | 'Black' | 'Red' | 'Green' | 'Blue' | 'Yellow' | 'Purple' | 'Orange' | 'Pink';
  thumbnail?: string;
  image?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: string;
  timestamp?: boolean;
}

const colorMap = {
  'Black': 0x000000,
  'Red': 0xFF0000,
  'Green': 0x00FF00,
  'Blue': 0x0000FF,
  'Yellow': 0xFFFF00,
  'Purple': 0x800080,
  'Orange': 0xFFA500,
  'Pink': 0xFFC0CB
};

export function createEmbed(options: EmbedOptions): EmbedBuilder {
  const embed = new EmbedBuilder();

  if (options.title) {
    embed.setTitle(options.title);
  }

  if (options.description) {
    embed.setDescription(options.description);
  }

  // Set color to black by default (as per requirements)
  let color = 0x000000; // Black
  if (options.color) {
    if (typeof options.color === 'string' && options.color in colorMap) {
      color = colorMap[options.color as keyof typeof colorMap];
    } else if (typeof options.color === 'number') {
      color = options.color;
    }
  }
  embed.setColor(color);

  if (options.thumbnail) {
    embed.setThumbnail(options.thumbnail);
  }

  if (options.image) {
    embed.setImage(options.image);
  }

  if (options.fields) {
    embed.addFields(options.fields);
  }

  if (options.footer) {
    embed.setFooter({ text: options.footer });
  }

  if (options.timestamp) {
    embed.setTimestamp();
  }

  return embed;
}

// Utility function to create util category embeds with the required footer
export function createUtilEmbed(options: Omit<EmbedOptions, 'footer'>): EmbedBuilder {
  return createEmbed({
    ...options,
    footer: 'created by lirolegal'
  });
}
