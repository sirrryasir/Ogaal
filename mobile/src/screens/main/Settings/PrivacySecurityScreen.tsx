import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';

const PrivacySecurityScreen: React.FC = () => {
  const navigation = useNavigation();
  
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [autoLogout, setAutoLogout] = useState(true);
  const [dataCollection, setDataCollection] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const toggleSwitch = (setter: React.Dispatch<React.SetStateAction<boolean>>, value: boolean) => {
    setter(!value);
  };

  const handleSaveSettings = () => {
    Alert.alert(
      'Settings Saved',
      'Your privacy and security settings have been updated.',
      [{ text: 'OK' }]
    );
  };

  const handleDataPrivacy = () => {
    Alert.alert(
      'Data Privacy',
      'You can request to download or delete your personal data at any time.',
      [
        { text: 'Request Data', onPress: () => console.log('Request data') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete account') },
      ]
    );
  };

  return (
    <Layout style={styles.container} noPadding>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#0c6dff', '#4f46e5']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={22} color="white" />
          </TouchableOpacity>
          <Typography style={styles.headerTitle}>
            Privacy & Security
          </Typography>
          <View style={styles.headerPlaceholder} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Security Section */}
        <View style={styles.section}>
          <Typography style={styles.sectionTitle}>
            Security
          </Typography>
          
          <View style={styles.settingCard}>
            <View style={styles.settingContent}>
              <View style={[styles.settingIcon, { backgroundColor: '#3b82f615' }]}>
                <Ionicons name="finger-print" size={22} color="#3b82f6" />
              </View>
              <View style={styles.settingText}>
                <Typography style={styles.settingTitle}>
                  Biometric Authentication
                </Typography>
                <Typography style={styles.settingDescription}>
                  Use fingerprint or face ID to log in
                </Typography>
              </View>
              <Switch
                value={biometricAuth}
                onValueChange={() => toggleSwitch(setBiometricAuth, biometricAuth)}
                trackColor={{ false: '#e2e8f0', true: '#93c5fd' }}
                thumbColor={biometricAuth ? '#3b82f6' : '#94a3b8'}
                ios_backgroundColor="#e2e8f0"
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingContent}>
              <View style={[styles.settingIcon, { backgroundColor: '#10b98115' }]}>
                <MaterialIcons name="security" size={22} color="#10b981" />
              </View>
              <View style={styles.settingText}>
                <Typography style={styles.settingTitle}>
                  Two-Factor Authentication
                </Typography>
                <Typography style={styles.settingDescription}>
                  Add an extra layer of security
                </Typography>
              </View>
              <Switch
                value={twoFactorAuth}
                onValueChange={() => toggleSwitch(setTwoFactorAuth, twoFactorAuth)}
                trackColor={{ false: '#e2e8f0', true: '#a7f3d0' }}
                thumbColor={twoFactorAuth ? '#10b981' : '#94a3b8'}
                ios_backgroundColor="#e2e8f0"
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingContent}>
              <View style={[styles.settingIcon, { backgroundColor: '#f59e0b15' }]}>
                <Feather name="log-out" size={22} color="#f59e0b" />
              </View>
              <View style={styles.settingText}>
                <Typography style={styles.settingTitle}>
                  Auto Logout
                </Typography>
                <Typography style={styles.settingDescription}>
                  Log out automatically after 15 minutes
                </Typography>
              </View>
              <Switch
                value={autoLogout}
                onValueChange={() => toggleSwitch(setAutoLogout, autoLogout)}
                trackColor={{ false: '#e2e8f0', true: '#fde68a' }}
                thumbColor={autoLogout ? '#f59e0b' : '#94a3b8'}
                ios_backgroundColor="#e2e8f0"
              />
            </View>
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Typography style={styles.sectionTitle}>
            Privacy
          </Typography>
          
          <View style={styles.settingCard}>
            <View style={styles.settingContent}>
              <View style={[styles.settingIcon, { backgroundColor: '#8b5cf615' }]}>
                <MaterialIcons name="data-usage" size={22} color="#8b5cf6" />
              </View>
              <View style={styles.settingText}>
                <Typography style={styles.settingTitle}>
                  Data Collection
                </Typography>
                <Typography style={styles.settingDescription}>
                  Allow anonymous data collection for improvements
                </Typography>
              </View>
              <Switch
                value={dataCollection}
                onValueChange={() => toggleSwitch(setDataCollection, dataCollection)}
                trackColor={{ false: '#e2e8f0', true: '#ddd6fe' }}
                thumbColor={dataCollection ? '#8b5cf6' : '#94a3b8'}
                ios_backgroundColor="#e2e8f0"
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingContent}>
              <View style={[styles.settingIcon, { backgroundColor: '#ec489915' }]}>
                <MaterialIcons name="mark-email-read" size={22} color="#ec4899" />
              </View>
              <View style={styles.settingText}>
                <Typography style={styles.settingTitle}>
                  Marketing Emails
                </Typography>
                <Typography style={styles.settingDescription}>
                  Receive promotional emails and updates
                </Typography>
              </View>
              <Switch
                value={marketingEmails}
                onValueChange={() => toggleSwitch(setMarketingEmails, marketingEmails)}
                trackColor={{ false: '#e2e8f0', true: '#fbcfe8' }}
                thumbColor={marketingEmails ? '#ec4899' : '#94a3b8'}
                ios_backgroundColor="#e2e8f0"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleDataPrivacy}
            activeOpacity={0.7}
          >
            <View style={styles.actionContent}>
              <View style={[styles.actionIcon, { backgroundColor: '#ef444415' }]}>
                <Feather name="download" size={22} color="#ef4444" />
              </View>
              <View style={styles.actionText}>
                <Typography style={styles.actionTitle}>
                  Data Privacy
                </Typography>
                <Typography style={styles.actionDescription}>
                  Download or delete your personal data
                </Typography>
              </View>
              <Feather name="chevron-right" size={20} color="#94a3b8" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Typography style={styles.sectionTitle}>
            Account Actions
          </Typography>
          
          <TouchableOpacity 
            style={styles.dangerCard}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={styles.dangerContent}>
              <View style={[styles.dangerIcon, { backgroundColor: '#ef444420' }]}>
                <Feather name="trash-2" size={22} color="#ef4444" />
              </View>
              <View style={styles.dangerText}>
                <Typography style={styles.dangerTitle}>
                  Delete Account
                </Typography>
                <Typography style={styles.dangerDescription}>
                  Permanently delete your account and all data
                </Typography>
              </View>
              <Feather name="chevron-right" size={20} color="#ef4444" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSaveSettings}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#0c6dff', '#4f46e5']}
            style={styles.saveButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Feather name="check-circle" size={20} color="white" />
            <Typography style={styles.saveButtonText}>
              Save Settings
            </Typography>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  headerPlaceholder: {
    width: 44,
  },
  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
    marginLeft: 4,
  },
  // Setting Cards
  settingCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  // Action Cards
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  // Danger Card
  dangerCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  dangerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dangerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  dangerText: {
    flex: 1,
  },
  dangerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 2,
  },
  dangerDescription: {
    fontSize: 12,
    color: '#ef4444',
    lineHeight: 16,
  },
  // Save Button
  saveButton: {
    marginTop: 20,
    marginBottom: 16,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Bottom Spacing
  bottomSpacing: {
    height: 20,
  },
});

export default PrivacySecurityScreen;