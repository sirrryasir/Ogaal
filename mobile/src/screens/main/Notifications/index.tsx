import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Platform,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import { useTranslation } from '../../../contexts/LanguageContext';

// Create a separate interface for navigation props
interface NotificationNavigationProps {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
}

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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NotificationNavigationProps>();
  const { t } = useTranslation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'Alert',
      title: 'Water Shortage Alert',
      message: 'Severe water shortage detected in your area. Please conserve water and check alternative sources. This is a critical alert requiring immediate attention.',
      timestamp: '2 hours ago',
      timeExact: '10:30 AM',
      read: false,
      priority: 'High',
      category: 'Safety'
    },
    {
      id: '2',
      type: 'Update',
      title: 'New Water Source Added',
      message: 'A new functional borehole has been added near Hargeisa market. Water level at 85%. Check the map for exact location details.',
      timestamp: '1 day ago',
      timeExact: 'Yesterday, 3:45 PM',
      read: true,
      priority: 'Medium',
      category: 'Infrastructure'
    },
    {
      id: '3',
      type: 'Reminder',
      title: 'Weekly Report Due',
      message: 'Your weekly water usage report is due tomorrow. Please submit before 6 PM to avoid penalties.',
      timestamp: '3 days ago',
      timeExact: 'Monday, 11:20 AM',
      read: true,
      priority: 'Medium',
      category: 'Reminder'
    },
    {
      id: '4',
      type: 'Community',
      title: 'Community Update',
      message: '5 new community members joined today and contributed water source data. Welcome to our water monitoring community!',
      timestamp: '4 days ago',
      timeExact: 'Sunday, 2:15 PM',
      read: true,
      priority: 'Low',
      category: 'Community'
    },
    {
      id: '5',
      type: 'System',
      title: 'App Update Available',
      message: 'New version 2.1.0 is available with improved maps and faster loading. Update now for better experience.',
      timestamp: '1 week ago',
      timeExact: 'Last Friday, 9:00 AM',
      read: true,
      priority: 'Medium',
      category: 'System'
    },
  ]);

  const [activeFilter, setActiveFilter] = useState<'All' | 'Unread' | 'Alert' | 'Update'>('All');
  const unreadCount = notifications.filter(n => !n.read).length;

  // Collapsible header animations - FIXED: Better animation coordination
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [180, 100],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerTitleTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -15],
    extrapolate: 'clamp',
  });

  const subtitleOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const subtitleTranslateY = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });

  const collapsedHeaderOpacity = scrollY.interpolate({
    inputRange: [80, 120],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const collapsedHeaderTranslateY = scrollY.interpolate({
    inputRange: [80, 120],
    outputRange: [15, 0],
    extrapolate: 'clamp',
  });

  // Filter tabs animation - FIXED: Separate animation from header
  const filterTop = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [180, 100],
    extrapolate: 'clamp',
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Alert': return 'warning';
      case 'Update': return 'info';
      case 'Reminder': return 'schedule';
      case 'Community': return 'groups';
      case 'System': return 'system-update';
      default: return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'Alert': return '#ef4444';
      case 'Update': return '#0c6dff';
      case 'Reminder': return '#f59e0b';
      case 'Community': return '#10b981';
      case 'System': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleViewDetails = (notification: Notification) => {
    navigation.navigate('NotificationDetails', { notification });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      // Add one new notification on refresh (not multiple)
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'Update',
        title: 'Water Level Updated',
        message: 'Water levels in your region have been updated with real-time data from 5 monitoring stations.',
        timestamp: 'Just now',
        timeExact: 'Now',
        read: false,
        priority: 'Medium',
        category: 'Update'
      };
      setNotifications(prev => [newNotification, ...prev]);
      setRefreshing(false);
    }, 1500);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return !notif.read;
    if (activeFilter === 'Alert') return notif.type === 'Alert';
    if (activeFilter === 'Update') return notif.type === 'Update';
    return true;
  });

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={['#f0f7ff', '#e0f2fe']}
        style={styles.emptyGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.emptyIcon}>
          <Ionicons name="notifications-off" size={48} color="#0c6dff" />
        </View>
        <Typography style={styles.emptyTitle}>
          {t('noNotifications') || 'No Notifications'}
        </Typography>
        <Typography style={styles.emptyMessage}>
          {t('noNotificationsMessage') || 'You\'re all caught up! Check back later for updates.'}
        </Typography>
        <TouchableOpacity style={styles.emptyButton}>
          <Typography style={styles.emptyButtonText}>
            Check Back Later
          </Typography>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  return (
    <Layout style={styles.container} noPadding>
      {/* Collapsible Header - FIXED: Simplified animation */}
      <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
        <LinearGradient
          colors={['#0c6dff', '#4f46e5']}
          style={styles.headerBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {/* Expanded Header Content */}
          <Animated.View
            style={[
              styles.expandedContent,
              {
                opacity: headerTitleOpacity,
                transform: [{ translateY: headerTitleTranslateY }]
              }
            ]}
          >
            <View style={styles.headerTopRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Feather name="arrow-left" size={20} color="white" />
              </TouchableOpacity>

              <View style={styles.titleContainer}>
                <View style={styles.titleIcon}>
                  <Ionicons name="notifications" size={18} color="white" />
                </View>
                <Typography style={styles.headerTitle}>
                  Notifications
                </Typography>
                {unreadCount > 0 && (
                  <View style={styles.headerBadge}>
                    <Typography style={styles.badgeText}>
                      {unreadCount}
                    </Typography>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.headerAction}
                onPress={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <Feather name="check-circle" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Subtitle */}
            <Animated.View
              style={[
                styles.subtitleContainer,
                {
                  opacity: subtitleOpacity,
                  transform: [{ translateY: subtitleTranslateY }]
                }
              ]}
            >
              <Typography style={styles.headerSubtitle}>
                Stay updated with water alerts and community news
              </Typography>
            </Animated.View>
          </Animated.View>

          {/* Collapsed Header Content */}
          <Animated.View
            style={[
              styles.collapsedContent,
              {
                opacity: collapsedHeaderOpacity,
                transform: [{ translateY: collapsedHeaderTranslateY }]
              }
            ]}
          >
            <View style={styles.collapsedBar}>
              <TouchableOpacity
                style={styles.collapsedBackButton}
                onPress={() => navigation.goBack()}
              >
                <Feather name="arrow-left" size={18} color="white" />
              </TouchableOpacity>

              <View style={styles.collapsedTitle}>
                <Ionicons name="notifications" size={18} color="white" />
                <Typography style={styles.collapsedTitleText}>
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </Typography>
              </View>

              <TouchableOpacity
                style={styles.collapsedAction}
                onPress={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <Feather name="check-circle" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      {/* Filter Tabs - FIXED: Positioned absolutely but not part of header animation */}
      <Animated.View
        style={[
          styles.filterContainer,
          {
            top: filterTop,
          }
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {['All', 'Unread', 'Alert', 'Update'].map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => setActiveFilter(filter as any)}
              activeOpacity={0.7}
            >
              <Typography style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive
              ]}>
                {filter}
              </Typography>
              {filter === 'Unread' && unreadCount > 0 && (
                <View style={styles.filterBadge}>
                  <Typography style={styles.filterBadgeText}>
                    {unreadCount}
                  </Typography>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Main Content - FIXED: Added proper padding for filters */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#0c6dff"
            colors={['#0c6dff']}
            progressBackgroundColor="#ffffff"
          />
        }
      >
        {/* Add spacer for header height */}
        <View style={styles.headerSpacer} />

        {/* Refresh Info with Spinner */}
        {refreshing && (
          <View style={styles.refreshContainer}>
            <ActivityIndicator size="small" color="#0c6dff" />
            <Typography style={styles.refreshText}>
              Updating notifications...
            </Typography>
          </View>
        )}

        {/* Notifications List */}
        <View style={styles.notificationsContainer}>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <View key={notification.id} style={styles.notificationWrapper}>
                <TouchableOpacity
                  style={[
                    styles.notificationCard,
                    !notification.read && styles.unreadCard,
                  ]}
                  onPress={() => handleMarkAsRead(notification.id)}
                  activeOpacity={0.9}
                >
                  {/* Left Indicator */}
                  <View style={styles.cardIndicator}>
                    <View style={[
                      styles.indicatorBar,
                      { backgroundColor: getNotificationColor(notification.type) }
                    ]} />
                    {!notification.read && (
                      <View style={styles.unreadDot} />
                    )}
                  </View>

                  {/* Main Content - FIXED: Improved layout for categories */}
                  <View style={styles.cardContent}>
                    {/* Header with Category Tags - FIXED: Better layout */}
                    <View style={styles.cardHeader}>
                      <View style={styles.headerLeft}>
                        <View style={[
                          styles.typeIcon,
                          { backgroundColor: getNotificationColor(notification.type) + '15' }
                        ]}>
                          <MaterialIcons
                            name={getNotificationIcon(notification.type) as any}
                            size={16}
                            color={getNotificationColor(notification.type)}
                          />
                        </View>
                        <View style={styles.titleSection}>
                          <Typography style={styles.notificationTitle}>
                            {notification.title}
                          </Typography>

                          {/* TAGS CONTAINER - FIXED: Made always visible */}
                          <View style={styles.tagsContainer}>
                            <View style={[
                              styles.priorityTag,
                              {
                                backgroundColor: getPriorityColor(notification.priority) + '15',
                                borderColor: getPriorityColor(notification.priority) + '30'
                              }
                            ]}>
                              <Typography style={[
                                styles.priorityText,
                                {
                                  color: getPriorityColor(notification.priority),
                                  fontWeight: '700'
                                }
                              ]}>
                                {notification.priority}
                              </Typography>
                            </View>

                            {/* CATEGORY TAG - FIXED: Always visible */}
                            {notification.category && (
                              <View style={[
                                styles.categoryTag,
                                {
                                  backgroundColor: getNotificationColor(notification.type) + '10',
                                  borderColor: getNotificationColor(notification.type) + '30'
                                }
                              ]}>
                                <Typography style={[
                                  styles.categoryText,
                                  {
                                    color: getNotificationColor(notification.type),
                                    fontWeight: '600'
                                  }
                                ]}>
                                  {notification.category}
                                </Typography>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                      <Typography style={styles.timestamp}>
                        {notification.timestamp}
                      </Typography>
                    </View>

                    {/* Message - FIXED: Reduced lines to make room for categories */}
                    <View style={styles.messageContainer}>
                      <Typography
                        style={styles.notificationMessage}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {notification.message}
                      </Typography>
                    </View>

                    {/* View More Details Link */}
                    <TouchableOpacity
                      style={styles.viewMoreContainer}
                      onPress={() => handleViewDetails(notification)}
                    >
                      <Typography style={styles.viewMoreText}>
                        View more details
                      </Typography>
                      <Feather name="arrow-right" size={12} color="#0c6dff" />
                    </TouchableOpacity>

                    {/* Footer */}
                    <View style={styles.cardFooter}>
                      <Typography style={styles.exactTime}>
                        {notification.timeExact}
                      </Typography>
                      <View style={styles.footerActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleMarkAsRead(notification.id)}
                        >
                          <Feather
                            name={notification.read ? "check-circle" : "circle"}
                            size={14}
                            color={notification.read ? "#10b981" : "#94a3b8"}
                          />
                          <Typography style={styles.actionText}>
                            {notification.read ? 'Read' : 'Mark as read'}
                          </Typography>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDelete(notification.id)}
                        >
                          <Feather name="trash-2" size={14} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          ) : renderEmptyState()}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // Header Container - FIXED: Simplified
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
  },
  headerBackground: {
    flex: 1,
  },
  expandedContent: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flex: 1,
    marginHorizontal: 10,
  },
  titleIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  headerBadge: {
    position: 'absolute',
    top: -8,
    right: -12,
    backgroundColor: '#ef4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#4f46e5',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  subtitleContainer: {
    alignItems: 'center',
    width: '100%',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 40,
  },
  // Collapsed Header
  collapsedContent: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  collapsedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  collapsedBackButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  collapsedTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  collapsedTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginLeft: 8,
    letterSpacing: -0.3,
  },
  collapsedAction: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerSpacer: {
    height: 240, // Increased for header + filters
  },
  // Refresh Container with Spinner
  refreshContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
  },
  refreshText: {
    color: '#0c6dff',
    fontSize: 12,
    fontWeight: '500',
  },
  // Filter Tabs - FIXED: Proper positioning
  filterContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 950,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#0c6dff',
    borderColor: '#0c6dff',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTextActive: {
    color: 'white',
  },
  filterBadge: {
    backgroundColor: '#ef4444',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Notifications Container
  notificationsContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  notificationWrapper: {
    marginBottom: 16,
  },
  // Notification Card Styles - FIXED: Better layout for categories
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    minHeight: 180, // Increased for categories
  },
  unreadCard: {
    borderLeftColor: '#0c6dff',
    borderLeftWidth: 3,
    backgroundColor: '#f8fafc',
  },
  cardIndicator: {
    width: 4,
    alignItems: 'center',
    paddingTop: 16,
  },
  indicatorBar: {
    width: 2,
    flex: 1,
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0c6dff',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    minHeight: 70, // Increased for tags
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    minHeight: 70,
  },
  typeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  titleSection: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    lineHeight: 20,
  },
  // TAGS CONTAINER - FIXED: Always visible
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 4,
  },
  priorityTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // CATEGORY TAG - FIXED: Always visible
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  timestamp: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    minWidth: 70,
    textAlign: 'right',
    marginTop: 2,
  },
  // Message Container
  messageContainer: {
    marginBottom: 12,
    minHeight: 40,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  // View More Link
  viewMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  viewMoreText: {
    fontSize: 13,
    color: '#0c6dff',
    fontWeight: '600',
    marginRight: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  exactTime: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  footerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  // Empty State
  emptyContainer: {
    paddingVertical: 40,
  },
  emptyGradient: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(12, 109, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(12, 109, 255, 0.2)',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#0c6dff',
    borderRadius: 12,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default NotificationsScreen;