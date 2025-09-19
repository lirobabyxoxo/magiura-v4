import { GuildMember, PermissionFlagsBits } from 'discord.js';

export function hasPermission(member: GuildMember, permission: keyof typeof PermissionFlagsBits): boolean {
  if (!member) return false;
  
  // Bot owner has all permissions
  if (member.id === '1327725098701946987') return true;
  
  // Check if member has administrator permission
  if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;
  
  // Check specific permission
  return member.permissions.has(PermissionFlagsBits[permission]);
}

export function hasRole(member: GuildMember, roleId: string): boolean {
  return member.roles.cache.has(roleId);
}

export function hasAnyRole(member: GuildMember, roleIds: string[]): boolean {
  return roleIds.some(roleId => member.roles.cache.has(roleId));
}

export function isStaff(member: GuildMember): boolean {
  return hasPermission(member, 'ManageMessages') || 
         hasPermission(member, 'KickMembers') || 
         hasPermission(member, 'BanMembers');
}

export function isModerator(member: GuildMember): boolean {
  return hasPermission(member, 'KickMembers') || hasPermission(member, 'BanMembers');
}

export function isAdmin(member: GuildMember): boolean {
  return hasPermission(member, 'Administrator') || hasPermission(member, 'ManageGuild');
}
