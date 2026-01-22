import { StyleSheet, Platform, Dimensions } from "react-native";
import { platformSelect, isWeb } from "@/utils";

import { colors, screenHorizontalPadding } from "../constants/theme";
import { mscale } from "../helpers/metric";

// Get screen dimensions for responsive calculations
const { width: screenWidth } = Dimensions.get('window');

// Responsive scaling function for web
const responsiveScale = (mobileSize: number, webSize?: number, tabletSize?: number): number => {
  if (isWeb) {
    // On web, use larger base sizes
    if (screenWidth >= 1200 && webSize) return webSize;
    if (screenWidth >= 768 && tabletSize) return tabletSize;
    return webSize || mobileSize * 1.5; // Default: 1.5x mobile size
  }
  return mscale(mobileSize);
};

// Responsive padding
const getResponsivePadding = () => {
  if (!isWeb) return screenHorizontalPadding;
  
  if (screenWidth >= 1200) return 48; // Desktop
  if (screenWidth >= 768) return 32;  // Tablet
  return 24; // Mobile web
};

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      web: {
        maxWidth: 1200,
        marginHorizontal: 'auto',
        width: '100%',
      },
    }),
  },
  
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headlineText: { 
    fontFamily: 'Inter-Bold', 
    fontSize: responsiveScale(24, 32, 28), // 24 mobile, 32 desktop, 28 tablet
    color: colors.black, 
    textTransform: 'capitalize',
    ...Platform.select({
      web: {
        lineHeight: 1.3,
      },
    }),
  },
  
  bodyText: { 
    fontFamily: 'Inter-Regular', 
    fontSize: responsiveScale(16, 20, 18), // 16 mobile, 20 desktop, 18 tablet
    color: colors.bodyText,
    ...Platform.select({
      web: {
        lineHeight: 1.6,
      },
    }),
  },
  
  screen: { 
    flex: 1, 
    backgroundColor: '#ffffff', 
    paddingHorizontal: getResponsivePadding(),
    position: 'relative',
    ...Platform.select({
      web: {
        paddingTop: 20,
        paddingBottom: 20,
        minHeight: '100%',
      },
    }),
  },
  
  // NEW: Web-specific styles
  webContainer: Platform.select({
    web: {
      maxWidth: 1200,
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
      paddingHorizontal: 24,
    },
    default: {},
  }),
  
  // NEW: Responsive content wrapper
  responsiveContent: {
    flex: 1,
    ...Platform.select({
      web: {
        maxWidth: 800,
        marginHorizontal: 'auto',
        width: '100%',
      },
    }),
  },
});
  
 // Simplified platform-specific style helper (removed dynamic modifications)
export const createPlatformStyles = <T extends Record<string, any>>(
  styles: T,
  webOverrides?: Partial<T>,
  mobileOverrides?: Partial<T>
): T => {
  return platformSelect({
    web: StyleSheet.create({ ...styles, ...webOverrides }),
    default: StyleSheet.create({ ...styles, ...mobileOverrides }),
  }) || StyleSheet.create(styles);
}; 

// NEW: Web-safe container style creator
export const createResponsiveContainer = (options?: {
  maxWidth?: number;
  padding?: number;
  backgroundColor?: string;
}) => {
  const defaultOptions = {
    maxWidth: 1200,
    padding: 16,
    backgroundColor: '#ffffff',
    ...options,
  };
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: defaultOptions.backgroundColor,
      padding: defaultOptions.padding,
      ...Platform.select({
        web: {
          maxWidth: defaultOptions.maxWidth,
          marginHorizontal: 'auto',
          width: '100%',
          minHeight: '100%', // Changed from '100vh' to '100%'
          // Removed boxSizing as it's not supported in RN types
        },
      }),
    },
  });
};

export { globalStyles };