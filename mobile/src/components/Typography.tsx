import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'button';
  color?: string;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = 'foreground',
  style,
  children,
  ...props
}) => {
  const colorMap = {
    background: '#ffffff',
    foreground: '#0f172a',
    card: '#ffffff',
    cardForeground: '#0f172a',
    primary: '#0c6dff',
    primaryForeground: '#ffffff',
    secondary: '#f1f5f9',
    secondaryForeground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    accent: '#f1f5f9',
    accentForeground: '#0f172a',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#0c6dff',
  };

  const variantStyles = {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    h3: { fontSize: 20, fontWeight: '600' },
    body: { fontSize: 16 },
    caption: { fontSize: 14, color: '#64748b' },
    button: { fontSize: 16, fontWeight: '600' },
  };

  const colorValue = colorMap[color as keyof typeof colorMap] || '#0f172a';

  return (
    <Text
      style={[variantStyles[variant], { color: colorValue }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default Typography;