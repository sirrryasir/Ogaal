import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandColors from '../theme';

interface LayoutProps {
  children: React.ReactNode;
  style?: any;
  centered?: boolean;
  noPadding?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, style, centered = true, noPadding = false }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, style, !centered && styles.notCentered, noPadding && styles.noPadding]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.app.bodyBackground,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  notCentered: {
    justifyContent: 'flex-start',
  },
  noPadding: {
    padding: 0,
  },
});

export default Layout;