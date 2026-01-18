import { Platform, StyleSheet } from 'react-native';
import { mscale, wscale, hscale } from './metric';

export const webStyle = Platform.select({
  web: {
    // Web-specific overrides
    container: {
      maxWidth: 800,
      marginHorizontal: 'auto',
    },
    text: {
      // Optional: Slightly larger font sizes for web
    },
  },
  default: {},
});

// Helper function for conditional web styles
export const conditionalWebStyle = (webStyle: any, mobileStyle: any = {}) => {
  return Platform.select({
    web: webStyle,
    default: mobileStyle,
  });
};