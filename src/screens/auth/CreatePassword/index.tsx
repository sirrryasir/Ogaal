import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Layout from '../../../components/Layout';
import Logo from '../../../components/Logo';
import Typography from '../../../components/Typography';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import BrandColors from '../../../theme';

const CreatePasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fullName, phone } = route.params as { fullName: string; phone: string };
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreatePassword = () => {
    setErrorMessage('');
    if (!password || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    setLoading(true);
    // Simulate creating password
    setTimeout(async () => {
      setLoading(false);
      // Simulate token storage
      await AsyncStorage.setItem('token', 'sample-token');
      navigation.navigate('Main' as never);
    }, 1000);
  };

  return (
    <Layout centered={false} noPadding={true}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Logo />
              <Typography variant="h1" style={styles.title}>Create Password</Typography>
              <Typography variant="body" style={styles.subtitle}>Set a strong password for your account</Typography>
            </View>
            <View style={styles.content}>
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
                  title="Create Password"
                  onPress={handleCreatePassword}
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
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    textAlign: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
});

export default CreatePasswordScreen;