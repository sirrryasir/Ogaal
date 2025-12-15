import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../../../components/Layout';
import Logo from '../../../components/Logo';
import Typography from '../../../components/Typography';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import BrandColors from '../../../theme';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+252');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const togglePrefix = () => {
    setPhonePrefix(phonePrefix === '+252' ? '+259' : '+252');
  };

  const phoneLeftComponent = (
    <TouchableOpacity onPress={togglePrefix} style={styles.prefixContainer}>
      <Typography variant="body" style={styles.prefixText}>{phonePrefix}</Typography>
      <Ionicons name="chevron-down" size={16} color={BrandColors.ui.mutedForeground} />
    </TouchableOpacity>
  );

  const handleRegister = () => {
    setErrorMessage('');
    if (!fullName || !phone || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    setLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      (navigation as any).navigate('OTP', { fullName, phone: phonePrefix + phone, password });
    }, 1000);
  };

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <Layout centered={false} noPadding={true}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Logo />
              <Typography variant="h1" style={styles.title}>Create Account</Typography>
              <Typography variant="body" style={styles.subtitle}>Join us today</Typography>
            </View>
            <View style={styles.content}>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                leftIcon="person"
              />
              <Input
                label="Phone Number"
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
                leftComponent={phoneLeftComponent}
              />
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                isPassword
              />
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isPassword
              />
              <View style={styles.button}>
                <Button
                  title="Register"
                  onPress={handleRegister}
                  loading={loading}
                />
              </View>
              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Typography variant="caption" color="destructive" style={styles.errorText}>
                    {errorMessage}
                  </Typography>
                </View>
              ) : null}
              <View style={styles.links}>
                <TouchableOpacity onPress={handleLogin}>
                  <Typography variant="caption" color="primary">Already have an account? Login</Typography>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    marginTop: 24,
  },
  subtitle: {
    marginTop: 12,
    textAlign: 'center',
    color: BrandColors.ui.mutedForeground,
  },
  content: {
    width: '100%',
  },
  button: {
    marginTop: 24,
  },
  errorContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fef2f2', // Light red background
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    textAlign: 'center',
  },
  links: {
    marginTop: 16,
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  prefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefixText: {
    marginRight: 4,
  },
});

export default RegisterScreen;