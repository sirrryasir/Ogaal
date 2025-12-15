import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import BrandColors from '../../../theme';

interface Notification {
  id: string;
  type: 'Alert' | 'Update' | 'Reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const NotificationsScreen: React.FC = () => {
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
      <View style={styles.topBar}>
        <Typography variant="h1" style={styles.topBarTitle}>Notifications</Typography>
        <View style={styles.topBarRight}>
          <MaterialIcons name="notifications" size={24} color={BrandColors.brand.blue} />
        </View>
      </View>
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
            <Typography variant="h2" style={styles.emptyTitle}>No Notifications</Typography>
            <Typography variant="body" style={styles.emptyMessage}>You're all caught up! Check back later for updates.</Typography>
          </View>
        )}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: BrandColors.app.bodyBackground,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.ui.border,
  },
  topBarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BrandColors.brand.blue,
  },
  topBarRight: {
    // For future icons
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