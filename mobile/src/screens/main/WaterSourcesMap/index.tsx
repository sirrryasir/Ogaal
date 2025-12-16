import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, StyleSheet, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, 
  Platform, ScrollView, Animated, Dimensions, PanResponder, RefreshControl 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_EXPANDED_HEIGHT = 280;
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
  const [showSourceDetails, setShowSourceDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [region, setRegion] = useState({
    latitude: 9.5624,
    longitude: 44.0770,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  
  const webViewRef = useRef<WebView | null>(null);
  const headerHeight = useRef(new Animated.Value(HEADER_EXPANDED_HEIGHT)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const headerScale = useRef(new Animated.Value(1)).current;
  
  const [waterSources, setWaterSources] = useState<WaterSource[]>([
    // Hargeisa/Maroodi Jeex region
    { 
      id: '1', 
      type: 'Borehole', 
      name: 'Borehole A1 - Hargeisa', 
      status: 'Working', 
      lastUpdate: '2 hours ago', 
      distance: '2.5 km', 
      latitude: 9.5624, 
      longitude: 44.0770, 
      region: 'Maroodi Jeex', 
      flowRate: '500 L/min', 
      waterQuality: 'Good',
      capacity: '5000 L/hr',
      community: 'Hargeisa Central',
      contact: '+252 63 1234567',
      notes: 'Operational 24/7, clean water source'
    },
    { 
      id: '2', 
      type: 'Well', 
      name: 'Well B2 - Hargeisa', 
      status: 'Low water', 
      lastUpdate: '1 day ago', 
      distance: '3.1 km', 
      latitude: 9.5650, 
      longitude: 44.0800, 
      region: 'Maroodi Jeex', 
      flowRate: '150 L/min', 
      waterQuality: 'Moderate',
      capacity: '2000 L/hr',
      community: 'Hargeisa North',
      contact: '+252 63 2345678',
      notes: 'Reduced flow during dry season'
    },
    { 
      id: '3', 
      type: 'Dam', 
      name: 'Dam C3 - Hargeisa', 
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
      notes: 'Waiting for rainfall, seasonal source'
    },
    { 
      id: '4', 
      type: 'Berkad', 
      name: 'Berkad D4 - Hargeisa', 
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
      notes: 'Requires maintenance, structure damaged'
    },
    // More sources...
  ]);

  const isWeb = Platform.OS === 'web';

  // Pan responder for header collapse/expand
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < -20) {
          expandHeader();
        } else if (gestureState.dy > 20) {
          collapseHeader();
        }
      },
    })
  ).current;

  const collapseHeader = () => {
    Animated.parallel([
      Animated.spring(headerHeight, {
        toValue: HEADER_COLLAPSED_HEIGHT,
        useNativeDriver: false,
      }),
      Animated.spring(headerOpacity, {
        toValue: 0.7,
        useNativeDriver: false,
      }),
      Animated.spring(headerScale, {
        toValue: 0.9,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const expandHeader = () => {
    Animated.parallel([
      Animated.spring(headerHeight, {
        toValue: HEADER_EXPANDED_HEIGHT,
        useNativeDriver: false,
      }),
      Animated.spring(headerOpacity, {
        toValue: 1,
        useNativeDriver: false,
      }),
      Animated.spring(headerScale, {
        toValue: 1,
        useNativeDriver: false,
      }),
    ]).start();
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = useCallback(async () => {
    try {
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
      setRegion({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } catch (error) {
      setErrorMsg('Failed to get location');
      console.error(error);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Working': return '#10B981';
      case 'Low water': return '#F59E0B';
      case 'Dry': return '#EF4444';
      case 'Broken': return '#374151';
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
      case 'Well': return 'water';
      case 'Dam': return 'business';
      case 'Berkad': return 'leaf';
      default: return 'water';
    }
  };

  const getQualityColor = (quality: string = 'Unknown') => {
    switch (quality.toLowerCase()) {
      case 'excellent': return '#10B981';
      case 'good': return '#3B82F6';
      case 'moderate': return '#F59E0B';
      case 'poor': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const filteredSources = waterSources.filter(source => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'working') return source.status === 'Working';
    if (activeFilter === 'low') return source.status === 'Low water';
    if (activeFilter === 'dry') return source.status === 'Dry';
    if (activeFilter === 'broken') return source.status === 'Broken';
    return true;
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await requestLocationPermission();
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Refreshed', 'Water sources data has been updated');
    }, 1000);
  }, [requestLocationPermission]);

  const handleSourceSelect = (source: WaterSource) => {
    setSelectedSource(source);
    setShowSourceDetails(true);
    collapseHeader();
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
    setShowSourceDetails(false);
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

  const toggleHeader = () => {
    const currentHeight = headerHeight.__getValue();
    if (currentHeight === HEADER_EXPANDED_HEIGHT) {
      collapseHeader();
    } else {
      expandHeader();
    }
  };

  const HeaderCollapseIndicator = () => (
    <TouchableOpacity 
      style={styles.collapseIndicator}
      onPress={toggleHeader}
      {...panResponder.panHandlers}
    >
      <Ionicons 
        name={headerHeight.__getValue() === HEADER_EXPANDED_HEIGHT ? "chevron-down" : "chevron-up"} 
        size={24} 
        color="white" 
      />
    </TouchableOpacity>
  );

  const FilterButton = ({ filter, label, icon }: { filter: string; label: string; icon: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && styles.filterButtonActive,
        activeFilter === filter && { backgroundColor: getStatusColor(waterSources.find(s => s.status === label)?.status || '') + '20' }
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Ionicons 
        name={icon as any} 
        size={16} 
        color={activeFilter === filter ? getStatusColor(waterSources.find(s => s.status === label)?.status || '') : '#CBD5E1'} 
      />
      <Typography variant="caption" style={[
        styles.filterButtonText,
        activeFilter === filter && { color: getStatusColor(waterSources.find(s => s.status === label)?.status || '') }
      ]}>
        {label}
      </Typography>
    </TouchableOpacity>
  );

  const renderHeaderContent = () => (
    <Animated.View 
      style={[
        styles.headerGradient,
        { 
          height: headerHeight,
          opacity: headerOpacity,
          transform: [{ scale: headerScale }]
        }
      ]}
    >
      <LinearGradient
        colors={['#0c6dff', '#4f46e5']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <View style={styles.titleIconContainer}>
              <Ionicons name="water" size={24} color="#60A5FA" />
            </View>
            <View>
              <Typography variant="h1" style={styles.headerTitle}>Water Sources</Typography>
              <Typography variant="caption" style={styles.headerSubtitle}>
                {filteredSources.length} sources • {location ? 'Your location' : 'Map view'}
              </Typography>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.headerActionButton}
            onPress={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
          >
            <Ionicons 
              name={viewMode === 'map' ? "list" : "map"} 
              size={22} 
              color="#60A5FA" 
            />
          </TouchableOpacity>
        </View>

        <Animated.View 
          style={[
            styles.expandableContent,
            {
              opacity: headerHeight.interpolate({
                inputRange: [HEADER_COLLAPSED_HEIGHT, HEADER_EXPANDED_HEIGHT],
                outputRange: [0, 1],
                extrapolate: 'clamp'
              })
            }
          ]}
        >
          <View style={styles.quickStatsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickStatsScroll}>
              <View style={[styles.statCard, { backgroundColor: '#10B98120' }]}>
                <Typography variant="h2" style={[styles.statNumber, { color: '#10B981' }]}>
                  {waterSources.filter(w => w.status === 'Working').length}
                </Typography>
                <Typography variant="caption" style={styles.statLabel}>Working</Typography>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#F59E0B20' }]}>
                <Typography variant="h2" style={[styles.statNumber, { color: '#F59E0B' }]}>
                  {waterSources.filter(w => w.status === 'Low water').length}
                </Typography>
                <Typography variant="caption" style={styles.statLabel}>Low Water</Typography>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#EF444420' }]}>
                <Typography variant="h2" style={[styles.statNumber, { color: '#EF4444' }]}>
                  {waterSources.filter(w => w.status === 'Dry').length}
                </Typography>
                <Typography variant="caption" style={styles.statLabel}>Dry</Typography>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#37415120' }]}>
                <Typography variant="h2" style={[styles.statNumber, { color: '#374151' }]}>
                  {waterSources.filter(w => w.status === 'Broken').length}
                </Typography>
                <Typography variant="caption" style={styles.statLabel}>Broken</Typography>
              </View>
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Typography variant="body" style={styles.filterTitle}>Filter by Status</Typography>
              <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
                <Ionicons name={showFilters ? "chevron-up" : "chevron-down"} size={20} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
            {showFilters && (
              <View style={styles.filtersContainer}>
                <FilterButton filter="all" label="All Sources" icon="grid" />
                <FilterButton filter="working" label="Working" icon="checkmark-circle" />
                <FilterButton filter="low" label="Low Water" icon="alert-circle" />
                <FilterButton filter="dry" label="Dry" icon="close-circle" />
                <FilterButton filter="broken" label="Broken" icon="construct" />
              </View>
            )}
          </View>
        </Animated.View>
        
        <HeaderCollapseIndicator />
      </View>
    </Animated.View>
  );

  const renderMapView = () => (
    <View style={styles.mapContainer}>
      {isWeb ? (
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={64} color="#CBD5E1" />
          <Typography variant="h3" style={styles.mapPlaceholderText}>Interactive Map</Typography>
          <Typography variant="body" style={styles.mapPlaceholderSubtext}>
            Map view available in mobile app
          </Typography>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{
            html: `
<!DOCTYPE html>
<html>
<head>
<title>Water Sources Map</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body, html { width: 100%; height: 100%; overflow: hidden; }
#map { 
  width: 100%; 
  height: 100%; 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.custom-marker {
  background: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 3px solid;
}
.custom-marker:hover { 
  transform: scale(1.2) translateY(-5px); 
  box-shadow: 0 6px 12px rgba(0,0,0,0.4);
}
.marker-pulse {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}
.leaflet-popup-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 12px;
  min-width: 200px;
}
.leaflet-popup-content h3 {
  margin: 0 0 8px 0;
  color: #0F172A;
  font-size: 16px;
}
.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin: 4px 0;
}
</style>
</head>
<body>
<div id="map"></div>
<script>
var map = L.map('map').setView([${region.latitude}, ${region.longitude}], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap, © CartoDB',
  maxZoom: 19
}).addTo(map);

function getStatusColor(status) {
  switch (status) {
    case 'Working': return '#10B981';
    case 'Low water': return '#F59E0B';
    case 'Dry': return '#EF4444';
    case 'Broken': return '#374151';
    default: return '#6B7280';
  }
}

${waterSources.map(source => `
var marker = L.marker([${source.latitude}, ${source.longitude}], {
  icon: L.divIcon({
    html: '<div class="custom-marker marker-pulse" style="border-color: ' + getStatusColor("${source.status}") + '">' +
          '<div style="width: 16px; height: 16px; border-radius: 50%; background: ' + getStatusColor("${source.status}") + '"></div>' +
          '</div>',
    className: 'custom-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  })
}).addTo(map);

marker.bindPopup('<h3>${source.name}</h3>' +
  '<div class="status-badge" style="background: ' + getStatusColor("${source.status}") + '20; color: ' + getStatusColor("${source.status}") + '">' +
  '${source.status}</div>' +
  '<p><strong>Type:</strong> ${source.type}</p>' +
  '<p><strong>Region:</strong> ${source.region}</p>' +
  '<p><strong>Last Update:</strong> ${source.lastUpdate}</p>' +
  '<button onclick="selectSource(\'${source.id}\')" style="background: #3B82F6; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; margin-top: 8px; width: 100%;">View Details</button>');

marker.on('click', function(e) {
  window.ReactNativeWebView.postMessage(JSON.stringify({ 
    type: 'select', 
    id: '${source.id}'
  }));
});
`).join('')}

// Add user location if available
if (${location ? true : false}) {
  var userMarker = L.marker([${location?.latitude || region.latitude}, ${location?.longitude || region.longitude}], {
    icon: L.divIcon({
      html: '<div style="background: #3B82F6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3); animation: pulse 2s infinite;">👤</div>',
      className: 'user-div-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })
  }).addTo(map);
}

function selectSource(id) {
  window.ReactNativeWebView.postMessage(JSON.stringify({ 
    type: 'select', 
    id: id
  }));
}

var routingControl = null;

function addRoute(originLat, originLng, destLat, destLng) {
  if (routingControl) {
    map.removeControl(routingControl);
  }
  
  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(originLat, originLng),
      L.latLng(destLat, destLng)
    ],
    routeWhileDragging: false,
    lineOptions: {
      styles: [
        { color: '#3B82F6', weight: 5, opacity: 0.8 }
      ]
    },
    fitSelectedRoutes: true,
    show: true
  }).addTo(map);
}

window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
</script>
</body>
</html>
`
          }}
          style={styles.map}
          onLoad={handleMapReady}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'select') {
                const source = waterSources.find(s => s.id === data.id);
                if (source) {
                  handleSourceSelect(source);
                }
              } else if (data.type === 'mapReady') {
                handleMapReady();
              }
            } catch (e) {
              console.warn('Failed to parse message', e);
            }
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.mapLoading}>
              <Ionicons name="map" size={48} color="#3B82F6" />
              <Typography variant="h3" style={styles.mapLoadingText}>Loading Map...</Typography>
            </View>
          )}
        />
      )}
    </View>
  );

  const renderListView = () => (
    <View style={styles.listContainer}>
      <ScrollView 
        style={styles.listScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.listHeader}>
          <Typography variant="h2" style={styles.listTitle}>All Water Sources</Typography>
          <Typography variant="caption" style={styles.listSubtitle}>
            {filteredSources.length} sources found
          </Typography>
        </View>
        
        {filteredSources.map((source) => (
          <TouchableOpacity
            key={source.id}
            style={styles.listItem}
            onPress={() => handleSourceSelect(source)}
            activeOpacity={0.7}
          >
            <View style={styles.listItemLeft}>
              <View style={[
                styles.listItemIconContainer,
                { backgroundColor: getStatusBackgroundColor(source.status) }
              ]}>
                <Ionicons 
                  name={getTypeIcon(source.type)} 
                  size={20} 
                  color={getStatusColor(source.status)} 
                />
              </View>
              <View style={styles.listItemContent}>
                <Typography variant="body" style={styles.listItemTitle}>
                  {source.name}
                </Typography>
                <View style={styles.listItemDetails}>
                  <View style={styles.listItemBadge}>
                    <View style={[styles.listItemDot, { backgroundColor: getStatusColor(source.status) }]} />
                    <Typography variant="caption" style={[styles.listItemStatus, { color: getStatusColor(source.status) }]}>
                      {source.status}
                    </Typography>
                  </View>
                  <Typography variant="caption" style={styles.listItemDetail}>
                    {source.region} • {source.distance}
                  </Typography>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const SourceDetailsModal = () => (
    <Modal
      visible={showSourceDetails && !!selectedSource}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={() => setShowSourceDetails(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowSourceDetails(false)}
        />
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalDragHandle} />
            </View>
            
            {selectedSource && (
              <>
                <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                  {/* Source Header */}
                  <View style={[styles.sourceHeader, { backgroundColor: getStatusBackgroundColor(selectedSource.status) }]}>
                    <View style={styles.sourceIconLarge}>
                      <LinearGradient 
                        colors={[getStatusColor(selectedSource.status), getStatusColor(selectedSource.status) + '80']}
                        style={styles.sourceIconGradientLarge}
                      >
                        <Ionicons name={getTypeIcon(selectedSource.type)} size={32} color="white" />
                      </LinearGradient>
                    </View>
                    <View style={styles.sourceHeaderContent}>
                      <Typography variant="h1" style={styles.modalTitleLarge}>
                        {selectedSource.name}
                      </Typography>
                      <View style={styles.statusContainer}>
                        <View style={[styles.statusDotLarge, { backgroundColor: getStatusColor(selectedSource.status) }]} />
                        <Typography variant="h3" style={[styles.statusTextLarge, { color: getStatusColor(selectedSource.status) }]}>
                          {selectedSource.status}
                        </Typography>
                      </View>
                    </View>
                  </View>

                  {/* Quick Info */}
                  <View style={styles.quickInfoGrid}>
                    <View style={styles.quickInfoCard}>
                      <Ionicons name="location" size={20} color="#3B82F6" />
                      <Typography variant="caption" style={styles.quickInfoLabel}>Region</Typography>
                      <Typography variant="body" style={styles.quickInfoValue}>{selectedSource.region}</Typography>
                    </View>
                    <View style={styles.quickInfoCard}>
                      <Ionicons name="navigate" size={20} color="#3B82F6" />
                      <Typography variant="caption" style={styles.quickInfoLabel}>Distance</Typography>
                      <Typography variant="body" style={styles.quickInfoValue}>{selectedSource.distance || 'N/A'}</Typography>
                    </View>
                    <View style={styles.quickInfoCard}>
                      <Ionicons name="time" size={20} color="#3B82F6" />
                      <Typography variant="caption" style={styles.quickInfoLabel}>Last Update</Typography>
                      <Typography variant="body" style={styles.quickInfoValue}>{selectedSource.lastUpdate}</Typography>
                    </View>
                    <View style={styles.quickInfoCard}>
                      <Ionicons name="water" size={20} color="#3B82F6" />
                      <Typography variant="caption" style={styles.quickInfoLabel}>Type</Typography>
                      <Typography variant="body" style={styles.quickInfoValue}>{selectedSource.type}</Typography>
                    </View>
                  </View>

                  {/* Detailed Information */}
                  <View style={styles.detailsSection}>
                    <Typography variant="h3" style={styles.sectionTitle}>Water Information</Typography>
                    <View style={styles.detailRow}>
                      <Ionicons name="speedometer" size={20} color="#64748B" />
                      <View style={styles.detailContent}>
                        <Typography variant="caption" style={styles.detailLabel}>Flow Rate</Typography>
                        <Typography variant="body" style={styles.detailValue}>{selectedSource.flowRate || 'Unknown'}</Typography>
                      </View>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="water" size={20} color="#64748B" />
                      <View style={styles.detailContent}>
                        <Typography variant="caption" style={styles.detailLabel}>Water Quality</Typography>
                        <View style={styles.qualityIndicator}>
                          <View style={[styles.qualityDotLarge, { backgroundColor: getQualityColor(selectedSource.waterQuality) }]} />
                          <Typography variant="body" style={[styles.detailValue, { color: getQualityColor(selectedSource.waterQuality) }]}>
                            {selectedSource.waterQuality || 'Unknown'}
                          </Typography>
                        </View>
                      </View>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="business" size={20} color="#64748B" />
                      <View style={styles.detailContent}>
                        <Typography variant="caption" style={styles.detailLabel}>Capacity</Typography>
                        <Typography variant="body" style={styles.detailValue}>{selectedSource.capacity || 'N/A'}</Typography>
                      </View>
                    </View>
                  </View>

                  {/* Community Info */}
                  <View style={styles.detailsSection}>
                    <Typography variant="h3" style={styles.sectionTitle}>Community Information</Typography>
                    <View style={styles.detailRow}>
                      <Ionicons name="people" size={20} color="#64748B" />
                      <View style={styles.detailContent}>
                        <Typography variant="caption" style={styles.detailLabel}>Serving Community</Typography>
                        <Typography variant="body" style={styles.detailValue}>{selectedSource.community || 'N/A'}</Typography>
                      </View>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="call" size={20} color="#64748B" />
                      <View style={styles.detailContent}>
                        <Typography variant="caption" style={styles.detailLabel}>Contact</Typography>
                        <Typography variant="body" style={styles.detailValue}>{selectedSource.contact || 'N/A'}</Typography>
                      </View>
                    </View>
                  </View>

                  {/* Notes */}
                  {selectedSource.notes && (
                    <View style={styles.detailsSection}>
                      <Typography variant="h3" style={styles.sectionTitle}>Additional Notes</Typography>
                      <View style={styles.notesCard}>
                        <Typography variant="body" style={styles.notesText}>
                          {selectedSource.notes}
                        </Typography>
                      </View>
                    </View>
                  )}
                </ScrollView>

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => {
                      setShowSourceDetails(false);
                      navigation.navigate('Report' as never, { source: selectedSource });
                    }}
                  >
                    <Ionicons name="create" size={20} color="#3B82F6" />
                    <Typography variant="body" style={[styles.actionButtonText, { color: '#3B82F6' }]}>
                      Report Update
                    </Typography>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={() => handleGetDirections(selectedSource)}
                  >
                    <Ionicons name="navigate" size={20} color="white" />
                    <Typography variant="body" style={styles.actionButtonText}>
                      Get Directions
                    </Typography>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <Layout noPadding>
      {renderHeaderContent()}
      
      <View style={styles.container}>
        {viewMode === 'map' ? renderMapView() : renderListView()}
        
        {viewMode === 'map' && !isWeb && mapReady && location && (
          <TouchableOpacity style={styles.centerButton} onPress={handleCenterToUser}>
            <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.centerButtonGradient}>
              <Ionicons name="locate" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        )}
        
        {viewMode === 'map' && (
          <TouchableOpacity 
            style={styles.viewToggleButton} 
            onPress={() => setViewMode('list')}
          >
            <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.viewToggleGradient}>
              <Ionicons name="list" size={20} color="white" />
              <Typography variant="caption" style={styles.viewToggleText}>
                View All ({filteredSources.length})
              </Typography>
            </LinearGradient>
          </TouchableOpacity>
        )}
        
        {viewMode === 'list' && (
          <TouchableOpacity 
            style={styles.viewToggleButton} 
            onPress={() => setViewMode('map')}
          >
            <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.viewToggleGradient}>
              <Ionicons name="map" size={20} color="white" />
              <Typography variant="caption" style={styles.viewToggleText}>
                View Map
              </Typography>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
      
      <SourceDetailsModal />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 35 : 15,
    height: '100%',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    marginRight: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#CBD5E1',
    fontSize: 14,
  },
  headerActionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  expandableContent: {
    marginBottom: 20,
  },
  quickStatsContainer: {
    marginBottom: 20,
  },
  quickStatsScroll: {
    paddingRight: 20,
  },
  statCard: {
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  filterSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterButtonText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '500',
  },
  collapseIndicator: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: 10,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  mapPlaceholderText: {
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    color: '#94A3B8',
    fontSize: 14,
  },
  mapLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  mapLoadingText: {
    color: '#64748B',
    marginTop: 12,
  },
  centerButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centerButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewToggleButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  viewToggleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  viewToggleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listScroll: {
    flex: 1,
  },
  listHeader: {
    padding: 20,
    paddingBottom: 10,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  listSubtitle: {
    color: '#64748B',
    fontSize: 14,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  listItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  listItemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  listItemStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  listItemDetail: {
    color: '#64748B',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
  },
  modalScroll: {
    flex: 1,
  },
  sourceHeader: {
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceIconLarge: {
    marginRight: 16,
  },
  sourceIconGradientLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceHeaderContent: {
    flex: 1,
  },
  modalTitleLarge: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDotLarge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusTextLarge: {
    fontSize: 16,
    fontWeight: '600',
  },
  quickInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  quickInfoCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  quickInfoLabel: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  quickInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  detailsSection: {
    padding: 24,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
  },
  qualityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qualityDotLarge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  notesCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  notesText: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
  secondaryButton: {
    backgroundColor: '#F1F5F9',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WaterSourcesMapScreen;