import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (mobile-first)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Font scaling
export const mscale = (size: number): number => {
  if (Platform.OS === 'web') {
    // Keep font sizes stable on web
    return size;
  }

  const scale = SCREEN_WIDTH / guidelineBaseWidth;
  return PixelRatio.roundToNearestPixel(size * scale);
};

// Width scaling
export const wscale = (size: number): number => {
  if (Platform.OS === 'web') {
    // Let flexbox or responsiveWidth handle widths
    return size;
  }

  const scale = SCREEN_WIDTH / guidelineBaseWidth;
  return PixelRatio.roundToNearestPixel(size * scale);
};

// Height scaling
export const hscale = (size: number): number => {
  if (Platform.OS === 'web') {
    // Keep heights fixed on web
    return size;
  }

  const scale = SCREEN_HEIGHT / guidelineBaseHeight;
  return PixelRatio.roundToNearestPixel(size * scale);
};

// Percentage-based helpers (safe for web)
export const responsiveWidth = (percent: number): number => {
  return (SCREEN_WIDTH * percent) / 100;
};

export const responsiveHeight = (percent: number): number => {
  return (SCREEN_HEIGHT * percent) / 100;
};
