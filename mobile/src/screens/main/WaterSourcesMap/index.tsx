import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Alert, Platform, ScrollView,
  Dimensions, RefreshControl, Animated, TextInput, Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import { useTranslation } from '../../../contexts/LanguageContext';

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
  flowRate?: string;
  waterQuality?: string;
  capacity?: string;
  community?: string;
  contact?: string;
  notes?: string;
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_EXPANDED_HEIGHT = 220;
const HEADER_COLLAPSED_HEIGHT = 100;

const WaterSourcesMapScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<WaterSource | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [region] = useState({
    latitude: 9.5624,
    longitude: 44.0770,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [mapKey, setMapKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const webViewRef = useRef<WebView | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Animated values for better transitions
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  // Enhanced water sources data
  const [waterSources, setWaterSources] = useState<WaterSource[]>([
    { 
      id: '1', 
      type: 'Borehole', 
      name: 'Hargeisa Central Borehole', 
      status: 'Working', 
      lastUpdate: '2 hours ago', 
      distance: '2.5 km', 
      latitude: 9.5624, 
      longitude: 44.0770, 
      region: 'Maroodi Jeex', 
      flowRate: '500 L/min', 
      waterQuality: 'Excellent',
      capacity: '5000 L/hr',
      community: 'Hargeisa Central',
      contact: '+252 63 1234567',
      notes: 'Operational 24/7, clean drinking water available for community'
    },
    { 
      id: '2', 
      type: 'Well', 
      name: 'North Hargeisa Well', 
      status: 'Low water', 
      lastUpdate: '1 day ago', 
      distance: '3.1 km', 
      latitude: 9.5650, 
      longitude: 44.0800, 
      region: 'Maroodi Jeex', 
      flowRate: '150 L/min', 
      waterQuality: 'Good',
      capacity: '2000 L/hr',
      community: 'Hargeisa North',
      contact: '+252 63 2345678',
      notes: 'Community maintained, reduced flow during dry season'
    },
    { 
      id: '3', 
      type: 'Dam', 
      name: 'East Hargeisa Dam', 
      status: 'Dry', 
      lastUpdate: '3 days ago', 
      distance: '5.0 km', 
      latitude: 9.5600, 
      longitude: 44.0750, 
      region: 'Maroodi Jeex', 
      flowRate: '0 L/min', 
      waterQuality: 'Poor',
      capacity: '0 L/hr',
      community: 'Hargeisa East',
      contact: '+252 63 3456789',
      notes: 'Seasonal water source, waiting for rainfall'
    },
    { 
      id: '4', 
      type: 'Berkad', 
      name: 'West Hargeisa Berkad', 
      status: 'Broken', 
      lastUpdate: '1 week ago', 
      distance: '1.8 km', 
      latitude: 9.5630, 
      longitude: 44.0780, 
      region: 'Maroodi Jeex', 
      flowRate: '0 L/min', 
      waterQuality: 'Unknown',
      capacity: '0 L/hr',
      community: 'Hargeisa West',
      contact: '+252 63 4567890',
      notes: 'Requires community maintenance, structure damaged'
    },
    { 
      id: '5', 
      type: 'Borehole', 
      name: 'South Hargeisa Borehole', 
      status: 'Working', 
      lastUpdate: '5 hours ago', 
      distance: '4.2 km', 
      latitude: 9.5700, 
      longitude: 44.0850, 
      region: 'Maroodi Jeex', 
      flowRate: '400 L/min', 
      waterQuality: 'Excellent',
      capacity: '4500 L/hr',
      community: 'Hargeisa South',
      contact: '+252 63 5678901',
      notes: 'New installation funded by community, high yield source'
    },
    { 
      id: '6', 
      type: 'Well', 
      name: 'Suburban Community Well', 
      status: 'Low water', 
      lastUpdate: '2 days ago', 
      distance: '6.3 km', 
      latitude: 9.5550, 
      longitude: 44.0700, 
      region: 'Maroodi Jeex', 
      flowRate: '100 L/min', 
      waterQuality: 'Moderate',
      capacity: '1500 L/hr',
      community: 'Hargeisa Suburbs',
      contact: '+252 63 6789012',
      notes: 'Community managed, seasonal variation expected'
    },
  ]);

  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [location]);

  const requestLocationPermission = useCallback(async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLocation({ latitude: 9.5624, longitude: 44.0770 });
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      };
      setLocation(newLocation);
    } catch (error) {
      setErrorMsg('Failed to get location');
      setLocation({ latitude: 9.5624, longitude: 44.0770 });
    }
  }, []);

  // Color utilities
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Working': return '#10B981'; // Green
      case 'Low water': return '#F59E0B'; // Yellow
      case 'Dry': return '#EF4444'; // Red
      case 'Broken': return '#64748B'; // Gray
      default: return '#6B7280';
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'Working': return '#D1FAE5';
      case 'Low water': return '#FEF3C7';
      case 'Dry': return '#FEE2E2';
      case 'Broken': return '#E5E7EB';
      default: return '#F3F4F6';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Borehole': return 'water';
      case 'Well': return 'water-outline';
      case 'Dam': return 'business';
      case 'Berkad': return 'leaf';
      default: return 'water';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Borehole': return '#0c6dff';
      case 'Well': return '#059669';
      case 'Dam': return '#8b5cf6';
      case 'Berkad': return '#f59e0b';
      default: return '#64748B';
    }
  };

  const getTranslatedStatus = (status: string) => {
    switch (status) {
      case 'Working': return 'Working';
      case 'Low water': return 'Low Water';
      case 'Dry': return 'Dry';
      case 'Broken': return 'Broken';
      default: return status;
    }
  };

  // Filter and search logic
  const filteredSources = waterSources.filter(source => {
    if (activeFilter !== 'all' && source.status.toLowerCase().replace(' ', '') !== activeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        source.name.toLowerCase().includes(query) ||
        source.community?.toLowerCase().includes(query) ||
        source.region.toLowerCase().includes(query) ||
        source.type.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await requestLocationPermission();
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Updated', 'Water sources data has been refreshed');
    }, 1000);
  }, [requestLocationPermission]);

  const handleSourceSelect = (source: WaterSource) => {
    setSelectedSource(source);
    setShowDetailsModal(true);
  };

  const handleGetDirections = async (source: WaterSource) => {
    if (!location) {
      Alert.alert(
        'Location Required',
        'Please enable location services to get directions',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable', onPress: requestLocationPermission }
        ]
      );
      return;
    }
    const js = `addRoute(${location.latitude}, ${location.longitude}, ${source.latitude}, ${source.longitude});`;
    webViewRef.current?.injectJavaScript(js);
  };

  const handleMapReady = () => {
    setMapReady(true);
  };

  const handleCenterToUser = () => {
    if (location) {
      const js = `map.setView([${location.latitude}, ${location.longitude}], 15);`;
      webViewRef.current?.injectJavaScript(js);
    }
  };

  // Statistics calculation
  const stats = {
    total: filteredSources.length,
    working: filteredSources.filter(s => s.status === 'Working').length,
    lowWater: filteredSources.filter(s => s.status === 'Low water').length,
    dry: filteredSources.filter(s => s.status === 'Dry').length,
    broken: filteredSources.filter(s => s.status === 'Broken').length,
  };

  // ================ COMPONENT RENDERING ================

  const FilterButton = ({ filter, label, icon }: { filter: string; label: string; icon: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && styles.filterButtonActive,
        activeFilter === filter && { backgroundColor: getStatusColor(label) + '20' }
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <View style={[
        styles.filterIconContainer,
        { backgroundColor: activeFilter === filter ? getStatusColor(label) + '30' : '#f1f5f9' }
      ]}>
        <Ionicons 
          name={icon as any} 
          size={14} 
          color={activeFilter === filter ? getStatusColor(label) : '#64748b'} 
        />
      </View>
      <Typography variant="caption" style={[
        styles.filterButtonText,
        activeFilter === filter && { color: getStatusColor(label), fontWeight: '600' }
      ]}>
        {label}
      </Typography>
    </TouchableOpacity>
  );

  // Header Component
  const renderHeader = () => (
    <Animated.View style={[styles.headerContainer, { height: headerHeight, opacity: headerOpacity }]}>
      <LinearGradient 
        colors={['#0c6dff', '#0c6dff']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          {/* Top Row */}
          <View style={styles.headerTopRow}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={22} color="white" />
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <View style={styles.titleIcon}>
                  <Ionicons name="water" size={20} color="white" />
                </View>
                <Typography variant="h1" style={styles.headerTitle}>Water Sources</Typography>
              </View>
            </View>
            
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerAction} onPress={() => setShowSearch(!showSearch)}>
                <Ionicons name="search" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerAction} onPress={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}>
                <Ionicons name={viewMode === 'map' ? 'list' : 'map'} size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Overview */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Typography variant="h2" style={styles.statValue}>{stats.total}</Typography>
              <Typography variant="caption" style={styles.statLabel}>Total</Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Typography variant="h2" style={[styles.statValue, { color: '#10B981' }]}>{stats.working}</Typography>
              <Typography variant="caption" style={styles.statLabel}>Working</Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Typography variant="h2" style={[styles.statValue, { color: '#F59E0B' }]}>{stats.lowWater}</Typography>
              <Typography variant="caption" style={styles.statLabel}>Low Water</Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Typography variant="h2" style={[styles.statValue, { color: '#EF4444' }]}>{stats.broken + stats.dry}</Typography>
              <Typography variant="caption" style={styles.statLabel}>Needs Help</Typography>
            </View>
          </View>

          {/* Search Bar (Conditional) */}
          {showSearch && (
            <View style={styles.searchBarContainer}>
              <View style={styles.searchInputWrapper}>
                <Ionicons name="search" size={18} color="#64748b" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by name, community, or region..."
                  placeholderTextColor="#94a3b8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={18} color="#64748b" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            <FilterButton filter="all" label="All" icon="apps" />
            <FilterButton filter="working" label="Working" icon="checkmark-circle" />
            <FilterButton filter="lowwater" label="Low Water" icon="water" />
            <FilterButton filter="dry" label="Dry" icon="sunny" />
            <FilterButton filter="broken" label="Broken" icon="alert-circle" />
          </ScrollView>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // Map View Component
  const renderMapView = () => (
    <View style={styles.mapContainer}>
      {isWeb ? (
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={64} color="#cbd5e1" />
          <Typography variant="h3" style={styles.placeholderText}>Interactive Map</Typography>
          <Typography variant="body" style={styles.placeholderSubtext}>
            Map view available in mobile app
          </Typography>
        </View>
      ) : (
        <>
          <WebView
            key={`webview-${mapKey}`}
            ref={webViewRef}
            source={{ html: generateMapHTML() }}
            style={styles.map}
            onLoad={handleMapReady}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                if (data.type === 'select') {
                  const source = waterSources.find(s => s.id === data.id);
                  if (source) handleSourceSelect(source);
                } else if (data.type === 'mapReady') {
                  handleMapReady();
                }
              } catch (e) {
                console.warn('Failed to parse message', e);
              }
            }}
            javaScriptEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.mapLoading}>
                <Ionicons name="map" size={48} color="#0c6dff" />
                <Typography variant="body" style={styles.loadingText}>Loading map...</Typography>
              </View>
            )}
          />
          {mapReady && location && (
            <TouchableOpacity style={styles.centerButton} onPress={handleCenterToUser}>
              <LinearGradient colors={['#0c6dff', '#0c6dff']} style={styles.centerButtonGradient}>
                <Ionicons name="locate" size={22} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );

  // List View Component
  const renderListView = () => (
    <Animated.ScrollView
      style={[styles.listContainer, { paddingTop: HEADER_EXPANDED_HEIGHT + 60 }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
    >
      <View style={styles.listHeader}>
        <Typography variant="h2" style={styles.listTitle}>Water Sources</Typography>
        <Typography variant="caption" style={styles.listSubtitle}>
          {filteredSources.length} sources found
        </Typography>
      </View>
      
      {filteredSources.map((source) => (
        <TouchableOpacity
          key={source.id}
          style={styles.sourceCard}
          onPress={() => handleSourceSelect(source)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.typeIcon, { backgroundColor: getStatusBackgroundColor(source.status) }]}>
              <Ionicons 
                name={getTypeIcon(source.type)} 
                size={18} 
                color={getStatusColor(source.status)} 
              />
            </View>
            <View style={styles.cardContent}>
              <Typography variant="h3" style={styles.sourceName}>{source.name}</Typography>
              <View style={styles.sourceDetails}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(source.status) + '15' }]}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(source.status) }]} />
                  <Typography variant="caption" style={[styles.statusText, { color: getStatusColor(source.status) }]}>
                    {getTranslatedStatus(source.status)}
                  </Typography>
                </View>
                <Typography variant="caption" style={styles.locationText}>
                  {source.community} • {source.distance}
                </Typography>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
          </View>
          
          <View style={styles.cardFooter}>
            <View style={styles.footerItem}>
              <Ionicons name="time" size={12} color="#64748b" />
              <Typography variant="caption" style={styles.footerText}>{source.lastUpdate}</Typography>
            </View>
            <View style={styles.footerItem}>
              <Ionicons name="location" size={12} color="#64748b" />
              <Typography variant="caption" style={styles.footerText}>{source.type}</Typography>
            </View>
            <View style={styles.footerItem}>
              <Ionicons name="people" size={12} color="#64748b" />
              <Typography variant="caption" style={styles.footerText}>{source.community}</Typography>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </Animated.ScrollView>
  );

  // Details Modal Component
  const renderDetailsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showDetailsModal}
      onRequestClose={() => setShowDetailsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={() => setShowDetailsModal(false)}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>
        
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalDragHandle} />
              <TouchableOpacity 
                style={styles.modalCloseButton} 
                onPress={() => setShowDetailsModal(false)}
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {selectedSource && (
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* Source Header */}
                <View style={[styles.sourceHeader, { backgroundColor: getStatusBackgroundColor(selectedSource.status) }]}>
                  <View style={styles.sourceIconContainer}>
                    <LinearGradient
                      colors={[getStatusColor(selectedSource.status), getStatusColor(selectedSource.status) + '80']}
                      style={styles.sourceIconGradient}
                    >
                      <Ionicons name={getTypeIcon(selectedSource.type)} size={28} color="white" />
                    </LinearGradient>
                  </View>
                  <View style={styles.sourceHeaderText}>
                    <Typography variant="h1" style={styles.modalTitle}>{selectedSource.name}</Typography>
                    <View style={styles.statusRow}>
                      <View style={[styles.statusDotLarge, { backgroundColor: getStatusColor(selectedSource.status) }]} />
                      <Typography variant="h3" style={[styles.statusTextLarge, { color: getStatusColor(selectedSource.status) }]}>
                        {getTranslatedStatus(selectedSource.status)}
                      </Typography>
                    </View>
                  </View>
                </View>

                {/* Quick Info Grid */}
                <View style={styles.infoGrid}>
                  <View style={styles.infoCard}>
                    <Ionicons name="location" size={20} color="#0c6dff" />
                    <Typography variant="caption" style={styles.infoLabel}>Region</Typography>
                    <Typography variant="body" style={styles.infoValue}>{selectedSource.region}</Typography>
                  </View>
                  <View style={styles.infoCard}>
                    <Ionicons name="navigate" size={20} color="#0c6dff" />
                    <Typography variant="caption" style={styles.infoLabel}>Distance</Typography>
                    <Typography variant="body" style={styles.infoValue}>{selectedSource.distance || 'N/A'}</Typography>
                  </View>
                  <View style={styles.infoCard}>
                    <Ionicons name="time" size={20} color="#0c6dff" />
                    <Typography variant="caption" style={styles.infoLabel}>Last Update</Typography>
                    <Typography variant="body" style={styles.infoValue}>{selectedSource.lastUpdate}</Typography>
                  </View>
                  <View style={styles.infoCard}>
                    <Ionicons name="water" size={20} color="#0c6dff" />
                    <Typography variant="caption" style={styles.infoLabel}>Type</Typography>
                    <Typography variant="body" style={styles.infoValue}>{selectedSource.type}</Typography>
                  </View>
                </View>

                {/* Details Section */}
                <View style={styles.detailsSection}>
                  <Typography variant="h3" style={styles.sectionTitle}>Source Details</Typography>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="people" size={18} color="#64748b" />
                    <View style={styles.detailContent}>
                      <Typography variant="caption" style={styles.detailLabel}>Community</Typography>
                      <Typography variant="body" style={styles.detailValue}>{selectedSource.community}</Typography>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="speedometer" size={18} color="#64748b" />
                    <View style={styles.detailContent}>
                      <Typography variant="caption" style={styles.detailLabel}>Flow Rate</Typography>
                      <Typography variant="body" style={styles.detailValue}>{selectedSource.flowRate || 'N/A'}</Typography>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="thermometer" size={18} color="#64748b" />
                    <View style={styles.detailContent}>
                      <Typography variant="caption" style={styles.detailLabel}>Water Quality</Typography>
                      <Typography variant="body" style={styles.detailValue}>{selectedSource.waterQuality || 'Unknown'}</Typography>
                    </View>
                  </View>

                  {selectedSource.notes && (
                    <View style={styles.notesCard}>
                      <Typography variant="caption" style={styles.notesLabel}>Community Notes</Typography>
                      <Typography variant="body" style={styles.notesText}>{selectedSource.notes}</Typography>
                    </View>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => {
                      setShowDetailsModal(false);
                      // Navigate to report screen
                    }}
                  >
                    <Ionicons name="create" size={18} color="#0c6dff" />
                    <Typography variant="body" style={[styles.actionButtonText, { color: '#0c6dff' }]}>
                      Report Update
                    </Typography>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={() => {
                      handleGetDirections(selectedSource);
                      setShowDetailsModal(false);
                    }}
                  >
                    <Ionicons name="navigate" size={18} color="white" />
                    <Typography variant="body" style={[styles.actionButtonText, { color: 'white' }]}>
                      Get Directions
                    </Typography>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <Layout noPadding>
      {renderHeader()}
      {viewMode === 'map' ? renderMapView() : renderListView()}
      {renderDetailsModal()}
      
      {/* View Toggle Button for List View */}
      {viewMode === 'list' && (
        <TouchableOpacity 
          style={styles.viewToggleButton} 
          onPress={() => setViewMode('map')}
        >
          <LinearGradient colors={['#0c6dff', '#0c6dff']} style={styles.viewToggleGradient}>
            <Ionicons name="map" size={18} color="white" />
            <Typography variant="caption" style={styles.viewToggleText}>View Map</Typography>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </Layout>
  );
};

// ================ STYLES ================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  
  // Header Styles
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerGradient: { flex: 1 },
  headerContent: { flex: 1, paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 50 : 30 },
  
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: { flexDirection: 'row', alignItems: 'center' },
  titleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
  },
  headerRight: { flexDirection: 'row', gap: 8 },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: 'white', marginBottom: 4 },
  statLabel: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 11, fontWeight: '600' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  
  // Search Bar
  searchBarContainer: { marginBottom: 12 },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#1e293b', paddingVertical: 0 },
  
  // Filter Tabs
  filterTabsContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
  },
  filterScrollContent: { paddingHorizontal: 20, gap: 8 },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    gap: 6,
  },
  filterButtonActive: { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  filterIconContainer: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  filterButtonText: { fontSize: 12, fontWeight: '500', color: '#64748b' },
  
  // Map Styles
  mapContainer: { flex: 1, backgroundColor: '#f0f4f8' },
  map: { flex: 1 },
  mapPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' },
  placeholderText: { color: '#64748b', marginTop: 12, fontSize: 18, fontWeight: '600' },
  placeholderSubtext: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  mapLoading: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  loadingText: { color: '#64748b', marginTop: 12 },
  centerButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  centerButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // List Styles
  listContainer: { flex: 1, backgroundColor: '#f8fafc' },
  listHeader: { padding: 20, paddingBottom: 12 },
  listTitle: { fontSize: 22, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  listSubtitle: { color: '#64748b', fontSize: 14 },
  sourceCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  typeIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardContent: { flex: 1 },
  sourceName: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 6 },
  sourceDetails: { flexDirection: 'row', alignItems: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  statusText: { fontSize: 11, fontWeight: '600' },
  locationText: { color: '#64748b', fontSize: 11 },
  cardFooter: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  footerItem: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 4 },
  footerText: { color: '#64748b', fontSize: 11 },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject },
  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    position: 'absolute',
    left: '50%',
    marginLeft: -20,
    top: 8,
  },
  modalCloseButton: { padding: 4 },
  modalScroll: { flex: 1 },
  
  // Source Header in Modal
  sourceHeader: {
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceIconContainer: { marginRight: 16 },
  sourceIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceHeaderText: { flex: 1 },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDotLarge: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusTextLarge: { fontSize: 16, fontWeight: '600' },
  
  // Info Grid
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  infoCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  infoLabel: { color: '#64748b', fontSize: 11, marginTop: 8, marginBottom: 4, fontWeight: '600' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  
  // Details Section
  detailsSection: { padding: 24, paddingTop: 0 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  detailContent: { flex: 1, marginLeft: 12 },
  detailLabel: { color: '#64748b', fontSize: 11, marginBottom: 2, fontWeight: '600' },
  detailValue: { fontSize: 14, fontWeight: '500', color: '#1e293b' },
  
  // Notes Card
  notesCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  notesLabel: { color: '#64748b', fontSize: 11, marginBottom: 4, fontWeight: '600' },
  notesText: { color: '#64748b', fontSize: 14, lineHeight: 20 },
  
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  primaryButton: { backgroundColor: '#0c6dff' },
  secondaryButton: { backgroundColor: '#f1f5f9' },
  actionButtonText: { fontSize: 14, fontWeight: '600' },
  
  // View Toggle Button
  viewToggleButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  viewToggleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  viewToggleText: { color: 'white', fontSize: 14, fontWeight: '600' },
});

// Generate Map HTML (simplified for brevity)
const generateMapHTML = () => {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><style>#map{width:100%;height:100%;}</style></head><body><div id="map"></div><script>var map=L.map('map').setView([9.5624,44.0770],13);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);window.ReactNativeWebView.postMessage(JSON.stringify({type:'mapReady'}));</script></body></html>`;
};

export default WaterSourcesMapScreen;