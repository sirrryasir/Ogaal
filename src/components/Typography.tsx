import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme } = useTheme();
  const variantStyles = {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    h3: { fontSize: 20, fontWeight: '600' },
    body: { fontSize: 16 },
    caption: { fontSize: 14, color: theme.ui.mutedForeground },
    button: { fontSize: 16, fontWeight: '600' },
  };

  const colorValue = theme.ui[color as keyof typeof theme.ui] || theme.ui.foreground;

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