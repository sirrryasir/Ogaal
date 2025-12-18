import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';

const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
    previewEnabled: true,
    marketingEmails: false,
    appUpdates: true,
    securityAlerts: true,
    paymentNotifications: true,
    rideUpdates: true,
    promotionalOffers: false,
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof settings],
    }));
  };

  const handleSave = () => {
    Alert.alert(
      'Settings Saved',
      'Your notification preferences have been updated.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all notification settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
              pushNotifications: true,
              emailNotifications: false,
              smsNotifications: false,
              soundEnabled: true,
              vibrationEnabled: true,
              previewEnabled: true,
              marketingEmails: false,
              appUpdates: true,
              securityAlerts: true,
              paymentNotifications: true,
              rideUpdates: true,
              promotionalOffers: false,
            });
            Alert.alert('Reset Complete', 'All settings have been reset to default.');
          },
        },
      ]
    );
  };

  const notificationCategories = [
    {
      title: 'General',
      icon: 'bell',
      color: '#8B5CF6',
      items: [
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive push notifications on your device',
          icon: 'phone-notifications',
        },
        {
          key: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive notifications via email',
          icon: 'email',
        },
        {
          key: 'smsNotifications',
          label: 'SMS Notifications',
          description: 'Receive notifications via SMS',
          icon: 'message',
        },
      ],
    },
    {
      title: 'Preferences',
      icon: 'tune',
      color: '#10B981',
      items: [
        {
          key: 'soundEnabled',
          label: 'Sound',
          description: 'Play sound for notifications',
          icon: 'volume-high',
        },
        {
          key: 'vibrationEnabled',
          label: 'Vibration',
          description: 'Vibrate on notifications',
          icon: 'vibrate',
        },
        {
          key: 'previewEnabled',
          label: 'Preview',
          description: 'Show notification content preview',
          icon: 'eye',
        },
      ],
    },
    {
      title: 'Notification Types',
      icon: 'notifications',
      color: '#F59E0B',
      items: [
        {
          key: 'appUpdates',
          label: 'App Updates',
          description: 'Get notified about app updates',
          icon: 'update',
        },
        {
          key: 'securityAlerts',
          label: 'Security Alerts',
          description: 'Important security notifications',
          icon: 'security',
        },
        {
          key: 'paymentNotifications',
          label: 'Payment Updates',
          description: 'Payment confirmations and receipts',
          icon: 'credit-card',
        },
        {
          key: 'rideUpdates',
          label: 'Ride Updates',
          description: 'Driver location and ride status',
          icon: 'car',
        },
        {
          key: 'promotionalOffers',
          label: 'Promotional Offers',
          description: 'Special discounts and promotions',
          icon: 'tag',
        },
        {
          key: 'marketingEmails',
          label: 'Marketing Emails',
          description: 'Newsletters and marketing content',
          icon: 'campaign',
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Layout style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Feather name="chevron-left" size={24} color="white" />
            </TouchableOpacity>
            <Typography style={styles.headerTitle}>Notifications</Typography>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Typography style={styles.saveButtonText}>Save</Typography>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Master Toggle */}
          <View style={styles.masterToggleSection}>
            <View style={styles.masterToggleCard}>
              <View style={styles.masterToggleIcon}>
                <Ionicons name="notifications" size={32} color="#8B5CF6" />
              </View>
              <View style={styles.masterToggleInfo}>
                <Typography style={styles.masterToggleTitle}>
                  All Notifications
                </Typography>
                <Typography style={styles.masterToggleSubtitle}>
                  Master switch for all notification types
                </Typography>
              </View>
              <Switch
                value={settings.pushNotifications}
                onValueChange={() => toggleSetting('pushNotifications')}
                trackColor={{ false: '#E2E8F0', true: '#C4B5FD' }}
                thumbColor={settings.pushNotifications ? '#8B5CF6' : '#FFFFFF'}
                ios_backgroundColor="#E2E8F0"
                style={styles.masterSwitch}
              />
            </View>
            {!settings.pushNotifications && (
              <View style={styles.disabledOverlay}>
                <Typography style={styles.disabledText}>
                  All notifications are currently disabled
                </Typography>
              </View>
            )}
          </View>

          {/* Notification Categories */}
          <View style={styles.categoriesContainer}>
            {notificationCategories.map((category, index) => (
              <View key={index} style={styles.categorySection}>
                {/* Category Header */}
                <View style={styles.categoryHeader}>
                  <View style={[styles.categoryIconContainer, { backgroundColor: `${category.color}15` }]}>
                    <MaterialCommunityIcons 
                      name={category.icon as any} 
                      size={22} 
                      color={category.color} 
                    />
                  </View>
                  <Typography style={styles.categoryTitle}>
                    {category.title}
                  </Typography>
                </View>

                {/* Settings Items */}
                <View style={styles.categoryContent}>
                  {category.items.map((item, itemIndex) => (
                    <View 
                      key={itemIndex} 
                      style={[
                        styles.settingItem,
                        itemIndex === category.items.length - 1 && styles.lastItem,
                      ]}
                    >
                      <View style={styles.settingLeft}>
                        <View style={[styles.itemIconContainer, { backgroundColor: `${category.color}10` }]}>
                          <MaterialCommunityIcons 
                            name={item.icon as any} 
                            size={20} 
                            color={category.color} 
                          />
                        </View>
                        <View style={styles.itemText}>
                          <Typography style={styles.itemLabel}>
                            {item.label}
                          </Typography>
                          <Typography style={styles.itemDescription}>
                            {item.description}
                          </Typography>
                        </View>
                      </View>
                      <Switch
                        value={settings[item.key as keyof typeof settings] as boolean}
                        onValueChange={() => toggleSetting(item.key)}
                        trackColor={{ false: '#E2E8F0', true: `${category.color}40` }}
                        thumbColor={
                          settings[item.key as keyof typeof settings] 
                            ? category.color 
                            : '#FFFFFF'
                        }
                        ios_backgroundColor="#E2E8F0"
                        disabled={!settings.pushNotifications}
                        style={settings.pushNotifications ? null : { opacity: 0.5 }}
                      />
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Do Not Disturb */}
          <TouchableOpacity 
            style={styles.dndCard}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Do Not Disturb', 'Configure quiet hours for notifications')}
          >
            <View style={styles.dndContent}>
              <View style={styles.dndIcon}>
                <Feather name="moon" size={24} color="#4F46E5" />
              </View>
              <View style={styles.dndInfo}>
                <Typography style={styles.dndTitle}>
                  Do Not Disturb
                </Typography>
                <Typography style={styles.dndSubtitle}>
                  Silence notifications during specified hours
                </Typography>
              </View>
              <View style={styles.dndRight}>
                <Typography style={styles.dndStatus}>Off</Typography>
                <Feather name="chevron-right" size={20} color="#94A3B8" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Reset Button */}
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <View style={styles.resetButtonContent}>
              <Feather name="refresh-cw" size={20} color="#64748B" />
              <Typography style={styles.resetButtonText}>
                Reset to Default Settings
              </Typography>
            </View>
          </TouchableOpacity>

          {/* Info Note */}
          <View style={styles.infoCard}>
            <Feather name="info" size={18} color="#3B82F6" style={styles.infoIcon} />
            <Typography style={styles.infoText}>
              Some settings may take effect after restarting the app.
            </Typography>
          </View>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#8B5CF6',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.5,
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  masterToggleSection: {
    marginBottom: 30,
    position: 'relative',
  },
  masterToggleCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  masterToggleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  masterToggleInfo: {
    flex: 1,
  },
  masterToggleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  masterToggleSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  masterSwitch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  disabledText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  categoryIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  categoryContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  itemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemText: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  dndCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  dndContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dndIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dndInfo: {
    flex: 1,
  },
  dndTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  dndSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  dndRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dndStatus: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
    marginRight: 8,
  },
  resetButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resetButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
    marginLeft: 10,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 20,
  },
});

export default NotificationSettingsScreen;