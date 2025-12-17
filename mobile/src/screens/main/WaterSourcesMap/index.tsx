import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback,
  Platform, ScrollView, Dimensions, RefreshControl, Animated
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

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_EXPANDED_HEIGHT = 280;
const HEADER_COLLAPSED_HEIGHT = 120;

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
  const [showFixedDetails, setShowFixedDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [region] = useState({
    latitude: 9.5624,
    longitude: 44.0770,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [mapKey, setMapKey] = useState(0); // Key to force WebView re-render
  
  const webViewRef = useRef<WebView | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: 'clamp',
  });

  const [waterSources, setWaterSources] = useState<WaterSource[]>([
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
    // Additional water sources for better map visibility
    { 
      id: '5', 
      type: 'Borehole', 
      name: 'Borehole E5 - Hargeisa', 
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
      notes: 'New installation, high yield'
    },
    { 
      id: '6', 
      type: 'Well', 
      name: 'Well F6 - Hargeisa', 
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
      notes: 'Seasonal variation expected'
    },
  ]);

  const isWeb = Platform.OS === 'web';



  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    // Force WebView to re-render when location changes
    setMapKey(prev => prev + 1);
  }, [location]);

  const requestLocationPermission = useCallback(async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        // Set default location for demo purposes
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
      console.error(error);
      // Set default location as fallback
      setLocation({ latitude: 9.5624, longitude: 44.0770 });
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

  const getTranslatedStatus = (status: string) => {
    switch (status) {
      case 'Working': return t('workingStatus');
      case 'Low water': return t('lowWaterStatus');
      case 'Dry': return t('dryStatus');
      case 'Broken': return t('brokenStatus');
      default: return status;
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
      Alert.alert(t('refreshed'), t('dataUpdated'));
    }, 1000);
  }, [requestLocationPermission]);

  const handleSourceSelect = (source: WaterSource) => {
    setSelectedSource(source);
    setShowFixedDetails(true);
  };

  const handleGetDirections = async (source: WaterSource) => {
    if (!location) {
      Alert.alert(
        t('locationRequired'),
        t('enableLocationMessage'),
        [
          { text: t('cancel'), style: 'cancel' },
          { text: t('enable'), onPress: requestLocationPermission }
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



  const FilterButton = ({ filter, label, icon }: { filter: string; label: string; icon: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && styles.filterButtonActive,
        activeFilter === filter && { backgroundColor: getStatusColor(label) + '20' }
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Ionicons 
        name={icon as any} 
        size={16} 
        color={activeFilter === filter ? getStatusColor(label) : '#CBD5E1'} 
      />
      <Typography variant="caption" style={[
        styles.filterButtonText,
        activeFilter === filter && { color: getStatusColor(label) }
      ]}>
        {label}
      </Typography>
    </TouchableOpacity>
  );

  const renderHeaderContent = () => (
    <View style={[styles.headerGradient, { height: HEADER_COLLAPSED_HEIGHT, backgroundColor: '#0c6dff' }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View style={styles.titleContainer}>
            <View style={styles.titleIconContainer}>
              <Ionicons name="water" size={24} color="white" />
            </View>
            <View>
              <Typography variant="h1" style={styles.headerTitle}>{t('mapTitle')}</Typography>
              <Typography variant="caption" style={styles.headerSubtitle}>
                {t('sourcesCount').replace('{count}', filteredSources.length.toString())} • {location ? t('yourLocation') : t('mapView')}
              </Typography>
            </View>
          </View>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={() => {
              const newMode = viewMode === 'map' ? 'list' : 'map';
              setViewMode(newMode);
            }}
          >
            <Ionicons
              name={viewMode === 'map' ? "list" : "map"}
              size={22}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.statusLegend}>
           <View style={styles.legendItem}>
             <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
             <Typography variant="caption" style={styles.legendText}>{t('working')}</Typography>
           </View>
           <View style={styles.legendItem}>
             <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
             <Typography variant="caption" style={styles.legendText}>{t('low')}</Typography>
           </View>
           <View style={styles.legendItem}>
             <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
             <Typography variant="caption" style={styles.legendText}>{t('dry')}</Typography>
           </View>
           <View style={styles.legendItem}>
             <View style={[styles.legendDot, { backgroundColor: '#374151' }]} />
             <Typography variant="caption" style={styles.legendText}>{t('broken')}</Typography>
           </View>
         </View>
      </View>
    </View>
  );

  const generateMapHTML = () => {
    const userLocation = location || { latitude: region.latitude, longitude: region.longitude };
    const yourCurrentLocation = t('yourCurrentLocation');
    
    return `<!DOCTYPE html>
<html>
<head>
<title>Water Sources Map</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
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
  background: #f0f4f8;
}
.leaflet-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}
.custom-marker {
  background: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 3px solid;
  position: relative;
}
.custom-marker:hover { 
  transform: scale(1.2) translateY(-5px); 
  box-shadow: 0 8px 16px rgba(0,0,0,0.4);
}
.marker-pulse {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  70% { box-shadow: 0 0 0 12px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}
.leaflet-popup-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 16px;
  min-width: 250px;
}
.leaflet-popup-content h3 {
  margin: 0 0 8px 0;
  color: #0F172A;
  font-size: 16px;
  font-weight: 600;
}
.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin: 8px 0;
}
.map-button {
  background: #3B82F6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 8px;
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s;
}
.map-button:hover {
  background: #2563EB;
}
</style>
</head>
<body>
<div id="map"></div>
<script>
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize map with proper view
  var map = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: true,
    dragging: true,
    tap: true,
    attributionControl: false
  }).setView([${userLocation.latitude}, ${userLocation.longitude}], 13);
  
  // Add tile layer with better visibility
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
    detectRetina: true
  }).addTo(map);
  
  // Add attribution
  L.control.attribution({ prefix: false }).addAttribution('© OpenStreetMap').addTo(map);

  // Function to get status color
  function getStatusColor(status) {
    switch (status) {
      case 'Working': return '#10B981';
      case 'Low water': return '#F59E0B';
      case 'Dry': return '#EF4444';
      case 'Broken': return '#374151';
      default: return '#6B7280';
    }
  }

  // Add water source markers
  var markers = [];
  var waterSources = ${JSON.stringify(filteredSources)};
  
  waterSources.forEach(function(source) {
    var statusColor = getStatusColor(source.status);
    var markerIcon = L.divIcon({
      html: '<div class="custom-marker marker-pulse" style="border-color: ' + statusColor + '">' +
            '<div style="width: 20px; height: 20px; border-radius: 50%; background: ' + statusColor + '; display: flex; align-items: center; justify-content: center;">' +
            '<span style="color: white; font-size: 12px; font-weight: bold;">' + source.type.charAt(0) + '</span>' +
            '</div>' +
            '</div>',
      className: 'custom-div-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
    
    var marker = L.marker([source.latitude, source.longitude], {
      icon: markerIcon,
      title: source.name
    }).addTo(map);
    
    // Removed popup content and binding
    
    marker.on('click', function(e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ 
        type: 'select', 
        id: source.id
      }));
    });
    
    markers.push(marker);
  });

  // Add user location marker with better styling
  var userIcon = L.divIcon({
    html: '<div style="background: #3B82F6; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.3); border: 3px solid white; animation: pulse 2s infinite; position: relative;">' +
          '<span style="font-size: 18px;">📍</span>' +
          '</div>',
    className: 'user-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
  
  var userMarker = L.marker([${userLocation.latitude}, ${userLocation.longitude}], {
    icon: userIcon,
    title: 'Your Location',
    zIndexOffset: 1000
  }).addTo(map);
  
  userMarker.bindPopup('<div style="font-weight: 600; padding: 8px;">' + yourCurrentLocation + '</div>');

  // Fit bounds to show all markers
  if (markers.length > 0) {
    var group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.2));
  }

  // Variable for routing control
  var routingControl = null;

  // Function to add route
  window.addRoute = function(originLat, originLng, destLat, destLng) {
    if (routingControl) {
      map.removeControl(routingControl);
      routingControl = null;
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
      show: false,
      createMarker: function() { return null; },
      addWaypoints: false,
      draggableWaypoints: false
    }).addTo(map);
  };

  // Notify React Native that map is ready
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
});
</script>
</body>
</html>`;
  };

  const renderMapView = () => (
    <View style={styles.mapContainer}>
      {isWeb ? (
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={64} color="#CBD5E1" />
          <Typography variant="h3" style={styles.mapPlaceholderText}>{t('interactiveMap')}</Typography>
          <Typography variant="body" style={styles.mapPlaceholderSubtext}>
            {t('mapViewAvailable')}
          </Typography>
        </View>
      ) : (
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
          scalesPageToFit={true}
          mixedContentMode="always"
          renderLoading={() => (
            <View style={styles.mapLoading}>
              <View style={styles.mapLoadingContent}>
                <Ionicons name="map" size={48} color="#3B82F6" />
                <Typography variant="h3" style={styles.mapLoadingText}>{t('loadingMap')}</Typography>
                <Typography variant="body" style={styles.mapLoadingSubtext}>
                  {t('loadingMapSubtext')}
                </Typography>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );

  const renderListView = () => (
    <View style={[styles.listContainer, { paddingTop: HEADER_COLLAPSED_HEIGHT }]}>
      <Animated.ScrollView
        style={styles.listScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.listHeader}>
          <Typography variant="h2" style={styles.listTitle}>{t('allWaterSources')}</Typography>
          <Typography variant="caption" style={styles.listSubtitle}>
            {t('sourcesFound').replace('{count}', filteredSources.length.toString())}
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
                      {getTranslatedStatus(source.status)}
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
      </Animated.ScrollView>
    </View>
  );

  const FixedDetailsPanel = () => (
    <View style={styles.fixedDetailsPanel}>
      <View style={styles.fixedDetailsHeader}>
        <TouchableOpacity
          style={styles.fixedDetailsCloseButton}
          onPress={() => setShowFixedDetails(false)}
        >
          <Ionicons name="close" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>
      {selectedSource && (
        <ScrollView style={styles.fixedDetailsScroll} showsVerticalScrollIndicator={false}>
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
                  {getTranslatedStatus(selectedSource.status)}
                </Typography>
              </View>
            </View>
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfoGrid}>
            <View style={styles.quickInfoCard}>
              <Ionicons name="location" size={20} color="#3B82F6" />
              <Typography variant="caption" style={styles.quickInfoLabel}>{t('region')}</Typography>
              <Typography variant="body" style={styles.quickInfoValue}>{selectedSource.region}</Typography>
            </View>
            <View style={styles.quickInfoCard}>
              <Ionicons name="navigate" size={20} color="#3B82F6" />
              <Typography variant="caption" style={styles.quickInfoLabel}>{t('distance')}</Typography>
              <Typography variant="body" style={styles.quickInfoValue}>{selectedSource.distance || 'N/A'}</Typography>
            </View>
            <View style={styles.quickInfoCard}>
              <Ionicons name="time" size={20} color="#3B82F6" />
              <Typography variant="caption" style={styles.quickInfoLabel}>{t('lastUpdate')}</Typography>
              <Typography variant="body" style={styles.quickInfoValue}>{selectedSource.lastUpdate}</Typography>
            </View>
            <View style={styles.quickInfoCard}>
              <Ionicons name="water" size={20} color="#3B82F6" />
              <Typography variant="caption" style={styles.quickInfoLabel}>{t('type')}</Typography>
              <Typography variant="body" style={styles.quickInfoValue}>{selectedSource.type}</Typography>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => {
                setShowFixedDetails(false);
                (navigation.navigate as any)('Report', { source: selectedSource });
              }}
            >
              <Ionicons name="create" size={20} color="#3B82F6" />
              <Typography variant="body" style={[styles.actionButtonText, { color: '#3B82F6' }]}>
                {t('reportUpdate')}
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleGetDirections(selectedSource)}
            >
              <Ionicons name="navigate" size={20} color="white" />
              <Typography variant="body" style={styles.actionButtonText}>
                {t('getDirections')}
              </Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
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
        
        {viewMode === 'list' && (
          <TouchableOpacity 
            style={styles.viewToggleButton} 
            onPress={() => setViewMode('map')}
          >
            <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.viewToggleGradient}>
              <Ionicons name="map" size={20} color="white" />
              <Typography variant="caption" style={styles.viewToggleText}>
                {t('viewMap')}
              </Typography>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {showFixedDetails && (
        <TouchableWithoutFeedback onPress={() => setShowFixedDetails(false)}>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        </TouchableWithoutFeedback>
      )}

      {showFixedDetails && selectedSource && <FixedDetailsPanel />}
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
    marginBottom: 10,
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
  statusLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 0,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
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
    backgroundColor: '#f0f4f8',
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 20,
  },
  mapPlaceholderText: {
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
    fontSize: 20,
    fontWeight: '600',
  },
  mapPlaceholderSubtext: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },
  mapLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  mapLoadingContent: {
    alignItems: 'center',
    padding: 20,
  },
  mapLoadingText: {
    color: '#64748B',
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
  },
  mapLoadingSubtext: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 4,
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
    paddingTop: HEADER_COLLAPSED_HEIGHT,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  modalCloseButton: {
    padding: 4,
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
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
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
  fixedDetailsPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  fixedDetailsScroll: {
    flex: 1,
  },
  fixedDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 0,
  },
  fixedDetailsCloseButton: {
    padding: 4,
  },
  fixedDetailsContent: {
    padding: 20,
    paddingTop: 0,
  },
  fixedDetailsMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fixedDetailsIconContainer: {
    marginRight: 16,
  },
  fixedDetailsIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedDetailsText: {
    flex: 1,
  },
  fixedDetailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  fixedDetailsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fixedDetailsStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  fixedDetailsStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fixedDetailsType: {
    color: '#64748B',
    fontSize: 12,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  viewDetailsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
});

export default WaterSourcesMapScreen;