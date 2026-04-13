export const SocialLinkPlatform = {
  ZALO: 'ZALO',
  FACEBOOK: 'FACEBOOK',
  WHATSAPP: 'WHATSAPP',
} as const;
export type SocialLinkPlatform = (typeof SocialLinkPlatform)[keyof typeof SocialLinkPlatform];