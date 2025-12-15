import React, { useState } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from './Typography';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  label?: string;
  isPassword?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  leftComponent?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  label,
  isPassword = false,
  leftIcon,
  leftComponent,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <View style={styles.container}>
      {label && <Typography variant="caption" style={styles.label}>{label}</Typography>}
      <View style={[styles.inputContainer, isFocused && styles.focusedInput, error && styles.errorInput]}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            <Ionicons
              name={leftIcon}
              size={20}
              color={'#64748b'}
            />
          </View>
        )}
        {leftComponent && <View style={styles.leftComponent}>{leftComponent}</View>}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor={'#64748b'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          underlineColorAndroid="transparent"
          selectionColor={'#0c6dff'}
        />
        {isPassword && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={'#64748b'}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Typography variant="caption" color="destructive" style={styles.error}>{error}</Typography>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
  },
  inputContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   borderWidth: 1,
   borderColor: '#e2e8f0',
   borderRadius: 8,
   backgroundColor: '#e2e8f0',
 },
 focusedInput: {
   borderColor: '#0c6dff',
 },
 input: {
   flex: 1,
   padding: 12,
   color: '#0f172a',
   fontSize: 16,
 },
  icon: {
    padding: 12,
  },
  leftIcon: {
    padding: 12,
  },
  leftComponent: {
    padding: 12,
  },
  errorInput: {
   borderColor: '#ef4444',
 },
  error: {
    marginTop: 4,
  },
});

export default Input;