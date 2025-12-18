import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  TextInput,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';

const { width, height } = Dimensions.get('window');

interface WaterSource {
  id: string;
  name: string;
  type: 'borehole' | 'well' | 'dam' | 'berkad' | 'spring' | 'rainwater';
  status: 'operational' | 'under-maintenance' | 'low-water' | 'dry' | 'contaminated';
  distance: string;
  location: string;
  region: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  waterQuality: 'excellent' | 'good' | 'fair' | 'poor';
  capacity: string;
  populationServed: number;
  phone?: string;
}

const NearbySourcesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  // Mock data for water sources
  const waterSources: WaterSource[] = [
    {
      id: '1',
      name: 'Hargeisa Main Borehole',
      type: 'borehole',
      status: 'operational',
      distance: '2.1 km',
      location: 'Hargeisa, Maroodi Jeex',
      region: 'Maroodi Jeex',
      latitude: 9.5624,
      longitude: 44.0770,
      lastUpdated: '2 hours ago',
      waterQuality: 'excellent',
      capacity: '50,000 L/day',
      populationServed: 5000,
      phone: '+252 63 1234567',
    },
    {
      id: '2',
      name: 'Gabiley Community Well',
      type: 'well',
      status: 'operational',
      distance: '45.3 km',
      location: 'Gabiley, Gabiley',
      region: 'Gabiley',
      latitude: 9.7167,
      longitude: 43.6167,
      lastUpdated: '4 hours ago',
      waterQuality: 'good',
      capacity: '25,000 L/day',
      populationServed: 2500,
      phone: '+252 90 7654321',
    },
    {
      id: '3',
      name: 'Togdheer Dam',
      type: 'dam',
      status: 'low-water',
      distance: '120 km',
      location: 'Burao, Togdheer',
      region: 'Togdheer',
      latitude: 9.5333,
      longitude: 45.3667,
      lastUpdated: '1 day ago',
      waterQuality: 'fair',
      capacity: '200,000 L',
      populationServed: 10000,
    },
    {
      id: '4',
      name: 'Berbera Berkad',
      type: 'berkad',
      status: 'operational',
      distance: '170 km',
      location: 'Berbera, Sahil',
      region: 'Sahil',
      latitude: 10.4333,
      longitude: 45.0167,
      lastUpdated: '3 hours ago',
      waterQuality: 'good',
      capacity: '75,000 L',
      populationServed: 3000,
    },
    {
      id: '5',
      name: 'Borama Spring',
      type: 'spring',
      status: 'contaminated',
      distance: '110 km',
      location: 'Borama, Awdal',
      region: 'Awdal',
      latitude: 9.9333,
      longitude: 43.1833,
      lastUpdated: '2 days ago',
      waterQuality: 'poor',
      capacity: '10,000 L/day',
      populationServed: 1000,
    },
    {
      id: '6',
      name: 'Ceerigaabo Rainwater',
      type: 'rainwater',
      status: 'under-maintenance',
      distance: '240 km',
      location: 'Ceerigaabo, Sanaag',
      region: 'Sanaag',
      latitude: 10.6167,
      longitude: 47.3667,
      lastUpdated: '1 week ago',
      waterQuality: 'excellent',
      capacity: '15,000 L',
      populationServed: 1500,
      phone: '+252 62 9876543',
    },
    {
      id: '7',
      name: 'Laas Caanood Well',
      type: 'well',
      status: 'operational',
      distance: '280 km',
      location: 'Laas Caanood, Sool',
      region: 'Sool',
      latitude: 8.4833,
      longitude: 47.3667,
      lastUpdated: '6 hours ago',
      waterQuality: 'good',
      capacity: '30,000 L/day',
      populationServed: 3500,
    },
    {
      id: '8',
      name: 'Burao Borehole',
      type: 'borehole',
      status: 'dry',
      distance: '125 km',
      location: 'Burao, Togdheer',
      region: 'Togdheer',
      latitude: 9.5167,
      longitude: 45.5333,
      lastUpdated: '3 days ago',
      waterQuality: 'fair',
      capacity: '40,000 L/day',
      populationServed: 4000,
    },
  ];

  // Filter sources based on search and filters
  const filteredSources = waterSources.filter(source => {
    const matchesSearch = searchQuery === '' || 
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.region.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !filterType || source.type === filterType;
    const matchesStatus = !filterStatus || source.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Type icons
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'borehole': return 'oil-well';
      case 'well': return 'water-pump';
      case 'dam': return 'dam';
      case 'berkad': return 'water';
      case 'spring': return 'fountain';
      case 'rainwater': return 'weather-rainy';
      default: return 'water';
    }
  };

  // Type colors
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'borehole': return '#0c6dff';
      case 'well': return '#10b981';
      case 'dam': return '#8b5cf6';
      case 'berkad': return '#3b82f6';
      case 'spring': return '#06b6d4';
      case 'rainwater': return '#3b82f6';
      default: return '#64748b';
    }
  };

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return '#10b981';
      case 'under-maintenance': return '#f59e0b';
      case 'low-water': return '#f59e0b';
      case 'dry': return '#ef4444';
      case 'contaminated': return '#ef4444';
      default: return '#64748b';
    }
  };

  // Status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational': return 'Operational';
      case 'under-maintenance': return 'Under Maintenance';
      case 'low-water': return 'Low Water';
      case 'dry': return 'Dry';
      case 'contaminated': return 'Contaminated';
      default: return status;
    }
  };

  // Water quality colors
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return '#10b981';
      case 'good': return '#84cc16';
      case 'fair': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#64748b';
    }
  };

  // Filter options
  const typeFilters = [
    { id: 'borehole', label: 'Borehole', icon: 'oil-well', color: '#0c6dff' },
    { id: 'well', label: 'Well', icon: 'water-pump', color: '#10b981' },
    { id: 'dam', label: 'Dam', icon: 'dam', color: '#8b5cf6' },
    { id: 'berkad', label: 'Berkad', icon: 'water', color: '#3b82f6' },
    { id: 'spring', label: 'Spring', icon: 'fountain', color: '#06b6d4' },
    { id: 'rainwater', label: 'Rainwater', icon: 'weather-rainy', color: '#3b82f6' },
  ];

  const statusFilters = [
    { id: 'operational', label: 'Operational', color: '#10b981' },
    { id: 'under-maintenance', label: 'Maintenance', color: '#f59e0b' },
    { id: 'low-water', label: 'Low Water', color: '#f59e0b' },
    { id: 'dry', label: 'Dry', color: '#ef4444' },
    { id: 'contaminated', label: 'Contaminated', color: '#ef4444' },
  ];

  // Handle source selection
  const handleSourceSelect = (source: WaterSource) => {
    setSelectedSource(source.id);
    
    // Zoom to selected source on map
    if (mapRef.current && viewMode === 'map') {
      mapRef.current.animateToRegion({
        latitude: source.latitude,
        longitude: source.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }, 1000);
    }
  };

  // Handle call
  const handleCall = (phone: string) => {
    Alert.alert(
      'Call',
      `Would you like to call ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Calling:', phone) },
      ]
    );
  };

  // Render source card
  const renderSourceCard = ({ item }: { item: WaterSource }) => (
    <TouchableOpacity
      style={[
        styles.sourceCard,
        selectedSource === item.id && styles.sourceCardSelected,
      ]}
      onPress={() => handleSourceSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.typeContainer}>
          <View style={[styles.typeIcon, { backgroundColor: getTypeColor(item.type) + '20' }]}>
            <MaterialCommunityIcons
              name={getTypeIcon(item.type) as any}
              size={20}
              color={getTypeColor(item.type)}
            />
          </View>
          <View style={styles.typeTextContainer}>
            <Typography style={styles.sourceName}>{item.name}</Typography>
            <Typography style={styles.sourceType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Typography>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <Typography style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Typography>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Feather name="map-pin" size={14} color="#64748b" />
            <Typography style={styles.infoText}>{item.location}</Typography>
          </View>
          <View style={styles.infoItem}>
            <Feather name="clock" size={14} color="#64748b" />
            <Typography style={styles.infoText}>{item.lastUpdated}</Typography>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Feather name="users" size={14} color="#64748b" />
            <Typography style={styles.statValue}>{item.populationServed.toLocaleString()}</Typography>
            <Typography style={styles.statLabel}>People</Typography>
          </View>
          <View style={styles.statItem}>
            <Feather name="droplet" size={14} color="#64748b" />
            <Typography style={styles.statValue}>{item.capacity}</Typography>
            <Typography style={styles.statLabel}>Capacity</Typography>
          </View>
          <View style={styles.statItem}>
            <Feather name="award" size={14} color="#64748b" />
            <Typography style={[styles.statValue, { color: getQualityColor(item.waterQuality) }]}>
              {item.waterQuality}
            </Typography>
            <Typography style={styles.statLabel}>Quality</Typography>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.distanceContainer}>
          <Feather name="navigation" size={14} color="#0c6dff" />
          <Typography style={styles.distanceText}>{item.distance} away</Typography>
        </View>
        <View style={styles.actionButtons}>
          {item.phone && (
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => handleCall(item.phone!)}
            >
              <Feather name="phone" size={14} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => Alert.alert('Directions', 'Opening directions...')}
          >
            <Feather name="navigation" size={14} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Layout style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#0c6dff', '#4f46e5']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Feather name="chevron-left" size={24} color="white" />
            </TouchableOpacity>
            <Typography style={styles.headerTitle}>Nearby Water Sources</Typography>
            <TouchableOpacity
              style={styles.viewModeButton}
              onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
              activeOpacity={0.8}
            >
              <Feather
                name={viewMode === 'list' ? 'map' : 'list'}
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Feather name="search" size={20} color="#64748b" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search water sources..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Feather name="x" size={16} color="#64748b" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          <TouchableOpacity
            style={[styles.filterPill, !filterType && styles.filterPillActive]}
            onPress={() => setFilterType(null)}
          >
            <Typography style={[styles.filterText, !filterType && styles.filterTextActive]}>
              All Types
            </Typography>
          </TouchableOpacity>
          
          {typeFilters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterPill,
                filterType === filter.id && styles.filterPillActive,
                filterType === filter.id && { backgroundColor: filter.color + '20' },
              ]}
              onPress={() => setFilterType(filterType === filter.id ? null : filter.id)}
            >
              <MaterialCommunityIcons
                name={filter.icon as any}
                size={16}
                color={filterType === filter.id ? filter.color : '#64748b'}
                style={styles.filterIcon}
              />
              <Typography
                style={[
                  styles.filterText,
                  filterType === filter.id && [styles.filterTextActive, { color: filter.color }],
                ]}
              >
                {filter.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Status Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statusFiltersContainer}
          contentContainerStyle={styles.statusFiltersContent}
        >
          <TouchableOpacity
            style={[styles.statusPill, !filterStatus && styles.statusPillActive]}
            onPress={() => setFilterStatus(null)}
          >
            <Typography style={[styles.statusText, !filterStatus && styles.statusTextActive]}>
              All Status
            </Typography>
          </TouchableOpacity>
          
          {statusFilters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.statusPill,
                filterStatus === filter.id && styles.statusPillActive,
                filterStatus === filter.id && { backgroundColor: filter.color + '20' },
              ]}
              onPress={() => setFilterStatus(filterStatus === filter.id ? null : filter.id)}
            >
              <View style={[styles.statusDot, { backgroundColor: filter.color }]} />
              <Typography
                style={[
                  styles.statusText,
                  filterStatus === filter.id && [styles.statusTextActive, { color: filter.color }],
                ]}
              >
                {filter.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Typography style={styles.resultsText}>
            {filteredSources.length} water sources found
            {searchQuery && ` for "${searchQuery}"`}
          </Typography>
        </View>

        {/* Main Content */}
        {viewMode === 'map' ? (
          // Map View
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: 9.5624,
                longitude: 44.0770,
                latitudeDelta: 2,
                longitudeDelta: 2,
              }}
              showsUserLocation
              showsMyLocationButton
            >
              {waterSources.map(source => (
                <Marker
                  key={source.id}
                  coordinate={{
                    latitude: source.latitude,
                    longitude: source.longitude,
                  }}
                  onPress={() => handleSourceSelect(source)}
                >
                  <View style={[
                    styles.markerContainer,
                    selectedSource === source.id && styles.markerContainerSelected,
                  ]}>
                    <View style={[styles.markerIcon, { backgroundColor: getTypeColor(source.type) }]}>
                      <MaterialCommunityIcons
                        name={getTypeIcon(source.type) as any}
                        size={16}
                        color="white"
                      />
                    </View>
                    <View style={[
                      styles.markerStatus,
                      { backgroundColor: getStatusColor(source.status) }
                    ]} />
                  </View>
                </Marker>
              ))}
            </MapView>

            {/* Map Overlay List */}
            <View style={styles.mapOverlay}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.mapOverlayScroll}
                contentContainerStyle={styles.mapOverlayContent}
              >
                {filteredSources.map(source => (
                  <TouchableOpacity
                    key={source.id}
                    style={[
                      styles.mapSourceCard,
                      selectedSource === source.id && styles.mapSourceCardSelected,
                    ]}
                    onPress={() => handleSourceSelect(source)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.mapSourceHeader}>
                      <Typography style={styles.mapSourceName} numberOfLines={1}>
                        {source.name}
                      </Typography>
                      <View style={[styles.mapSourceStatus, { backgroundColor: getStatusColor(source.status) }]} />
                    </View>
                    <Typography style={styles.mapSourceDistance}>
                      {source.distance} • {source.location}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        ) : (
          // List View
          <FlatList
            data={filteredSources}
            renderItem={renderSourceCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Feather name="droplet" size={64} color="#e2e8f0" />
                <Typography style={styles.emptyTitle}>
                  No water sources found
                </Typography>
                <Typography style={styles.emptyText}>
                  {searchQuery ? 'Try a different search term' : 'Try adjusting your filters'}
                </Typography>
              </View>
            }
          />
        )}

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => Alert.alert('Report', 'Report a new water source')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#0c6dff', '#4f46e5']}
            style={styles.fabGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Feather name="plus" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Layout>
    </SafeAreaView>
  );
};

// Import MaterialCommunityIcons
import { MaterialCommunityIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0c6dff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.5,
  },
  viewModeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
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
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterPillActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#0c6dff',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#0c6dff',
    fontWeight: '600',
  },
  statusFiltersContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  statusFiltersContent: {
    paddingHorizontal: 20,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusPillActive: {
    backgroundColor: '#f8fafc',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  statusTextActive: {
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  resultsText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sourceCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sourceCardSelected: {
    borderColor: '#0c6dff',
    shadowColor: '#0c6dff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeTextContainer: {
    flex: 1,
  },
  sourceName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  sourceType: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cardContent: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    color: '#0c6dff',
    fontWeight: '600',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  directionsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0c6dff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerContainerSelected: {
    transform: [{ scale: 1.2 }],
  },
  markerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  markerStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'white',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  mapOverlayScroll: {
    paddingHorizontal: 20,
  },
  mapOverlayContent: {
    paddingRight: 20,
  },
  mapSourceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  mapSourceCardSelected: {
    borderColor: '#0c6dff',
  },
  mapSourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mapSourceName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  mapSourceStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  mapSourceDistance: {
    fontSize: 12,
    color: '#64748b',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NearbySourcesScreen;