import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import { useTranslation } from '../../../contexts/LanguageContext';

const { width } = Dimensions.get('window');

const RegionsScreen: React.FC = () => {
  const { t } = useTranslation();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const regions: { name: string; count: number; working: number; color: string }[] = [
    { name: 'Hargeisa', count: 67, working: 52, color: '#0c6dff' },
    { name: 'Gabiley', count: 34, working: 28, color: '#10b981' },
    { name: 'Togdheer', count: 28, working: 18, color: '#f59e0b' },
    { name: 'Berbera', count: 22, working: 16, color: '#8b5cf6' },
    { name: 'Borama', count: 19, working: 12, color: '#ef4444' },
    { name: 'Baki', count: 15, working: 11, color: '#06b6d4' },
    { name: 'Erigavo', count: 12, working: 8, color: '#84cc16' },
    { name: 'Las Anod', count: 9, working: 6, color: '#f97316' },
    { name: 'Burco', count: 7, working: 4, color: '#ec4899' },
  ];

  // Calculate time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const greeting = getGreeting();

  // Header animations based on scroll
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [120, 100],
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

  useEffect(() => {
    // Initial fade animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Get location
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

  return (
    <Layout noPadding style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0c6dff" />

      {/* Collapsible Header */}
      <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
        <LinearGradient
          colors={['#0c6dff', '#4f46e5']}
          style={styles.headerGradient}
        >
          <View style={styles.headerPattern}>
            {[...Array(15)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.patternDot,
                  {
                    left: `${(i % 4) * 25}%`,
                    top: `${Math.floor(i / 4) * 33}%`,
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
            <View style={styles.pageTitleContainer}>
              <MaterialIcons name="map" size={32} color="white" />
              <Typography variant="h1" style={styles.pageTitle}>
                {t('regionsTitle')}
              </Typography>
            </View>
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
                <MaterialIcons name="map" size={24} color="white" />
                <Typography variant="h3" style={styles.collapsedTitleText}>
                  {t('regions')}
                </Typography>
              </View>
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
      >
        <View style={styles.contentSpacer} />

        {regions.map((region, index) => {
          const workingPercentage = (region.working / region.count) * 100;
          return (
            <View key={index} style={styles.regionCard}>
              <View style={[styles.regionIcon, { backgroundColor: region.color + '20', alignSelf: 'center' }]}>
                <MaterialIcons name="location-city" size={28} color={region.color} />
              </View>
              <Typography variant="h1" style={styles.regionCount}>
                {region.count}
              </Typography>
              <Typography variant="body" style={styles.regionName}>
                {region.name}
              </Typography>

              <View style={styles.workingStats}>
                <Typography variant="caption" style={styles.workingText}>
                  {t('workingSources').replace('{count}', region.working.toString())}
                </Typography>
                <Typography variant="caption" style={styles.percentageText}>
                  {Math.round(workingPercentage)}%
                </Typography>
              </View>

              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${workingPercentage}%`,
                      backgroundColor: region.color
                    }
                  ]}
                />
              </View>

              <Typography variant="caption" style={styles.regionSubtitle}>
                {t('totalWaterSources')}
              </Typography>
            </View>
          );
        })}

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
    height: 180,
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
  headerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  expandedContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
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
    justifyContent: 'center',
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '900',
    color: 'white',
    marginBottom: 5,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  location: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  pageTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    marginLeft: 12,
    letterSpacing: -0.3,
  },
  scrollView: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 0,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  contentSpacer: {
    height: 120,
  },
  regionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  regionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  regionCount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  regionName: {
    fontSize: 18,
    color: '#0f172a',
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  workingStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  workingText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  percentageText: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  regionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default RegionsScreen;