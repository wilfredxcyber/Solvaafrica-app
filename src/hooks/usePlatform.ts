import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { isWeb, isMobile } from '../utils';

export const usePlatform = () => {
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const breakpoints = {
    isSmallScreen: dimensions.width < 768,
    isMediumScreen: dimensions.width >= 768 && dimensions.width < 1024,
    isLargeScreen: dimensions.width >= 1024,
    isTablet: dimensions.width >= 768 && isMobile,
    isDesktop: dimensions.width >= 1024 && isWeb,
  };

  return {
    ...dimensions,
    isWeb,
    isMobile,
    ...breakpoints,
    // Helper for responsive values
    responsiveValue: <T>(mobile: T, tablet: T, desktop: T): T => {
      if (breakpoints.isDesktop) return desktop;
      if (breakpoints.isTablet || breakpoints.isMediumScreen) return tablet;
      return mobile;
    },
  };
};