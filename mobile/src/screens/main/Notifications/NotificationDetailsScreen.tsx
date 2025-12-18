import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';

const { width } = Dimensions.get('window');

interface Notification {
  id: string;
  type: 'Alert' | 'Update' | 'Reminder' | 'Community' | 'System';
  title: string;
  message: string;
  timestamp: string;
  timeExact: string;
  read: boolean;
  priority: 'High' | 'Medium' | 'Low';
  category?: string;
}

interface RouteParams {
  notification: Notification;
}

const NotificationDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { notification } = route.params as RouteParams;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'Alert': return '#ef4444';
      case 'Update': return '#0c6dff';
      case 'Reminder': return '#f59e0b';
      case 'Community': return '#10b981';
      case 'System': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#64748b';
    }
  };

  const handleTakeAction = () => {
    if (notification.type === 'Alert') {
      Alert.alert(
        'Emergency Action Required',
        'Please follow these steps:\n1. Conserve water\n2. Check sources\n3. Contact authorities',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call Emergency', onPress: () => Linking.openURL('tel:911') },
        ]
      );
    }
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share this notification with others?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share', style: 'default' },
    ]);
  };

  return (
    <Layout style={styles.container} noPadding>
      {/* Header */}
      <LinearGradient
        colors={['#0c6dff', '#4f46e5']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.headerBtn} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={22} color="white" />
          </TouchableOpacity>

          <Typography style={styles.headerTitle}>
            Notification Details
          </Typography>

          <TouchableOpacity 
            style={styles.headerBtn} 
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Feather name="share-2" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card - Fixed padding and margins */}
        <View style={styles.card}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(notification.type) + '15' }]}>
              <MaterialIcons
                name={
                  notification.type === 'Alert' ? 'warning' :
                  notification.type === 'Update' ? 'info' :
                  notification.type === 'Reminder' ? 'schedule' :
                  notification.type === 'Community' ? 'groups' :
                  notification.type === 'System' ? 'system-update' : 'notifications'
                }
                size={24}
                color={getNotificationColor(notification.type)}
              />
            </View>

            <View style={styles.titleContainer}>
              <Typography style={styles.title}>
                {notification.title}
              </Typography>

              <View style={styles.badgesContainer}>
                <View style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(notification.priority) + '20' }
                ]}>
                  <Typography style={[
                    styles.priorityBadgeText,
                    { color: getPriorityColor(notification.priority) }
                  ]}>
                    {notification.priority.toUpperCase()} PRIORITY
                  </Typography>
                </View>

                {notification.category && (
                  <View style={[
                    styles.categoryBadge,
                    { backgroundColor: getNotificationColor(notification.type) + '10' }
                  ]}>
                    <Typography style={[
                      styles.categoryBadgeText,
                      { color: getNotificationColor(notification.type) }
                    ]}>
                      {notification.category.toUpperCase()}
                    </Typography>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Timestamp */}
          <View style={styles.timeContainer}>
            <Feather name="clock" size={14} color="#94a3b8" />
            <Typography style={styles.timeText}>
              {notification.timeExact}
            </Typography>
            <View style={styles.timeStatus}>
              <Feather 
                name={notification.read ? "check-circle" : "circle"} 
                size={14} 
                color={notification.read ? "#10b981" : "#f59e0b"} 
              />
              <Typography style={styles.statusText}>
                {notification.read ? 'Read' : 'Unread'}
              </Typography>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Message Section */}
          <View style={styles.section}>
            <Typography style={styles.sectionLabel}>Message</Typography>
            <Typography style={styles.message}>
              {notification.message}
            </Typography>
          </View>

          {/* Details Section */}
          <View style={styles.section}>
            <Typography style={styles.sectionTitle}>
              Additional Details
            </Typography>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Feather name="calendar" size={16} color="#0c6dff" />
                </View>
                <View>
                  <Typography style={styles.detailLabel}>Received</Typography>
                  <Typography style={styles.detailValue}>{notification.timestamp}</Typography>
                </View>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Feather name="activity" size={16} color="#0c6dff" />
                </View>
                <View>
                  <Typography style={styles.detailLabel}>Status</Typography>
                  <Typography style={[
                    styles.detailValue, 
                    { color: notification.read ? '#10b981' : '#f59e0b' }
                  ]}>
                    {notification.read ? 'Read' : 'Unread'}
                  </Typography>
                </View>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Feather name="alert-triangle" size={16} color="#0c6dff" />
                </View>
                <View>
                  <Typography style={styles.detailLabel}>Type</Typography>
                  <Typography style={[
                    styles.detailValue,
                    { color: getNotificationColor(notification.type) }
                  ]}>
                    {notification.type}
                  </Typography>
                </View>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Feather name="shield" size={16} color="#0c6dff" />
                </View>
                <View>
                  <Typography style={styles.detailLabel}>Security Level</Typography>
                  <Typography style={[
                    styles.detailValue,
                    { color: getPriorityColor(notification.priority) }
                  ]}>
                    {notification.priority}
                  </Typography>
                </View>
              </View>
            </View>
          </View>

          {/* Recommended Actions for Alerts */}
          {notification.type === 'Alert' && (
            <View style={styles.actionSection}>
              <Typography style={styles.sectionTitle}>
                Recommended Actions
              </Typography>
              <View style={styles.actionItems}>
                <View style={styles.actionItem}>
                  <View style={styles.actionIcon}>
                    <Ionicons name="water-outline" size={18} color="#0c6dff" />
                  </View>
                  <Typography style={styles.actionText}>
                    Conserve water immediately
                  </Typography>
                </View>
                <View style={styles.actionItem}>
                  <View style={styles.actionIcon}>
                    <Feather name="map-pin" size={18} color="#0c6dff" />
                  </View>
                  <Typography style={styles.actionText}>
                    Check alternative water sources
                  </Typography>
                </View>
                <View style={styles.actionItem}>
                  <View style={styles.actionIcon}>
                    <Feather name="phone" size={18} color="#0c6dff" />
                  </View>
                  <Typography style={styles.actionText}>
                    Contact local water authorities
                  </Typography>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons - Fixed positioning */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: getNotificationColor(notification.type) }
            ]}
            onPress={handleTakeAction}
            activeOpacity={0.8}
          >
            <Feather name="check-circle" size={18} color="white" />
            <Typography style={styles.primaryButtonText}>
              Take Action
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Feather name="arrow-left" size={18} color="#0c6dff" />
            <Typography style={styles.secondaryButtonText}>
              Back to Notifications
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  
  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 45 : 25,
    paddingBottom: 16,
    paddingHorizontal: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },

  // Main Card - Fixed margins and padding
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  // Card Header
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
    lineHeight: 24,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  priorityBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Time Container
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  timeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 20,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  message: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },

  // Details Grid
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (width - 72) / 2, // Calculate width for 2 columns with proper spacing
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(12, 109, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },

  // Action Section
  actionSection: {
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  actionItems: {
    gap: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(12, 109, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },

  // Buttons Container - Fixed positioning
  buttonsContainer: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#0c6dff',
  },
  secondaryButtonText: {
    color: '#0c6dff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Bottom Spacing
  bottomSpacing: {
    height: 20,
  },
});

export default NotificationDetailsScreen;