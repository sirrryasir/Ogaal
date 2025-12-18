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
  Platform,
  Modal,
  TextInput,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
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

interface Weather {
  temperature: number;
  condition: string;
  humidity: number;
  precipitation: number;
  icon: string;
}

interface Activity {
  id: string;
  type: 'report' | 'maintenance' | 'visit' | 'alert';
  title: string;
  description: string;
  time: string;
  user: string;
  icon: string;
  color: string;
}

interface CommunityUpdate {
  id: string;
  title: string;
  description: string;
  region: string;
  time: string;
  type: 'success' | 'issue' | 'maintenance' | 'new';
  upvotes: number;
  comments: number;
}

interface MaintenanceSchedule {
  id: string;
  asset: string;
  type: 'preventive' | 'corrective' | 'emergency';
  scheduledDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
}

interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  region: string;
  progress: number;
  donorsCount: number;
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
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WaterSource[]>([]);

  // Additional state for new sections
  const [weather, setWeather] = useState<Weather>({
    temperature: 28,
    condition: 'Sunny',
    humidity: 45,
    precipitation: 10,
    icon: 'sunny'
  });

  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', type: 'report', title: 'Water Level Report', description: 'Updated borehole A1 water levels', time: '2 hours ago', user: 'Ahmed Ali', icon: 'assignment', color: '#0c6dff' },
    { id: '2', type: 'maintenance', title: 'Maintenance Completed', description: 'Pump repaired at Well B2', time: '5 hours ago', user: 'Maintenance Team', icon: 'build', color: '#10b981' },
    { id: '3', type: 'visit', title: 'Field Visit', description: 'Inspected dam water levels', time: '1 day ago', user: 'Field Officer', icon: 'location-on', color: '#f59e0b' },
    { id: '4', type: 'alert', title: 'Low Water Alert', description: 'Water levels dropping in Togdheer', time: '2 days ago', user: 'System Alert', icon: 'warning', color: '#ef4444' },
  ]);

  const [communityUpdates, setCommunityUpdates] = useState<CommunityUpdate[]>([
    { id: '1', title: 'New Well Operational', description: 'Community well now providing clean water', region: 'Gabiley', time: '1 day ago', type: 'success', upvotes: 24, comments: 8 },
    { id: '2', title: 'Water Pressure Issue', description: 'Low pressure reported in central area', region: 'Hargeisa', time: '2 days ago', type: 'issue', upvotes: 18, comments: 12 },
    { id: '3', title: 'Scheduled Maintenance', description: 'Monthly maintenance on main pipeline', region: 'Berbera', time: '3 days ago', type: 'maintenance', upvotes: 15, comments: 5 },
  ]);

  const [maintenanceSchedule, setMaintenanceSchedule] = useState<MaintenanceSchedule[]>([
    { id: '1', asset: 'Borehole Pump A1', type: 'preventive', scheduledDate: 'Tomorrow', status: 'pending', priority: 'high', assignedTo: 'Maintenance Team A' },
    { id: '2', asset: 'Water Treatment Plant', type: 'corrective', scheduledDate: 'Today', status: 'in-progress', priority: 'high', assignedTo: 'Tech Team' },
    { id: '3', asset: 'Distribution Pipeline', type: 'preventive', scheduledDate: 'In 3 days', status: 'pending', priority: 'medium', assignedTo: 'Field Team B' },
    { id: '4', asset: 'Storage Tank C2', type: 'emergency', scheduledDate: 'Overdue', status: 'overdue', priority: 'high', assignedTo: 'Emergency Team' },
  ]);

  const [donationCampaigns, setDonationCampaigns] = useState<DonationCampaign[]>([
    { id: '1', title: 'Clean Water for Rural Schools', description: 'Providing clean water access to 10 rural schools', targetAmount: 50000, currentAmount: 32000, deadline: '15 days left', region: 'All Regions', progress: 64, donorsCount: 124 },
    { id: '2', title: 'Borehole Repair Fund', description: 'Emergency fund for broken boreholes in drought areas', targetAmount: 25000, currentAmount: 18500, deadline: '7 days left', region: 'Togdheer', progress: 74, donorsCount: 89 },
    { id: '3', title: 'Water Purification Units', description: 'Installing purification systems in hospitals', targetAmount: 75000, currentAmount: 42000, deadline: '30 days left', region: 'Hargeisa', progress: 56, donorsCount: 210 },
  ]);

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

  // Header animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [200, 100],
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

  const greetingOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const greetingTranslateY = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, -15],
    extrapolate: 'clamp',
  });

  const collapsedHeaderOpacity = scrollY.interpolate({
    inputRange: [80, 120],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const collapsedHeaderTranslateY = scrollY.interpolate({
    inputRange: [80, 120],
    outputRange: [20, 0],
    extrapolate: 'clamp',
  });

  // Calculate time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 18) return t('goodAfternoon');
    return t('goodEvening');
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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
      case 'Borehole': return 'settings';
      case 'Well': return 'water';
      case 'Dam': return 'waves';
      case 'Berkad': return 'local-drink';
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

  // Helper functions for new sections
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return 'sunny';
      case 'cloudy': return 'cloud';
      case 'rainy': return 'rainy';
      case 'partly cloudy': return 'partly-cloudy-day';
      default: return 'wb-sunny';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'report': return 'assignment';
      case 'maintenance': return 'build';
      case 'visit': return 'location-on';
      case 'alert': return 'warning';
      default: return 'notifications';
    }
  };

  const getCommunityUpdateColor = (type: string) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'issue': return '#ef4444';
      case 'maintenance': return '#f59e0b';
      case 'new': return '#0c6dff';
      default: return '#6b7280';
    }
  };

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'in-progress': return '#0c6dff';
      case 'completed': return '#10b981';
      case 'overdue': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getMaintenancePriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleViewWaterSources = () => navigation.navigate('WaterSources' as never);
  const handleReportImpact = () => navigation.navigate('Report' as never);
  const handleViewAllWells = () => navigation.navigate('WaterSources' as never);
  const handleViewAllAlerts = () => navigation.navigate('Notifications' as never);
  const handleViewAllActivities = () => navigation.navigate('Activities' as never);
  const handleViewCommunityUpdates = () => navigation.navigate('Community' as never);
  const handleViewMaintenance = () => navigation.navigate('Maintenance' as never);
  const handleViewDonations = () => navigation.navigate('Donations' as never);

  const translateType = (type: string) => {
    switch (type) {
      case 'Borehole': return t('borehole');
      case 'Well': return t('well');
      case 'Dam': return t('dam');
      case 'Berkad': return t('berkad');
      default: return type;
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'Working': return t('workingStatus');
      case 'Low water': return t('lowWaterStatus');
      case 'Dry': return t('dryStatus');
      case 'Broken': return t('brokenStatus');
      default: return status;
    }
  };

  const handleSearch = () => {
    setSearchModalVisible(true);
  };

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = waterSources.filter(source =>
        source.name.toLowerCase().includes(query.toLowerCase()) ||
        source.type.toLowerCase().includes(query.toLowerCase()) ||
        source.region.toLowerCase().includes(query.toLowerCase()) ||
        source.status.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchResultPress = (source: WaterSource) => {
    setSearchModalVisible(false);
    setSearchQuery('');
    setSearchResults([]);
    navigation.navigate('WaterSources' as never);
  };

  const handleDonate = (campaignId: string) => {
    navigation.navigate('Donate' as never);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  useEffect(() => {
    setGreeting(getGreeting());
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
        { label: t('workingWells'), value: workingWells.toString(), icon: 'check-circle', color: '#10b981', change: '+2' },
        { label: t('totalSources'), value: totalWells.toString(), icon: 'water', color: '#0c6dff' },
        { label: t('lowWater'), value: lowWaterWells.toString(), icon: 'warning', color: '#f59e0b', change: '+1' },
        { label: t('avgDistance'), value: avgDistance.toFixed(1) + 'km', icon: 'location-on', color: '#8b5cf6' },
      ]);
    }
  }, [location]);

  return (
    <Layout noPadding style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0c6dff" />

      {/* Collapsible Header */}
      <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
        <LinearGradient
          colors={['#0c6dff', '#4f46e5']}
          style={styles.headerBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
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
              <View style={styles.greetingContainer}>
                <Animated.View
                  style={[
                    styles.greetingWrapper,
                    {
                      opacity: greetingOpacity,
                      transform: [{ translateY: greetingTranslateY }]
                    }
                  ]}
                >
                  <View style={styles.greetingRow}>
                    <Typography variant="h1" style={styles.greeting}>
                      {greeting}
                    </Typography>
                  </View>
                  <Typography variant="body" style={styles.location}>
                    {location ? t('currentLocation') : t('locating')}
                  </Typography>
                </Animated.View>
              </View>

              <TouchableOpacity
                style={styles.notificationButton}
                onPress={handleSearch}
              >
                <Ionicons name="search-outline" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.collapsedContent,
              {
                opacity: collapsedHeaderOpacity,
                transform: [{ translateY: collapsedHeaderTranslateY }],
                paddingTop: Platform.OS === 'ios' ? 15 : 10,
              }
            ]}
          >
            <View style={styles.collapsedBar}>
              <View style={styles.collapsedTitle}>
                <MaterialIcons name="home" size={22} color="white" />
                <Typography variant="h3" style={styles.collapsedTitleText}>
                  {t('dashboard')}
                </Typography>
              </View>
              <TouchableOpacity style={styles.collapsedNotificationButton} onPress={handleSearch}>
                <Ionicons name="search-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View style={styles.headerCurve} />
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
        <Animated.View style={[
          styles.contentSpacer,
          {
            marginTop: scrollY.interpolate({
              inputRange: [0, 120],
              outputRange: [0, 15],
              extrapolate: 'clamp',
            }),
          }
        ]} />

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsScroll}
          >
            {stats.map((stat, index) => (
              <View
                key={index}
                style={[styles.statCard, { borderLeftColor: stat.color, borderLeftWidth: 4 }]}
              >
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <MaterialIcons name={stat.icon as any} size={24} color={stat.color} />
                </View>
                <View style={styles.statContent}>
                  <Typography variant="h2" style={[styles.statValue, { color: '#0f172a' }]}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" style={[styles.statLabel, { color: '#64748b' }]}>
                    {stat.label}
                  </Typography>
                </View>
                {stat.change && (
                  <View style={[styles.statChange, { backgroundColor: stat.color + '20' }]}>
                    <Feather name="trending-up" size={12} color={stat.color} />
                    <Typography variant="caption" style={[styles.changeText, { color: stat.color }]}>
                      {stat.change}
                    </Typography>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Weather Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="cloud" size={24} color="#3b82f6" />
              <Typography variant="h3" style={styles.sectionTitle}>
                {t('weatherConditions')}
              </Typography>
            </View>
            <TouchableOpacity style={styles.weatherRefresh}>
              <MaterialIcons name="refresh" size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={['#dbeafe', '#eff6ff']}
            style={styles.weatherCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.weatherContent}>
              <View style={styles.weatherMain}>
                <MaterialIcons name={getWeatherIcon(weather.condition) as any} size={48} color="#3b82f6" />
                <View style={styles.weatherTemp}>
                  <Typography variant="h1" style={styles.temperature}>
                    {weather.temperature}°
                  </Typography>
                  <Typography variant="body" style={styles.condition}>
                    {weather.condition}
                  </Typography>
                </View>
              </View>
              <View style={styles.weatherDetails}>
                <View style={styles.weatherDetail}>
                  <MaterialIcons name="water-drop" size={16} color="#3b82f6" />
                  <Typography variant="caption" style={styles.weatherDetailText}>
                    Humidity: {weather.humidity}%
                  </Typography>
                </View>
                <View style={styles.weatherDetail}>
                  <MaterialIcons name="umbrella" size={16} color="#3b82f6" />
                  <Typography variant="caption" style={styles.weatherDetailText}>
                    Precip: {weather.precipitation}%
                  </Typography>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Nearest Wells Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="location-on" size={24} color="#0c6dff" />
              <Typography variant="h3" style={styles.sectionTitle}>
                {t('nearestWaterSources')}
              </Typography>
            </View>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={handleViewAllWells}
            >
              <Typography variant="body" style={styles.viewAllText}>
                {t('viewAll')}
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
                        {translateType(well.type)}
                      </Typography>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getWellStatusColor(well.status, well.waterLevel) + '15' }]}>
                      <Typography variant="caption" style={[styles.statusText, { color: getWellStatusColor(well.status, well.waterLevel) }]}>
                        {translateStatus(well.status)}
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
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="history" size={24} color="#8b5cf6" />
              <Typography variant="h3" style={styles.sectionTitle}>
                {t('recentActivity')}
              </Typography>
            </View>
            <TouchableOpacity
              style={[styles.viewAllButton, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}
              onPress={handleViewAllActivities}
            >
              <Typography variant="body" style={[styles.viewAllText, { color: '#8b5cf6' }]}>
                {t('viewAll')}
              </Typography>
              <MaterialIcons name="arrow-forward" size={16} color="#8b5cf6" />
            </TouchableOpacity>
          </View>

          <View style={styles.activitiesContainer}>
            {activities.map((activity, index) => (
              <Animated.View
                key={activity.id}
                style={[
                  styles.activityCard,
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
                <View style={styles.activityHeader}>
                  <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
                    <MaterialIcons name={activity.icon as any} size={18} color={activity.color} />
                  </View>
                  <View style={styles.activityContent}>
                    <Typography variant="body" style={styles.activityTitle}>
                      {activity.title}
                    </Typography>
                    <Typography variant="caption" style={styles.activityDescription}>
                      {activity.description}
                    </Typography>
                  </View>
                  <Typography variant="caption" style={styles.activityTime}>
                    {activity.time}
                  </Typography>
                </View>
                <View style={styles.activityFooter}>
                  <Typography variant="caption" style={styles.activityUser}>
                    {activity.user}
                  </Typography>
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
                {t('recentAlerts')}
              </Typography>
            </View>
            <TouchableOpacity
              style={[styles.viewAllButton, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}
              onPress={handleViewAllAlerts}
            >
              <Typography variant="body" style={[styles.viewAllText, { color: '#f59e0b' }]}>
                {t('viewAll')}
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
                      {t(alert.type)}
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

        {/* Community Updates Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="people" size={24} color="#10b981" />
              <Typography variant="h3" style={styles.sectionTitle}>
                {t('communityUpdates')}
              </Typography>
            </View>
            <TouchableOpacity
              style={[styles.viewAllButton, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}
              onPress={handleViewCommunityUpdates}
            >
              <Typography variant="body" style={[styles.viewAllText, { color: '#10b981' }]}>
                {t('viewAll')}
              </Typography>
              <MaterialIcons name="arrow-forward" size={16} color="#10b981" />
            </TouchableOpacity>
          </View>

          <View style={styles.communityGrid}>
            {communityUpdates.map((update, index) => (
              <Animated.View
                key={update.id}
                style={[
                  styles.communityCard,
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
                <View style={styles.communityHeader}>
                  <View style={[styles.communityType, { backgroundColor: getCommunityUpdateColor(update.type) + '15' }]}>
                    <Typography variant="caption" style={[styles.communityTypeText, { color: getCommunityUpdateColor(update.type) }]}>
                      {update.type.toUpperCase()}
                    </Typography>
                  </View>
                  <Typography variant="caption" style={styles.communityTime}>
                    {update.time}
                  </Typography>
                </View>
                <Typography variant="body" style={styles.communityTitle}>
                  {update.title}
                </Typography>
                <Typography variant="caption" style={styles.communityDescription}>
                  {update.description}
                </Typography>
                <View style={styles.communityFooter}>
                  <View style={styles.communityRegion}>
                    <MaterialIcons name="location-on" size={12} color="#64748b" />
                    <Typography variant="caption" style={styles.communityRegionText}>
                      {update.region}
                    </Typography>
                  </View>
                  <View style={styles.communityStats}>
                    <View style={styles.communityStat}>
                      <MaterialIcons name="thumb-up" size={12} color="#64748b" />
                      <Typography variant="caption" style={styles.communityStatText}>
                        {update.upvotes}
                      </Typography>
                    </View>
                    <View style={styles.communityStat}>
                      <MaterialIcons name="comment" size={12} color="#64748b" />
                      <Typography variant="caption" style={styles.communityStatText}>
                        {update.comments}
                      </Typography>
                    </View>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Maintenance Schedule Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="schedule" size={24} color="#f59e0b" />
              <Typography variant="h3" style={styles.sectionTitle}>
                {t('maintenanceSchedule')}
              </Typography>
            </View>
            <TouchableOpacity
              style={[styles.viewAllButton, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}
              onPress={handleViewMaintenance}
            >
              <Typography variant="body" style={[styles.viewAllText, { color: '#f59e0b' }]}>
                {t('viewAll')}
              </Typography>
              <MaterialIcons name="arrow-forward" size={16} color="#f59e0b" />
            </TouchableOpacity>
          </View>

          <View style={styles.maintenanceContainer}>
            {maintenanceSchedule.map((item, index) => (
              <Animated.View
                key={item.id}
                style={[
                  styles.maintenanceCard,
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
                <View style={styles.maintenanceHeader}>
                  <View style={styles.maintenanceAsset}>
                    <MaterialIcons name="build" size={18} color="#64748b" />
                    <Typography variant="body" style={styles.maintenanceAssetText}>
                      {item.asset}
                    </Typography>
                  </View>
                  <View style={[styles.maintenancePriority, { backgroundColor: getMaintenancePriorityColor(item.priority) + '15' }]}>
                    <Typography variant="caption" style={[styles.maintenancePriorityText, { color: getMaintenancePriorityColor(item.priority) }]}>
                      {item.priority.toUpperCase()}
                    </Typography>
                  </View>
                </View>
                <View style={styles.maintenanceDetails}>
                  <View style={styles.maintenanceDetail}>
                    <MaterialIcons name="date-range" size={14} color="#64748b" />
                    <Typography variant="caption" style={styles.maintenanceDetailText}>
                      {item.scheduledDate}
                    </Typography>
                  </View>
                  <View style={[styles.maintenanceStatus, { backgroundColor: getMaintenanceStatusColor(item.status) + '15' }]}>
                    <Typography variant="caption" style={[styles.maintenanceStatusText, { color: getMaintenanceStatusColor(item.status) }]}>
                      {item.status.toUpperCase()}
                    </Typography>
                  </View>
                </View>
                <View style={styles.maintenanceFooter}>
                  <Typography variant="caption" style={styles.maintenanceAssigned}>
                    Assigned to: {item.assignedTo}
                  </Typography>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Donation Campaigns Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="volunteer-activism" size={24} color="#ec4899" />
              <Typography variant="h3" style={styles.sectionTitle}>
                {t('donationCampaigns')}
              </Typography>
            </View>
            <TouchableOpacity
              style={[styles.viewAllButton, { backgroundColor: 'rgba(236, 72, 153, 0.1)' }]}
              onPress={handleViewDonations}
            >
              <Typography variant="body" style={[styles.viewAllText, { color: '#ec4899' }]}>
                {t('viewAll')}
              </Typography>
              <MaterialIcons name="arrow-forward" size={16} color="#ec4899" />
            </TouchableOpacity>
          </View>

          <View style={styles.donationsContainer}>
            {donationCampaigns.map((campaign, index) => (
              <Animated.View
                key={campaign.id}
                style={[
                  styles.donationCard,
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
                <View style={styles.donationHeader}>
                  <Typography variant="body" style={styles.donationTitle}>
                    {campaign.title}
                  </Typography>
                  <Typography variant="caption" style={styles.donationDeadline}>
                    {campaign.deadline}
                  </Typography>
                </View>
                <Typography variant="caption" style={styles.donationDescription}>
                  {campaign.description}
                </Typography>
                <View style={styles.donationProgress}>
                  <View style={styles.progressBar}>
                    <View style={[
                      styles.progressFill,
                      { width: `${campaign.progress}%`, backgroundColor: '#0c6dff' }
                    ]} />
                  </View>
                  <View style={styles.donationProgressInfo}>
                    <Typography variant="caption" style={styles.donationProgressText}>
                      ${campaign.currentAmount.toLocaleString()} raised of ${campaign.targetAmount.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" style={styles.donationProgressPercent}>
                      {campaign.progress}%
                    </Typography>
                  </View>
                </View>
                <View style={styles.donationFooter}>
                  <View style={styles.donationStats}>
                    <MaterialIcons name="people" size={12} color="#64748b" />
                    <Typography variant="caption" style={styles.donationStatText}>
                      {campaign.donorsCount} donors
                    </Typography>
                  </View>
                  <TouchableOpacity
                    style={styles.donateButton}
                    onPress={() => handleDonate(campaign.id)}
                  >
                    <MaterialIcons name="favorite" size={14} color="white" />
                    <Typography variant="caption" style={styles.donateButtonText}>
                      Donate
                    </Typography>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Typography variant="h3" style={styles.actionsTitle}>
            {t('quickActions')}
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
                  {t('viewMap')}
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
                  {t('reportIssues')}
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

      {/* Search Modal */}
      <Modal
        visible={searchModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View style={styles.searchModalContainer}>
          <View style={styles.searchHeader}>
            <TouchableOpacity
              style={styles.searchBackButton}
              onPress={() => setSearchModalVisible(false)}
            >
              <Ionicons name="arrow-back" size={24} color="#0f172a" />
            </TouchableOpacity>
            <Typography variant="h3" style={styles.searchTitle}>
              {t('searchWaterSources')}
            </Typography>
            <View style={styles.searchSpacer} />
          </View>

          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('searchPlaceholder')}
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={handleSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
              >
                <Ionicons name="close-circle" size={20} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.searchResultItem}
                onPress={() => handleSearchResultPress(item)}
              >
                <View style={styles.searchResultContent}>
                  <View style={styles.searchResultHeader}>
                    <View style={styles.searchResultType}>
                      <MaterialIcons
                        name={getWellIcon(item.type) as any}
                        size={18}
                        color={getWellStatusColor(item.status, item.waterLevel)}
                      />
                      <Typography variant="caption" style={styles.searchResultTypeText}>
                        {translateType(item.type)}
                      </Typography>
                    </View>
                    <View style={[styles.searchResultStatus, { backgroundColor: getWellStatusColor(item.status, item.waterLevel) + '15' }]}>
                      <Typography variant="caption" style={[styles.searchResultStatusText, { color: getWellStatusColor(item.status, item.waterLevel) }]}>
                        {translateStatus(item.status)}
                      </Typography>
                    </View>
                  </View>

                  <Typography variant="body" style={styles.searchResultName}>
                    {item.name}
                  </Typography>

                  <View style={styles.searchResultDetails}>
                    <View style={styles.searchResultDetail}>
                      <MaterialIcons name="location-on" size={14} color="#64748b" />
                      <Typography variant="caption" style={styles.searchResultDetailText}>
                        {item.region}
                      </Typography>
                    </View>
                    <View style={styles.searchResultDetail}>
                      <MaterialIcons name="update" size={14} color="#64748b" />
                      <Typography variant="caption" style={styles.searchResultDetailText}>
                        {item.lastUpdate}
                      </Typography>
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#64748b" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              searchQuery.length > 0 ? (
                <View style={styles.noResultsContainer}>
                  <Ionicons name="search" size={48} color="#e2e8f0" />
                  <Typography variant="h3" style={styles.noResultsTitle}>
                    {t('noResultsFound')}
                  </Typography>
                  <Typography variant="body" style={styles.noResultsText}>
                    {t('tryDifferentKeywords')}
                  </Typography>
                </View>
              ) : (
                <View style={styles.searchPlaceholder}>
                  <Ionicons name="water" size={64} color="#e2e8f0" />
                  <Typography variant="h3" style={styles.searchPlaceholderTitle}>
                    {t('searchPlaceholderTitle')}
                  </Typography>
                  <Typography variant="body" style={styles.searchPlaceholderText}>
                    {t('searchPlaceholderText')}
                  </Typography>
                </View>
              )
            }
            contentContainerStyle={styles.searchResultsList}
          />
        </View>
      </Modal>
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
  headerBackground: {
    flex: 1,
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
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingWrapper: {
    marginTop: 10,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -0.5,
    marginRight: 10,
  },
  greetingIcon: {
    marginTop: 2,
  },
  location: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  collapsedContent: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    height: 50,
  },
  collapsedBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 5,
  },
  collapsedTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collapsedTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginLeft: 14,
    letterSpacing: -0.3,
  },
  collapsedNotificationButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCurve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollView: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 0,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  contentSpacer: {
    height: 200,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  statsScroll: {
    paddingRight: 10,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    marginRight: 12,
    minWidth: 140,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
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
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
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
  weatherRefresh: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  weatherContent: {},
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherTemp: {
    marginLeft: 16,
  },
  temperature: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1e40af',
    letterSpacing: -1,
  },
  condition: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
  },
  weatherDetailText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
    marginLeft: 6,
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
  activitiesContainer: {},
  activityCard: {
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
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: '#64748b',
  },
  activityTime: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  activityFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  activityUser: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
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
  communityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  communityCard: {
    width: (width - 50) / 2,
    marginBottom: 16,
  },
  communityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  communityType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  communityTypeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  communityTime: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
  communityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    lineHeight: 18,
  },
  communityDescription: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 16,
  },
  communityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  communityRegion: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communityRegionText: {
    fontSize: 10,
    color: '#64748b',
    marginLeft: 4,
  },
  communityStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  communityStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communityStatText: {
    fontSize: 10,
    color: '#64748b',
    marginLeft: 2,
  },
  maintenanceContainer: {},
  maintenanceCard: {
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
  maintenanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  maintenanceAsset: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maintenanceAssetText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginLeft: 6,
  },
  maintenancePriority: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  maintenancePriorityText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  maintenanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  maintenanceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maintenanceDetailText: {
    fontSize: 11,
    color: '#64748b',
    marginLeft: 4,
  },
  maintenanceStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  maintenanceStatusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  maintenanceFooter: {},
  maintenanceAssigned: {
    fontSize: 11,
    color: '#64748b',
    fontStyle: 'italic',
  },
  donationsContainer: {},
  donationCard: {
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
  donationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  donationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  donationDeadline: {
    fontSize: 11,
    color: '#ef4444',
    fontWeight: '600',
  },
  donationDescription: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 16,
  },
  donationProgress: {
    marginBottom: 16,
  },
  donationProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  donationProgressText: {
    fontSize: 10,
    color: '#64748b',
  },
  donationProgressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0c6dff',
  },
  donationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  donationStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donationStatText: {
    fontSize: 10,
    color: '#64748b',
    marginLeft: 4,
  },
  donateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    gap: 4,
  },
  donateButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
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
  searchModalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    textAlign: 'center',
  },
  searchSpacer: {
    width: 40,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  searchResultsList: {
    padding: 20,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchResultType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchResultTypeText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  searchResultStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  searchResultStatusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    lineHeight: 22,
  },
  searchResultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchResultDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchResultDetailText: {
    color: '#64748b',
    fontSize: 12,
    marginLeft: 6,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  searchPlaceholder: {
    alignItems: 'center',
    paddingTop: 80,
  },
  searchPlaceholderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 24,
    marginBottom: 8,
  },
  searchPlaceholderText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});

export default HomeScreen;