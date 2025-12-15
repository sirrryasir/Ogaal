import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../../../components/Layout';
import Logo from '../../../components/Logo';
import Typography from '../../../components/Typography';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import BrandColors from '../../../theme';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const [phonePrefix, setPhonePrefix] = useState('+252');
  const [phone, setPhone] = useState('');
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

  const handleSendOTP = () => {
    setErrorMessage('');
    if (!phone) {
      setErrorMessage('Please enter your phone number');
      return;
    }
    setLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      (navigation as any).navigate('OTP', { phone: phonePrefix + phone, type: 'forgot' });
    }, 1000);
  };

  return (
    <Layout centered={false} noPadding={true}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Logo />
              <Typography variant="h1" style={styles.title}>Forgot Password</Typography>
              <Typography variant="body" style={styles.subtitle}>Enter your phone number to reset your password</Typography>
            </View>
            <View style={styles.content}>
              <Input
                label="Phone Number"
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
                leftComponent={phoneLeftComponent}
              />
              <View style={styles.button}>
                <Button
                  title="Send OTP"
                  onPress={handleSendOTP}
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
  prefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefixText: {
    marginRight: 4,
  },
});

export default ForgotPasswordScreen;