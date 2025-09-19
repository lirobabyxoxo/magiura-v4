export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

export function getDiscordAvatarUrl(user: DiscordUser, size: number = 256): string {
  if (user.avatar) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=${size}`;
  }
  // Default avatar
  const defaultAvatarNumber = parseInt(user.discriminator) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
}

export function getDiscordGuildIconUrl(guild: DiscordGuild, size: number = 256): string {
  if (guild.icon) {
    return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${guild.icon.startsWith('a_') ? 'gif' : 'png'}?size=${size}`;
  }
  return '';
}

export function hasManageGuildPermission(guild: DiscordGuild): boolean {
  const permissions = BigInt(guild.permissions);
  const MANAGE_GUILD = BigInt(0x20);
  const ADMINISTRATOR = BigInt(0x8);
  
  return (permissions & MANAGE_GUILD) === MANAGE_GUILD || 
         (permissions & ADMINISTRATOR) === ADMINISTRATOR ||
         guild.owner;
}

export function formatDiscordTag(user: DiscordUser): string {
  if (user.discriminator === '0') {
    return `@${user.username}`;
  }
  return `${user.username}#${user.discriminator}`;
}
