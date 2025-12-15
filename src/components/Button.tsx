import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
  accessibilityLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();
  const variantStyles = {
    primary: {
      backgroundColor: theme.ui.primary,
      borderColor: theme.ui.primary,
    },
    secondary: {
      backgroundColor: theme.ui.secondary,
      borderColor: theme.ui.secondary,
    },
    destructive: {
      backgroundColor: theme.ui.destructive,
      borderColor: theme.ui.destructive,
    },
  };

  const sizeStyles = {
    small: { paddingVertical: 8, paddingHorizontal: 16 },
    medium: { paddingVertical: 12, paddingHorizontal: 24 },
    large: { paddingVertical: 16, paddingHorizontal: 32 },
  };

  const textColors = {
    primary: theme.ui.primaryForeground,
    secondary: theme.ui.secondaryForeground,
    destructive: theme.ui.destructiveForeground,
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles[variant],
        sizeStyles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <Text style={[styles.text, { color: textColors[variant] }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
});

export default Button;