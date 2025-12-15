import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  style?: any;
  centered?: boolean;
  noPadding?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, style, centered = true, noPadding = false }) => {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.app.bodyBackground }]}>
      <View style={[styles.container, style, !centered && styles.notCentered, noPadding && styles.noPadding]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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