interface LanguageStrings {
  [key: string]: {
    [key: string]: string;
  };
}

const languages: LanguageStrings = {
  'pt-BR': {
    // Common
    'error_occurred': '❌ Ocorreu um erro.',
    'permission_denied': '❌ Você não tem permissão para usar este comando.',
    'user_not_found': '❌ Usuário não encontrado.',
    'guild_only': '❌ Este comando só pode ser usado em servidores.',
    
    // Moderation
    'ban_success': '🔨 Usuário banido com sucesso.',
    'kick_success': '👢 Usuário expulso com sucesso.',
    'mute_success': '🔇 Usuário silenciado com sucesso.',
    'unmute_success': '🔊 Usuário desilenciado com sucesso.',
    'unban_success': '✅ Usuário desbanido com sucesso.',
    
    // Marriage
    'not_married': 'tu não tem ninguém 🤣',
    'already_married': '❌ Você já está casado!',
    'marriage_proposal': '💍 Proposta de Casamento',
    'marriage_accepted': '💒 Casamento aceito!',
    'marriage_declined': '💔 Casamento recusado.',
    
    // Tinder
    'no_tinder_profile': '💔 Você não tem um perfil no Tinder!',
    'tinder_like_sent': '❤️ Like enviado!',
    'tinder_match': '💕 É um match!',
    
    // Configuration
    'config_updated': '✅ Configuração atualizada.',
    'language_changed': '✅ Idioma alterado para Português (Brasil).',
    
    // Footer
    'util_footer': 'created by lirolegal'
  },
  
  'en': {
    // Common
    'error_occurred': '❌ An error occurred.',
    'permission_denied': '❌ You don\'t have permission to use this command.',
    'user_not_found': '❌ User not found.',
    'guild_only': '❌ This command can only be used in servers.',
    
    // Moderation
    'ban_success': '🔨 User banned successfully.',
    'kick_success': '👢 User kicked successfully.',
    'mute_success': '🔇 User muted successfully.',
    'unmute_success': '🔊 User unmuted successfully.',
    'unban_success': '✅ User unbanned successfully.',
    
    // Marriage
    'not_married': 'you don\'t have anyone 🤣',
    'already_married': '❌ You are already married!',
    'marriage_proposal': '💍 Marriage Proposal',
    'marriage_accepted': '💒 Marriage accepted!',
    'marriage_declined': '💔 Marriage declined.',
    
    // Tinder
    'no_tinder_profile': '💔 You don\'t have a Tinder profile!',
    'tinder_like_sent': '❤️ Like sent!',
    'tinder_match': '💕 It\'s a match!',
    
    // Configuration
    'config_updated': '✅ Configuration updated.',
    'language_changed': '✅ Language changed to English.',
    
    // Footer
    'util_footer': 'created by lirolegal'
  }
};

export function getLanguage(guildId?: string): string {
  // This would fetch from database in a real implementation
  return 'pt-BR'; // Default to Portuguese
}

export function translate(key: string, language: string = 'pt-BR'): string {
  return languages[language]?.[key] || languages['en']?.[key] || key;
}

export function t(key: string, guildId?: string): string {
  const language = getLanguage(guildId);
  return translate(key, language);
}
