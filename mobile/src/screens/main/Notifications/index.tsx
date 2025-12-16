import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
const BrandColors = require('../../../theme');
import { useTranslation } from '../../../contexts/LanguageContext';

interface Notification {
  id: string;
  type: 'Alert' | 'Update' | 'Reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const NotificationsScreen: React.FC = () => {
  const { t } = useTranslation();
  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'Alert',
      title: 'Water Shortage Alert',
      message: 'Severe water shortage detected in your area. Please conserve water.',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      type: 'Update',
      title: 'New Water Source Added',
      message: 'A new borehole has been added near your location.',
      timestamp: '1 day ago',
      read: true,
    },
    {
      id: '3',
      type: 'Reminder',
      title: 'Weekly Report Due',
      message: 'Don\'t forget to submit your weekly water usage report.',
      timestamp: '3 days ago',
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Alert': return 'warning';
      case 'Update': return 'information-circle';
      case 'Reminder': return 'time';
      default: return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'Alert': return BrandColors.brand.danger;
      case 'Update': return BrandColors.brand.blue;
      case 'Reminder': return BrandColors.brand.warning;
      default: return BrandColors.ui.primary;
    }
  };

  return (
    <Layout noPadding>
      <LinearGradient colors={['#0c6dff', '#0056b3']} style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.titleContainer}>
              <Ionicons name="notifications" size={28} color="white" />
              <Typography variant="h1" style={styles.headerTitle}>{t('notifications')}</Typography>
            </View>
          </View>
        </View>
      </LinearGradient>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <View key={notification.id} style={[styles.notificationCard, !notification.read && styles.unreadCard]}>
              <View style={styles.notificationHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={getNotificationIcon(notification.type)}
                    size={24}
                    color={getNotificationColor(notification.type)}
                  />
                </View>
                <View style={styles.notificationContent}>
                  <Typography variant="h3" style={styles.notificationTitle}>{notification.title}</Typography>
                  <Typography variant="body" style={styles.notificationMessage}>{notification.message}</Typography>
                  <Typography variant="caption" style={styles.timestamp}>{notification.timestamp}</Typography>
                </View>
                {!notification.read && <View style={styles.unreadDot} />}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off" size={64} color={BrandColors.ui.secondaryForeground} />
            <Typography variant="h2" style={styles.emptyTitle}>{t('noNotifications')}</Typography>
            <Typography variant="body" style={styles.emptyMessage}>{t('noNotificationsMessage')}</Typography>
          </View>
        )}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  notificationCard: {
    backgroundColor: BrandColors.ui.card,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: BrandColors.brand.blue,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 15,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BrandColors.ui.foreground,
    marginBottom: 5,
  },
  notificationMessage: {
    color: BrandColors.ui.secondaryForeground,
    marginBottom: 5,
    lineHeight: 20,
  },
  timestamp: {
    color: BrandColors.ui.mutedForeground,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BrandColors.brand.blue,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BrandColors.ui.secondaryForeground,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyMessage: {
    textAlign: 'center',
    color: BrandColors.ui.mutedForeground,
    lineHeight: 22,
  },
});

export default NotificationsScreen;