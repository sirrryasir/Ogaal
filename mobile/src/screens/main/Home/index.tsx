import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  RefreshControl,
  StatusBar,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import Button from '../../../components/Button';
import { useTranslation } from '../../../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

interface WaterSource {
  id: string;
  type: 'Borehole' | 'Well' | 'Berkad' | 'Dam';
  name: string;
  status: 'Working' | 'Low water' | 'Dry' | 'Broken';
  lastUpdate: string;
  distance?: string;
  latitude: number;
  longitude: number;
  region: string;
  waterLevel?: number;
}

interface Alert {
  id: number;
  message: string;
  type: 'warning' | 'info' | 'critical';
  time: string;
}

interface StatItem {
  label: string;
  value: string;
  icon: string;
  color: string;
  change?: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  // Animation values for collapsible header
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // State
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearestWells, setNearestWells] = useState<WaterSource[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [greeting, setGreeting] = useState('');

  // Mock data
  const waterSources: WaterSource[] = [
    { id: '1', type: 'Borehole', name: 'Borehole A1 - Hargeisa', status: 'Working', lastUpdate: '2 hours ago', distance: '2.5 km', latitude: 9.5624, longitude: 44.0770, region: 'Maroodi Jeex', waterLevel: 85 },
    { id: '2', type: 'Well', name: 'Well B2 - Hargeisa', status: 'Low water', lastUpdate: '1 day ago', distance: '3.1 km', latitude: 9.5650, longitude: 44.0800, region: 'Maroodi Jeex', waterLevel: 25 },
    { id: '3', type: 'Dam', name: 'Dam C3 - Hargeisa', status: 'Dry', lastUpdate: '3 days ago', distance: '5.0 km', latitude: 9.5600, longitude: 44.0750, region: 'Maroodi Jeex', waterLevel: 5 },
    { id: '4', type: 'Berkad', name: 'Berkad D4 - Hargeisa', status: 'Broken', lastUpdate: '1 week ago', distance: '1.8 km', latitude: 9.5630, longitude: 44.0780, region: 'Maroodi Jeex', waterLevel: 0 },
    { id: '5', type: 'Borehole', name: 'Borehole G1 - Gebiley', status: 'Working', lastUpdate: '4 hours ago', distance: '45 km', latitude: 9.7167, longitude: 43.6167, region: 'Gebiley', waterLevel: 90 },
    { id: '6', type: 'Well', name: 'Well G2 - Gebiley', status: 'Working', lastUpdate: '6 hours ago', distance: '47 km', latitude: 9.7200, longitude: 43.6200, region: 'Gebiley', waterLevel: 70 },
  ];

  const alerts: Alert[] = [
    { id: 1, message: 'Water levels dropping in nearby areas', type: 'warning', time: '2 hours ago' },
    { id: 2, message: 'New well added in your region', type: 'info', time: '5 hours ago' },
    { id: 3, message: 'Emergency repair in progress', type: 'critical', time: '1 day ago' },
  ];

  // Header animations based on scroll
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [280, 100],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerTitleTranslateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  const statsOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const statsTranslateY = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -30],
    extrapolate: 'clamp',
  });

  const collapsedHeaderOpacity = scrollY.interpolate({
    inputRange: [100, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const collapsedHeaderTranslateY = scrollY.interpolate({
    inputRange: [100, 150],
    outputRange: [20, 0],
    extrapolate: 'clamp',
  });

  // Calculate time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getWellStatusColor = (status: string, waterLevel?: number) => {
    switch (status) {
      case 'Working': return '#10b981';
      case 'Low water': return '#f59e0b';
      case 'Dry': return '#ef4444';
      case 'Broken': return '#6b7280';
      default: return '#0c6dff';
    }
  };

  const getWellIcon = (type: string) => {
    switch (type) {
      case 'Borehole': return 'water-pump';
      case 'Well': return 'water';
      case 'Dam': return 'dam';
      case 'Berkad': return 'water-tank';
      default: return 'water';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'critical': return 'error';
      default: return 'notifications';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return '#f59e0b';
      case 'info': return '#0c6dff';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleViewWaterSources = () => navigation.navigate('WaterSources' as never);
  const handleReportImpact = () => navigation.navigate('Report' as never);
  const handleViewAllWells = () => navigation.navigate('WaterSources' as never);
  const handleViewAllAlerts = () => navigation.navigate('Alerts' as never);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  useEffect(() => {
    setGreeting(getGreeting());
    
    // Initial fade animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          // Use default location
          setLocation({ latitude: 9.5624, longitude: 44.0770 });
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.log('Location error:', error);
        setLocation({ latitude: 9.5624, longitude: 44.0770 });
      }
    })();
  }, []);

  useEffect(() => {
    if (location) {
      const sourcesWithDistance = waterSources.map(source => ({
        ...source,
        distance: calculateDistance(
          location.latitude, 
          location.longitude, 
          source.latitude, 
          source.longitude
        ).toFixed(1) + ' km'
      }));
      
      const sorted = sourcesWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      setNearestWells(sorted.slice(0, 4));

      const workingWells = waterSources.filter(w => w.status === 'Working').length;
      const totalWells = waterSources.length;
      const lowWaterWells = waterSources.filter(w => w.status === 'Low water').length;
      const avgDistance = sorted.slice(0, 5).reduce((acc, w) => acc + parseFloat(w.distance), 0) / 5;

      setStats([
        { label: 'Working Wells', value: workingWells.toString(), icon: 'check-circle', color: '#10b981', change: '+2' },
        { label: 'Total Sources', value: totalWells.toString(), icon: 'water', color: '#0c6dff' },
        { label: 'Low Water', value: lowWaterWells.toString(), icon: 'warning', color: '#f59e0b', change: '+1' },
        { label: 'Avg. Distance', value: avgDistance.toFixed(1) + 'km', icon: 'location-on', color: '#8b5cf6' },
      ]);
    }
  }, [location]);

  return (
    <Layout noPadding style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0c6dff" />
      
      {/* Collapsible Header */}
      <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
        <LinearGradient 
          colors={['#0c6dff', '#4f46e5', '#8b5cf6']} 
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Background Pattern */}
          <View style={styles.headerPattern}>
            {[...Array(20)].map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.patternDot,
                  {
                    left: `${(i % 5) * 20}%`,
                    top: `${Math.floor(i / 5) * 25}%`,
                    opacity: 0.05 + (i % 3) * 0.02,
                    transform: [{ scale: 1 + (i % 2) * 0.5 }]
                  }
                ]} 
              />
            ))}
          </View>

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
            <View style={styles.topBar}>
              <View style={styles.greetingContainer}>
                <Typography variant="h1" style={styles.greeting}>
                  {greeting} 👋
                </Typography>
                <Typography variant="body" style={styles.location}>
                  {location ? 'Hargeisa, Somaliland' : 'Locating...'}
                </Typography>
              </View>
              
              <TouchableOpacity 
                style={styles.notificationButton}
                onPress={() => navigation.navigate('Notifications' as never)}
              >
                <Ionicons name="notifications-outline" size={24} color="white" />
                {alerts.length > 0 && (
                  <View style={styles.notificationBadge}>
                    <Typography variant="caption" style={styles.badgeText}>
                      {alerts.length}
                    </Typography>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <Animated.View 
              style={[
                styles.statsContainer,
                {
                  opacity: statsOpacity,
                  transform: [{ translateY: statsTranslateY }]
                }
              ]}
            >
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.statsScroll}
              >
                {stats.map((stat, index) => (
                  <View key={index} style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: stat.color + '30' }]}>
                      <MaterialIcons name={stat.icon as any} size={22} color={stat.color} />
                    </View>
                    <View style={styles.statContent}>
                      <Typography variant="h2" style={styles.statValue}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" style={styles.statLabel}>
                        {stat.label}
                      </Typography>
                    </View>
                    {stat.change && (
                      <View style={styles.statChange}>
                        <Feather name="trending-up" size={12} color="white" />
                        <Typography variant="caption" style={styles.changeText}>
                          {stat.change}
                        </Typography>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
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
              <View style={styles.collapsedTitle}>
                <MaterialIcons name="home" size={24} color="white" />
                <Typography variant="h3" style={styles.collapsedTitleText}>
                  Dashboard
                </Typography>
              </View>
              <TouchableOpacity style={styles.collapsedNotificationButton}>
                <Ionicons name="notifications-outline" size={22} color="white" />
                {alerts.length > 0 && (
                  <View style={styles.collapsedNotificationBadge}>
                    <Typography variant="caption" style={styles.badgeText}>
                      {alerts.length}
                    </Typography>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
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
            onRefresh={onRefresh}
            tintColor="#0c6dff"
            colors={['#0c6dff']}
            progressBackgroundColor="#ffffff"
          />
        }
      >
        {/* Content starts below header */}
        <View style={styles.contentSpacer} />
        
        {/* Nearest Wells Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="location-on" size={24} color="#0c6dff" />
              <Typography variant="h3" style={styles.sectionTitle}>
                Nearest Water Sources
              </Typography>
            </View>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={handleViewAllWells}
            >
              <Typography variant="body" style={styles.viewAllText}>
                View All
              </Typography>
              <MaterialIcons name="arrow-forward" size={16} color="#0c6dff" />
            </TouchableOpacity>
          </View>

          <View style={styles.wellsGrid}>
            {nearestWells.map((well, index) => (
              <Animated.View
                key={well.id}
                style={[
                  styles.wellCard,
                  {
                    opacity: fadeAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 0.5, 1]
                    }),
                    transform: [
                      {
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0]
                        })
                      }
                    ]
                  }
                ]}
              >
                <View style={styles.wellCardContent}>
                  <View style={styles.wellCardHeader}>
                    <View style={styles.wellType}>
                      <MaterialIcons 
                        name={getWellIcon(well.type) as any} 
                        size={20} 
                        color={getWellStatusColor(well.status, well.waterLevel)} 
                      />
                      <Typography variant="caption" style={styles.wellTypeText}>
                        {well.type}
                      </Typography>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getWellStatusColor(well.status, well.waterLevel) + '15' }]}>
                      <Typography variant="caption" style={[styles.statusText, { color: getWellStatusColor(well.status, well.waterLevel) }]}>
                        {well.status}
                      </Typography>
                    </View>
                  </View>

                  <Typography variant="body" style={styles.wellName}>
                    {well.name}
                  </Typography>
                  
                  <View style={styles.wellDetails}>
                    <View style={styles.detailItem}>
                      <MaterialIcons name="location-on" size={14} color="#64748b" />
                      <Typography variant="caption" style={styles.detailText}>
                        {well.distance}
                      </Typography>
                    </View>
                    <View style={styles.detailItem}>
                      <MaterialIcons name="update" size={14} color="#64748b" />
                      <Typography variant="caption" style={styles.detailText}>
                        {well.lastUpdate}
                      </Typography>
                    </View>
                  </View>

                  {well.waterLevel !== undefined && (
                    <View style={styles.waterLevelContainer}>
                      <View style={styles.waterLevelLabel}>
                        <Typography variant="caption" style={styles.waterLevelText}>
                          Water Level
                        </Typography>
                        <Typography variant="caption" style={styles.waterLevelPercent}>
                          {well.waterLevel}%
                        </Typography>
                      </View>
                      <View style={styles.progressBar}>
                        <Animated.View 
                          style={[
                            styles.progressFill,
                            { 
                              width: `${well.waterLevel}%`,
                              backgroundColor: getWellStatusColor(well.status, well.waterLevel)
                            }
                          ]}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Alerts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="notifications" size={24} color="#f59e0b" />
              <Typography variant="h3" style={styles.sectionTitle}>
                Recent Alerts
              </Typography>
            </View>
            <TouchableOpacity 
              style={[styles.viewAllButton, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}
              onPress={handleViewAllAlerts}
            >
              <Typography variant="body" style={[styles.viewAllText, { color: '#f59e0b' }]}>
                View All
              </Typography>
              <MaterialIcons name="arrow-forward" size={16} color="#f59e0b" />
            </TouchableOpacity>
          </View>

          <View style={styles.alertsContainer}>
            {alerts.map((alert, index) => (
              <Animated.View
                key={alert.id}
                style={[
                  styles.alertCard,
                  {
                    opacity: fadeAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 0.5, 1]
                    }),
                    transform: [
                      {
                        translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0]
                        })
                      }
                    ]
                  }
                ]}
              >
                <View style={styles.alertHeader}>
                  <View style={styles.alertType}>
                    <MaterialIcons 
                      name={getAlertIcon(alert.type) as any} 
                      size={20} 
                      color={getAlertColor(alert.type)} 
                    />
                    <Typography variant="caption" style={[styles.alertTypeText, { color: getAlertColor(alert.type) }]}>
                      {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                    </Typography>
                  </View>
                  <Typography variant="caption" style={styles.alertTime}>
                    {alert.time}
                  </Typography>
                </View>
                <Typography variant="body" style={styles.alertMessage}>
                  {alert.message}
                </Typography>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Typography variant="h3" style={styles.actionsTitle}>
            Quick Actions
          </Typography>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleViewWaterSources}
            >
              <LinearGradient
                colors={['#0c6dff', '#4f46e5']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons name="map" size={32} color="white" />
                <Typography variant="body" style={styles.actionText}>
                  View Map
                </Typography>
                <View style={styles.actionArrow}>
                  <MaterialIcons name="arrow-forward" size={20} color="white" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleReportImpact}
            >
              <LinearGradient
                colors={['#f59e0b', '#d97706']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons name="report" size={32} color="white" />
                <Typography variant="body" style={styles.actionText}>
                  Report Issues
                </Typography>
                <View style={styles.actionArrow}>
                  <MaterialIcons name="arrow-forward" size={20} color="white" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  headerPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  patternDot: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  expandedContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '900',
    color: 'white',
    marginBottom: 5,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  location: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 5,
  },
  notificationBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#ef4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4f46e5',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginTop: 5,
  },
  statsScroll: {
    paddingRight: 10,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
    padding: 16,
    marginRight: 12,
    minWidth: 140,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  statChange: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 8,
  },
  changeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  collapsedContent: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  collapsedBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  collapsedTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collapsedTitleText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginLeft: 10,
    letterSpacing: -0.3,
  },
  collapsedNotificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  collapsedNotificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4f46e5',
  },
  scrollView: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 0,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  contentSpacer: {
    height: 280, // Matches initial header height
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginLeft: 10,
    letterSpacing: -0.3,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(12, 109, 255, 0.1)',
    borderRadius: 20,
  },
  viewAllText: {
    color: '#0c6dff',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  },
  wellsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wellCard: {
    width: (width - 50) / 2,
    marginBottom: 16,
  },
  wellCardContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  wellCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  wellType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wellTypeText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  wellName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
    lineHeight: 22,
  },
  wellDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#64748b',
    fontSize: 12,
    marginLeft: 6,
  },
  waterLevelContainer: {
    marginTop: 8,
  },
  waterLevelLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  waterLevelText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
  waterLevelPercent: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '700',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  alertsContainer: {},
  alertCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTypeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  alertTime: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
  },
  alertMessage: {
    fontSize: 14,
    color: '#0f172a',
    lineHeight: 20,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 50) / 2,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  actionGradient: {
    height: 130,
    padding: 20,
    justifyContent: 'space-between',
    borderRadius: 20,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  actionArrow: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default HomeScreen;