import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
  Platform,
  RefreshControl,
  TextInput,
  Modal,
  FlatList
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import { useTranslation } from '../../../contexts/LanguageContext';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  RegionDetails: { 
    regionId: string;
    regionName: string;
  };
};

interface Region {
  name: string;
  count: number;
  working: number;
  population: string;
  area: string;
  riskLevel: 'high' | 'medium' | 'low';
  id: string;
  description?: string;
  districts?: Array<{
    id: string;
    name: string;
    waterSources: number;
    workingSources: number;
  }>;
}

const RegionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Region[]>([]);

  // Enhanced Regions Data with Districts
  const regions: Region[] = [
    { 
      id: '1', 
      name: 'Hargeisa', 
      count: 67, 
      working: 52, 
      population: '1.2M', 
      area: '2,100 km²', 
      riskLevel: 'medium',
      description: 'Capital region with the highest population density',
      districts: [
        { id: '1-1', name: '26 June District', waterSources: 15, workingSources: 12 },
        { id: '1-2', name: 'Ahmed Dhagah District', waterSources: 12, workingSources: 10 },
        { id: '1-3', name: 'Ibrahim Kodbuur District', waterSources: 10, workingSources: 8 },
        { id: '1-4', name: 'Gacan Libaax District', waterSources: 8, workingSources: 6 },
      ]
    },
    { 
      id: '2', 
      name: 'Gabiley', 
      count: 34, 
      working: 28, 
      population: '750K', 
      area: '1,800 km²', 
      riskLevel: 'low',
      description: 'Agricultural region with stable water supply',
      districts: [
        { id: '2-1', name: 'Gabiley Central', waterSources: 8, workingSources: 7 },
        { id: '2-2', name: 'Boon District', waterSources: 6, workingSources: 5 },
        { id: '2-3', name: 'Jameecada District', waterSources: 5, workingSources: 4 },
      ]
    },
    { 
      id: '3', 
      name: 'Togdheer', 
      count: 28, 
      working: 18, 
      population: '850K', 
      area: '3,500 km²', 
      riskLevel: 'high',
      description: 'Drought-prone region requiring water management',
      districts: [
        { id: '3-1', name: 'Burco District', waterSources: 10, workingSources: 6 },
        { id: '3-2', name: 'Oodweyne District', waterSources: 8, workingSources: 5 },
        { id: '3-3', name: 'Burao District', waterSources: 6, workingSources: 4 },
      ]
    },
    { 
      id: '4', 
      name: 'Berbera', 
      count: 22, 
      working: 16, 
      population: '350K', 
      area: '900 km²', 
      riskLevel: 'medium',
      description: 'Coastal region with port facilities',
      districts: [
        { id: '4-1', name: 'Berbera Port District', waterSources: 8, workingSources: 6 },
        { id: '4-2', name: 'Sheikh District', waterSources: 7, workingSources: 5 },
      ]
    },
    { 
      id: '5', 
      name: 'Borama', 
      count: 19, 
      working: 12, 
      population: '420K', 
      area: '1,100 km²', 
      riskLevel: 'high',
      description: 'Mountainous region with seasonal water sources',
      districts: [
        { id: '5-1', name: 'Borama Central', waterSources: 6, workingSources: 4 },
        { id: '5-2', name: 'Dila District', waterSources: 5, workingSources: 3 },
        { id: '5-3', name: 'Quljeed District', waterSources: 4, workingSources: 2 },
      ]
    },
    { 
      id: '6', 
      name: 'Baki', 
      count: 15, 
      working: 11, 
      population: '180K', 
      area: '750 km²', 
      riskLevel: 'low',
      description: 'Small region with stable groundwater sources',
      districts: [
        { id: '6-1', name: 'Baki Central', waterSources: 5, workingSources: 4 },
        { id: '6-2', name: 'Xariradda District', waterSources: 4, workingSources: 3 },
      ]
    },
    { 
      id: '7', 
      name: 'Erigavo', 
      count: 12, 
      working: 8, 
      population: '250K', 
      area: '2,800 km²', 
      riskLevel: 'medium',
      description: 'Mountain region with natural springs',
      districts: [
        { id: '7-1', name: 'Erigavo Central', waterSources: 4, workingSources: 3 },
        { id: '7-2', name: 'Badhan District', waterSources: 3, workingSources: 2 },
        { id: '7-3', name: 'Lasqoray District', waterSources: 2, workingSources: 1 },
      ]
    },
    { 
      id: '8', 
      name: 'Las Anod', 
      count: 9, 
      working: 6, 
      population: '320K', 
      area: '1,400 km²', 
      riskLevel: 'high',
      description: 'Arid region with limited water resources',
      districts: [
        { id: '8-1', name: 'Las Anod Central', waterSources: 4, workingSources: 3 },
        { id: '8-2', name: 'Taleh District', waterSources: 3, workingSources: 2 },
      ]
    },
    { 
      id: '9', 
      name: 'Burco', 
      count: 7, 
      working: 4, 
      population: '280K', 
      area: '1,200 km²', 
      riskLevel: 'medium',
      description: 'Regional center with growing population',
      districts: [
        { id: '9-1', name: 'Burco Central', waterSources: 3, workingSources: 2 },
        { id: '9-2', name: 'Dudub District', waterSources: 2, workingSources: 1 },
      ]
    },
  ];

  // Calculate totals
  const totalSources = regions.reduce((sum, region) => sum + region.count, 0);
  const totalWorking = regions.reduce((sum, region) => sum + region.working, 0);
  const totalDistricts = regions.reduce((sum, region) => sum + (region.districts?.length || 0), 0);
  const averageWorkingPercentage = Math.round((totalWorking / totalSources) * 100);

  // Filter regions based on active filter
  const filteredRegions = () => {
    if (activeFilter === 'all') return regions;
    return regions.filter(region => region.riskLevel === activeFilter);
  };

  // Header animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [180, 100],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerTitleTranslateY = scrollY.interpolate({
    inputRange: [0, 150],
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

  const borderRadiusAnim = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [24, 0],
    extrapolate: 'clamp',
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleRegionPress = (region: Region) => {
    navigation.navigate('RegionDetails', { 
      regionId: region.id,
      regionName: region.name,
    });
  };

  const handleSearch = () => {
    setSearchModalVisible(true);
  };

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = regions.filter(region =>
        region.name.toLowerCase().includes(query.toLowerCase()) ||
        region.riskLevel.toLowerCase().includes(query.toLowerCase()) ||
        region.description?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchResultPress = (region: Region) => {
    setSearchModalVisible(false);
    setSearchQuery('');
    setSearchResults([]);
    handleRegionPress(region);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

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

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high': return t('highRisk');
      case 'medium': return t('mediumRisk');
      case 'low': return t('lowRisk');
      default: return t('unknownRisk');
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'check-circle';
      default: return 'help';
    }
  };

  // Stats data - simplified colors
  const statsData = [
    { label: t('regions'), value: regions.length.toString(), icon: 'location-city' },
    { label: t('districts'), value: totalDistricts.toString(), icon: 'map' },
    { label: t('totalSources'), value: totalSources.toString(), icon: 'water' },
    { label: t('workingRate'), value: `${averageWorkingPercentage}%`, icon: 'trending-up' },
  ];

  return (
    <Layout noPadding style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0c6dff" />

      {/* Collapsible Header */}
      <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
        <LinearGradient
          colors={['#0c6dff', '#0c6dff']}
          style={styles.headerBackground}
        >
          {/* Background Pattern */}
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
            <View style={styles.headerTopRow}>
              <View style={styles.pageTitleContainer}>
                <MaterialIcons name="map" size={32} color="white" />
                <Typography variant="h1" style={styles.pageTitle}>
                  {t('regionsTitle')}
                </Typography>
              </View>

              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Ionicons name="search-outline" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Collapsed Header Content */}
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
                <MaterialIcons name="map" size={22} color="white" />
                <Typography variant="h3" style={styles.collapsedTitleText}>
                  {t('regions')}
                </Typography>
              </View>
              <TouchableOpacity style={styles.collapsedSearchButton} onPress={handleSearch}>
                <Ionicons name="search-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Bottom Curve with Animation */}
          <Animated.View style={[
            styles.headerCurve,
            {
              borderTopLeftRadius: borderRadiusAnim,
              borderTopRightRadius: borderRadiusAnim,
            }
          ]} />
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

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsScroll}
          >
            {statsData.map((stat, index) => (
              <View
                key={index}
                style={[styles.statCard, { borderLeftColor: '#0c6dff', borderLeftWidth: 4 }]}
              >
                <View style={[styles.statIcon, { backgroundColor: '#e0f2ff' }]}>
                  <MaterialIcons name={stat.icon as any} size={24} color="#0c6dff" />
                </View>
                <View style={styles.statContent}>
                  <Typography variant="h2" style={styles.statValue}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" style={styles.statLabel}>
                    {stat.label}
                  </Typography>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Overview Card */}
        <View style={styles.overviewSection}>
          <LinearGradient
            colors={['#f0f7ff', '#ffffff']}
            style={styles.overviewCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.overviewHeader}>
              <View style={styles.overviewIcon}>
                <MaterialIcons name="public" size={28} color="#0c6dff" />
              </View>
              <View style={styles.overviewText}>
                <Typography variant="h3" style={styles.overviewTitle}>
                  {t('regionsOverview')}
                </Typography>
                <Typography variant="caption" style={styles.overviewSubtitle}>
                  {t('waterSourcesByRegion')}
                </Typography>
              </View>
            </View>
            
            <View style={styles.overviewStats}>
              <View style={styles.overviewStatItem}>
                <View style={[styles.overviewStatIcon, { backgroundColor: '#e0f2ff' }]}>
                  <MaterialIcons name="location-city" size={18} color="#0c6dff" />
                </View>
                <View style={styles.overviewStatContent}>
                  <Typography variant="body" style={styles.overviewStatValue}>
                    {regions.length} Regions
                  </Typography>
                  <Typography variant="caption" style={styles.overviewStatLabel}>
                    Across Somaliland
                  </Typography>
                </View>
              </View>

              <View style={styles.overviewStatItem}>
                <View style={[styles.overviewStatIcon, { backgroundColor: '#e0f7ff' }]}>
                  <MaterialIcons name="check-circle" size={18} color="#059669" />
                </View>
                <View style={styles.overviewStatContent}>
                  <Typography variant="body" style={styles.overviewStatValue}>
                    {averageWorkingPercentage}% Working
                  </Typography>
                  <Typography variant="caption" style={styles.overviewStatLabel}>
                    Average efficiency
                  </Typography>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterSection}>
          <Typography variant="body" style={styles.filterLabel}>
            {t('filterByRiskLevel')}
          </Typography>
          
          <View style={styles.filterTabs}>
            <TouchableOpacity 
              style={[styles.filterTab, activeFilter === 'all' && styles.filterTabActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Typography variant="body" style={[styles.filterTabText, activeFilter === 'all' && styles.filterTabTextActive]}>
                {t('all')}
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterTab, activeFilter === 'high' && styles.filterTabActive]}
              onPress={() => setActiveFilter('high')}
            >
              <MaterialIcons name="warning" size={16} color={activeFilter === 'high' ? '#dc2626' : '#64748b'} />
              <Typography variant="body" style={[styles.filterTabText, activeFilter === 'high' && styles.filterTabTextActive]}>
                {t('highRisk')}
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterTab, activeFilter === 'medium' && styles.filterTabActive]}
              onPress={() => setActiveFilter('medium')}
            >
              <MaterialIcons name="info" size={16} color={activeFilter === 'medium' ? '#f59e0b' : '#64748b'} />
              <Typography variant="body" style={[styles.filterTabText, activeFilter === 'medium' && styles.filterTabTextActive]}>
                {t('mediumRisk')}
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterTab, activeFilter === 'low' && styles.filterTabActive]}
              onPress={() => setActiveFilter('low')}
            >
              <MaterialIcons name="check-circle" size={16} color={activeFilter === 'low' ? '#059669' : '#64748b'} />
              <Typography variant="body" style={[styles.filterTabText, activeFilter === 'low' && styles.filterTabTextActive]}>
                {t('lowRisk')}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* Regions List */}
        {filteredRegions().map((region, index) => {
          const workingPercentage = (region.working / region.count) * 100;
          const efficiencyColor = workingPercentage >= 80 ? '#059669' : 
                                 workingPercentage >= 50 ? '#f59e0b' : '#dc2626';
          
          return (
            <TouchableOpacity
              key={region.id}
              onPress={() => handleRegionPress(region)}
              activeOpacity={0.7}
            >
              <Animated.View 
                style={[
                  styles.regionCard,
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
                <View style={styles.regionCardHeader}>
                  <View style={styles.regionTitleContainer}>
                    <View style={[styles.regionIcon, { backgroundColor: '#e0f2ff' }]}>
                      <MaterialIcons name="location-city" size={24} color="#0c6dff" />
                    </View>
                    <View style={styles.regionTitle}>
                      <Typography variant="h3" style={styles.regionName}>
                        {region.name}
                      </Typography>
                      <Typography variant="caption" style={styles.regionDescription}>
                        {region.description}
                      </Typography>
                    </View>
                  </View>

                  <View style={[styles.riskBadge, { backgroundColor: getRiskLevelColor(region.riskLevel) + '15' }]}>
                    <MaterialIcons name={getRiskLevelIcon(region.riskLevel) as any} size={14} color={getRiskLevelColor(region.riskLevel)} />
                    <Typography variant="caption" style={[styles.riskText, { color: getRiskLevelColor(region.riskLevel) }]}>
                      {getRiskLevelText(region.riskLevel)}
                    </Typography>
                  </View>
                </View>

                {/* Stats Section */}
                <View style={styles.regionStats}>
                  <View style={styles.regionStatItem}>
                    <Typography variant="h1" style={[styles.regionCount, { color: '#0c6dff' }]}>
                      {region.count}
                    </Typography>
                    <Typography variant="caption" style={styles.regionStatLabel}>
                      {t('totalSources')}
                    </Typography>
                  </View>

                  <View style={styles.regionStatDivider} />

                  <View style={styles.regionStatItem}>
                    <Typography variant="h1" style={[styles.regionCount, { color: efficiencyColor }]}>
                      {region.working}
                    </Typography>
                    <Typography variant="caption" style={styles.regionStatLabel}>
                      {t('working')}
                    </Typography>
                  </View>
                </View>

                {/* View Districts Button */}
                <TouchableOpacity 
                  style={[styles.viewDistrictsButton, { backgroundColor: '#e0f2ff' }]}
                  onPress={() => handleRegionPress(region)}
                >
                  <MaterialIcons name="arrow-forward" size={16} color="#0c6dff" />
                  <Typography variant="caption" style={[styles.viewDistrictsText, { color: '#0c6dff' }]}>
                    View Districts
                  </Typography>
                </TouchableOpacity>
              </Animated.View>
            </TouchableOpacity>
          );
        })}

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
              {t('searchRegions')}
            </Typography>
            <View style={styles.searchSpacer} />
          </View>

          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('searchRegionPlaceholder')}
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
                      <MaterialIcons name="location-city" size={18} color="#0c6dff" />
                      <Typography variant="caption" style={styles.searchResultTypeText}>
                        {item.name}
                      </Typography>
                    </View>
                    <View style={[styles.searchResultStatus, { backgroundColor: getRiskLevelColor(item.riskLevel) + '15' }]}>
                      <MaterialIcons name={getRiskLevelIcon(item.riskLevel) as any} size={14} color={getRiskLevelColor(item.riskLevel)} />
                      <Typography variant="caption" style={[styles.searchResultStatusText, { color: getRiskLevelColor(item.riskLevel) }]}>
                        {getRiskLevelText(item.riskLevel)}
                      </Typography>
                    </View>
                  </View>

                  {item.description && (
                    <Typography variant="caption" style={styles.searchResultDescription}>
                      {item.description}
                    </Typography>
                  )}

                  <View style={styles.searchResultStats}>
                    <View style={styles.searchResultStat}>
                      <MaterialIcons name="water" size={14} color="#64748b" />
                      <Typography variant="caption" style={styles.searchResultStatText}>
                        {item.count} {t('sources')}
                      </Typography>
                    </View>
                    <View style={styles.searchResultStat}>
                      <MaterialIcons name="trending-up" size={14} color="#64748b" />
                      <Typography variant="caption" style={styles.searchResultStatText}>
                        {Math.round((item.working / item.count) * 100)}% {t('working')}
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
                    {t('noRegionsFound')}
                  </Typography>
                  <Typography variant="body" style={styles.noResultsText}>
                    {t('tryDifferentRegionName')}
                  </Typography>
                </View>
              ) : (
                <View style={styles.searchPlaceholder}>
                  <MaterialIcons name="map" size={64} color="#e2e8f0" />
                  <Typography variant="h3" style={styles.searchPlaceholderTitle}>
                    {t('searchRegions')}
                  </Typography>
                  <Typography variant="body" style={styles.searchPlaceholderText}>
                    {t('searchRegionsHint')}
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
  // Header Container
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
  pageTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    marginLeft: 12,
    letterSpacing: -0.3,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Collapsed Header
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
  collapsedSearchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Header Curve with Animation
  headerCurve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#f8fafc',
  },
  // Scroll View
  scrollView: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 0,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  contentSpacer: {
    height: 180,
  },
  // Stats Section Below Header
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
  // Overview Section
  overviewSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  overviewCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  overviewIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e0f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(12, 109, 255, 0.2)',
  },
  overviewText: {
    flex: 1,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  overviewSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  overviewStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  overviewStatContent: {
    flex: 1,
  },
  overviewStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  overviewStatLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  // Filter Section
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTabTextActive: {
    color: '#0f172a',
    fontWeight: '700',
  },
  // Region Cards
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
  regionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  regionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  regionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  regionTitle: {
    flex: 1,
  },
  regionName: {
    fontSize: 18,
    color: '#0f172a',
    fontWeight: '700',
    marginBottom: 4,
  },
  regionDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Region Stats
  regionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  regionStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  regionCount: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  regionStatLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  regionStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  // View Districts Button
  viewDistrictsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 8,
  },
  viewDistrictsText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bottomSpacing: {
    height: 20,
  },
  // Search Modal Styles
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
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  searchResultStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  searchResultStatusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  searchResultDescription: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 16,
  },
  searchResultStats: {
    flexDirection: 'row',
    gap: 16,
  },
  searchResultStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  searchResultStatText: {
    color: '#64748b',
    fontSize: 12,
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

export default RegionsScreen;