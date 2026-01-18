
import { Platform, PlatformOSType } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobile = isIOS || isAndroid;

export const platformSelect = <T>(
  specifics: Partial<Record<PlatformOSType | 'default', T>>
): T | undefined => {
  return Platform.select(specifics);
};

// Platform-specific value selector
export const selectPlatformValue = <T>(
  webValue: T,
  mobileValue: T,
  iosValue?: T,
  androidValue?: T
): T => {
  if (isWeb) return webValue;
  if (isIOS && iosValue !== undefined) return iosValue;
  if (isAndroid && androidValue !== undefined) return androidValue;
  return mobileValue;
};