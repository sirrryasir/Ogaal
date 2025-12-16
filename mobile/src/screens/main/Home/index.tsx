import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import Button from '../../../components/Button';
import { useTranslation } from '../../../contexts/LanguageContext';
const BrandColors = require('../../../theme');

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
}

interface Alert {
  id: number;
  message: string;
  type: string;
}

const HomeScreen: React.FC = () => {
   const navigation = useNavigation();
   const { t } = useTranslation();
   const fadeAnim = useRef(new Animated.Value(0)).current;
   const slideAnim = useRef(new Animated.Value(50)).current;
   const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
   const [errorMsg, setErrorMsg] = useState<string | null>(null);
   const [nearestWells, setNearestWells] = useState<WaterSource[]>([]);

   // Mock data with coordinates for different regions in Somaliland
   const waterSources: WaterSource[] = [
     // Hargeisa/Maroodi Jeex region
     { id: '1', type: 'Borehole', name: 'Borehole A1 - Hargeisa', status: 'Working', lastUpdate: '2 hours ago', distance: '2.5 km', latitude: 9.5624, longitude: 44.0770, region: 'Maroodi Jeex' },
     { id: '2', type: 'Well', name: 'Well B2 - Hargeisa', status: 'Low water', lastUpdate: '1 day ago', distance: '3.1 km', latitude: 9.5650, longitude: 44.0800, region: 'Maroodi Jeex' },
     { id: '3', type: 'Dam', name: 'Dam C3 - Hargeisa', status: 'Dry', lastUpdate: '3 days ago', distance: '5.0 km', latitude: 9.5600, longitude: 44.0750, region: 'Maroodi Jeex' },
     { id: '4', type: 'Berkad', name: 'Berkad D4 - Hargeisa', status: 'Broken', lastUpdate: '1 week ago', distance: '1.8 km', latitude: 9.5630, longitude: 44.0780, region: 'Maroodi Jeex' },

     // Gebiley region
     { id: '5', type: 'Borehole', name: 'Borehole G1 - Gebiley', status: 'Working', lastUpdate: '4 hours ago', distance: '45 km', latitude: 9.7167, longitude: 43.6167, region: 'Gebiley' },
     { id: '6', type: 'Well', name: 'Well G2 - Gebiley', status: 'Working', lastUpdate: '6 hours ago', distance: '47 km', latitude: 9.7200, longitude: 43.6200, region: 'Gebiley' },
     { id: '7', type: 'Berkad', name: 'Berkad G3 - Gebiley', status: 'Low water', lastUpdate: '2 days ago', distance: '46 km', latitude: 9.7150, longitude: 43.6150, region: 'Gebiley' },

     // Awdal region
     { id: '8', type: 'Borehole', name: 'Borehole A1 - Borama', status: 'Working', lastUpdate: '1 hour ago', distance: '120 km', latitude: 9.9333, longitude: 43.1833, region: 'Awdal' },
     { id: '9', type: 'Well', name: 'Well A2 - Zeila', status: 'Low water', lastUpdate: '8 hours ago', distance: '180 km', latitude: 11.3500, longitude: 43.4667, region: 'Awdal' },
     { id: '10', type: 'Dam', name: 'Dam A3 - Lughaya', status: 'Dry', lastUpdate: '1 week ago', distance: '150 km', latitude: 10.6833, longitude: 43.2833, region: 'Awdal' },

     // Togdheer region
     { id: '11', type: 'Borehole', name: 'Borehole T1 - Burao', status: 'Working', lastUpdate: '3 hours ago', distance: '250 km', latitude: 9.5167, longitude: 45.5333, region: 'Togdheer' },
     { id: '12', type: 'Well', name: 'Well T2 - Burao', status: 'Working', lastUpdate: '5 hours ago', distance: '252 km', latitude: 9.5200, longitude: 45.5350, region: 'Togdheer' },
     { id: '13', type: 'Berkad', name: 'Berkad T3 - Odweyne', status: 'Low water', lastUpdate: '1 day ago', distance: '320 km', latitude: 9.4167, longitude: 45.0667, region: 'Togdheer' },
     { id: '14', type: 'Dam', name: 'Dam T4 - Buuhoodle', status: 'Dry', lastUpdate: '3 days ago', distance: '280 km', latitude: 8.9667, longitude: 45.5667, region: 'Togdheer' },
   ];

   const alerts: Alert[] = [
     { id: 1, message: 'Water levels dropping in nearby areas', type: 'warning' },
   ];

   const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
     const R = 6371; // Radius of the earth in km
     const dLat = (lat2 - lat1) * Math.PI / 180;
     const dLon = (lon2 - lon1) * Math.PI / 180;
     const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
       Math.sin(dLon/2) * Math.sin(dLon/2);
     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
     const d = R * c; // Distance in km
     return d;
   };

  const getWellStatusColor = (status: string) => {
    switch (status) {
      case 'Working': return '#28a745'; // Green
      case 'Low water': return '#ffc107'; // Yellow
      case 'Dry': return '#dc3545'; // Red
      case 'Broken': return '#000000'; // Black
      default: return '#0f172a';
    }
  };

  const getWellIcon = (type: string) => {
    switch (type) {
      case 'Borehole': return 'water';
      case 'Well': return 'water';
      case 'Dam': return 'business';
      case 'Berkad': return 'nature';
      default: return 'water';
    }
  };

  const handleViewWaterSources = () => {
    // Navigate to Water Sources Map
    navigation.navigate('WaterSources' as never);
  };

  const handleReportImpact = () => {
    // Navigate to Report Conditions
    navigation.navigate('Report' as never);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setLocation(newLocation);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      const sourcesWithDistance = waterSources.map(source => ({
        ...source,
        distance: calculateDistance(location.latitude, location.longitude, source.latitude, source.longitude).toFixed(1) + ' km'
      }));
      const sorted = sourcesWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      setNearestWells(sorted.slice(0, 3));
    }
  }, [location]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Layout noPadding>
      <LinearGradient colors={['#0c6dff', '#0056b3']} style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.titleContainer}>
              <Ionicons name="home" size={28} color="white" />
              <Typography variant="h1" style={styles.headerTitle}>{t('homeTitle')}</Typography>
            </View>
          </View>
        </View>
      </LinearGradient>
        <Animated.ScrollView
          style={[styles.scrollView, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          contentContainerStyle={styles.container}
        >
        <View style={styles.welcomeSection}>
          <View style={styles.card}>
            <View style={styles.welcomeContent}>
              <Typography variant="h2" style={styles.welcomeTitle}>{t('welcomeTitle')}</Typography>
              <Typography variant="body" style={styles.welcomeSubtitle}>{t('welcomeSubtitle')}</Typography>
            </View>
          </View>
        </View>

        {/* Hero Stats */}

        {/* Nearest Wells */}
        <View style={styles.card}>
          <LinearGradient colors={['#e6f7ff', '#ffffff']} style={styles.cardGradient}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="location-on" size={24} color={BrandColors.brand.blue} />
              <Typography variant="h3" style={styles.cardTitle}>{t('nearestWells')}</Typography>
            </View>
            {nearestWells.map((well, index) => (
              <Animated.View
                key={well.id}
                style={[
                  styles.wellItem,
                  {
                    opacity: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                    transform: [
                      {
                        translateX: slideAnim.interpolate({
                          inputRange: [0, 50],
                          outputRange: [0, 50 * (index + 1)],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.wellInfo}>
                  <MaterialIcons name={getWellIcon(well.type)} size={20} color={well.status === 'Broken' ? '#000000' : BrandColors.brand.blue} style={styles.wellIcon} />
                  <View>
                    <Typography variant="body" style={styles.wellName}>{well.name}</Typography>
                    <Typography variant="caption" style={styles.wellDistance}>{well.distance}</Typography>
                  </View>
                </View>
                <View style={[styles.statusIndicator, { backgroundColor: getWellStatusColor(well.status) }]}>
                  <Typography variant="caption" color="primaryForeground">{well.status}</Typography>
                </View>
              </Animated.View>
            ))}
          </LinearGradient>
        </View>

        {/* Water Status Alerts */}
        <View style={styles.card}>
          <LinearGradient colors={['#fff5e6', '#ffffff']} style={styles.cardGradient}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="warning" size={24} color={BrandColors.brand.blue} />
              <Typography variant="h3" style={styles.cardTitle}>{t('waterStatusAlerts')}</Typography>
            </View>
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <Animated.View
                  key={alert.id}
                  style={[
                    styles.alertItem,
                    {
                      opacity: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                      transform: [
                        {
                          translateX: slideAnim.interpolate({
                            inputRange: [0, 50],
                            outputRange: [0, 50 * (index + 1)],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <MaterialIcons
                    name={alert.type === 'warning' ? 'warning' : 'info'}
                    size={20}
                    color={alert.type === 'warning' ? BrandColors.brand.warning : BrandColors.brand.blue}
                  />
                  <Typography variant="body" style={styles.alertText}>{alert.message}</Typography>
                </Animated.View>
              ))
            ) : (
              <Typography variant="body" style={styles.noAlerts}>{t('noActiveAlerts')}</Typography>
            )}
          </LinearGradient>
        </View>

        {/* Map Shortcut */}
        <View style={styles.card}>
          <LinearGradient colors={['#007bff', '#0056b3']} style={styles.buttonGradient}>
            <TouchableOpacity style={styles.buttonTouchable} onPress={handleViewWaterSources}>
              <MaterialIcons name="map" size={24} color="white" />
              <Typography variant="body" style={styles.buttonText}>{t('viewWaterSourcesMap')}</Typography>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Report Shortcut */}
        <View style={[styles.card, { marginBottom: 0 }]}>
          <LinearGradient colors={['#ff8c00', '#e67e00']} style={styles.buttonGradient}>
            <TouchableOpacity style={styles.buttonTouchable} onPress={handleReportImpact}>
              <MaterialIcons name="report" size={24} color="white" />
              <Typography variant="body" style={styles.buttonText}>{t('reportConditions')}</Typography>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        </Animated.ScrollView>
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
    paddingBottom: 20,
    alignItems: 'center',
  },
  welcomeSection: {
    width: '100%',
    marginBottom: 20,
  },
  welcomeGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  welcomeContent: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BrandColors.brand.blue,
    marginBottom: 5,
  },
  welcomeSubtitle: {
    color: BrandColors.ui.secondaryForeground,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardGradient: {
    borderRadius: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: BrandColors.brand.blue,
  },
  heroStats: {
    width: '100%',
    marginBottom: 20,
  },
  heroGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  heroContent: {
    padding: 20,
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: BrandColors.brand.blue,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: BrandColors.ui.secondaryForeground,
    textTransform: 'uppercase',
  },
  wellItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.ui.border,
  },
  wellInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  wellIcon: {
    marginRight: 10,
  },
  wellName: {
    fontWeight: 'bold',
  },
  wellDistance: {
    color: BrandColors.ui.secondaryForeground,
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  alertText: {
    marginLeft: 10,
    flex: 1,
  },
  noAlerts: {
    color: BrandColors.ui.secondaryForeground,
    fontStyle: 'italic',
  },
  buttonGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  buttonTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: BrandColors.brand.blue,
  },
  sectionDesc: {
    color: BrandColors.ui.foreground,
    marginBottom: 20,
    lineHeight: 22,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: BrandColors.app.bodyBackground,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    marginBottom: 10,
  },
  actionCardTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  actionCardDesc: {
    textAlign: 'center',
    color: BrandColors.ui.secondaryForeground,
  },
});

export default HomeScreen;