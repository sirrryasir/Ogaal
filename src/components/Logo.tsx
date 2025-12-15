import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BrandColors from '../theme';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const sizeStyles = {
    small: { fontSize: 24 },
    medium: { fontSize: 36 },
    large: { fontSize: 48 },
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.logoText, sizeStyles[size]]}>BARWAAQO</Text>
      {/* <Text style={[styles.brandText, sizeStyles[size]]}>AI</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontWeight: 'bold',
    color: BrandColors.brand.blue,
  },
  brandText: {
    fontWeight: '300',
    color: BrandColors.ui.foreground,
    marginTop: 8,
  },
});

export default Logo;