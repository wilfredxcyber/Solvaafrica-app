import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';

const {width} = Dimensions.get('window');


export const ResponsiveView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isWeb = Platform.OS === 'web';
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;
  const isLargeDesktop = width >= 1200;

  const containerStyles = [
    styles.container,
    isWeb && isTablet && styles.tabletContainer,
    isWeb && isDesktop && styles.desktopContainer,
    isWeb && isLargeDesktop && styles.largeDesktopContainer,
  ];

  const contentStyles = [
    styles.content,
    isWeb && isTablet && styles.tabletContent,
  ];

  return (
    <View style={containerStyles}>
      <View style={contentStyles}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabletContainer: {
    maxWidth: 750,
    marginHorizontal: 'auto',
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    // Note: boxShadow isn't supported in RN; use elevation for Android or skip for web
    height: 'calc(100vh - 40px)' as any, // Type assertion for web
  },
  desktopContainer: {
    maxWidth: 1000,
  },
  largeDesktopContainer: {
    maxWidth: 1200,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabletContent: {
    padding: 32,
  },
});