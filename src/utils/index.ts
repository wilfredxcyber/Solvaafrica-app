// Platform utilities for web and mobile detection

export const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';
export const isMobile = isWeb && /Mobi|Android/i.test(navigator.userAgent);
