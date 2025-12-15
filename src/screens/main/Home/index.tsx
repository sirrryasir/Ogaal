import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import Button from '../../../components/Button';
import BrandColors from '../../../theme';
import { useTranslation } from '../../../contexts/LanguageContext';

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

  // Mock data - in real app, fetch from API
  const nearestWells = [
    { id: 1, name: 'Well A', distance: '2.5 km', status: 'Working' },
    { id: 2, name: 'Well B', distance: '4.1 km', status: 'Low' },
    { id: 3, name: 'Well C', distance: '6.8 km', status: 'Dry' },
  ];

  const alerts: Alert[] = [
    { id: 1, message: 'Water levels dropping in nearby areas', type: 'warning' },
  ];

  const getWellStatusColor = (status: string) => {
    switch (status) {
      case 'Working': return '#28a745'; // Green
      case 'Low': return '#ffc107'; // Yellow
      case 'Dry': return '#dc3545'; // Red
      case 'Broken': return '#000000'; // Black
      default: return BrandColors.ui.foreground;
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
      <View style={styles.topBar}>
        <Typography variant="h1" style={styles.topBarTitle}>{t('homeTitle')}</Typography>
        <TouchableOpacity style={styles.topBarRight} onPress={() => navigation.navigate('Notifications' as never)}>
          <MaterialIcons name="notifications" size={24} color={BrandColors.brand.blue} />
        </TouchableOpacity>
      </View>
        <Animated.ScrollView
          style={[styles.scrollView, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          contentContainerStyle={styles.container}
        >
        <View style={styles.welcomeSection}>
          <Typography variant="h2" style={styles.welcomeTitle}>{t('welcomeTitle')}</Typography>
          <Typography variant="body" style={styles.welcomeSubtitle}>{t('welcomeSubtitle')}</Typography>
        </View>

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
                  <MaterialIcons name="location-on" size={20} color={well.status === 'Broken' ? '#000000' : BrandColors.brand.blue} style={styles.wellIcon} />
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
    paddingBottom: 20,
    alignItems: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: BrandColors.brand.blue,
    marginBottom: 5,
  },
  welcomeSubtitle: {
    color: BrandColors.ui.secondaryForeground,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 5,
    color: BrandColors.ui.foreground,
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