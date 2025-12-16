import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, Linking, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import Button from '../../../components/Button';
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
}

const WaterSourcesMapScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedWell, setSelectedWell] = useState<WaterSource | null>(null);
  const [region, setRegion] = useState({
    latitude: 9.5624,
    longitude: 44.0770,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const webViewRef = useRef<WebView | null>(null);


  // Mock data with coordinates for different regions in Somaliland
  const [waterSources, setWaterSources] = useState<WaterSource[]>([
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
  ]);

  const isWeb = Platform.OS === 'web';
  const getMaps = () => {
    if (isWeb) {
      return { MapView: null, Marker: null, PROVIDER_GOOGLE: null };
    } else {
      return { MapView: WebView, Marker: null, PROVIDER_GOOGLE: null };
    }
  };
  const maps = getMaps();
  const MapViewComp = maps.MapView;
  const MarkerComp = maps.Marker;

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
      setRegion({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Working': return '#28a745'; // Green
      case 'Low water': return '#ffc107'; // Yellow
      case 'Dry': return '#dc3545'; // Red
      case 'Broken': return '#000000'; // Black
      default: return '#64748b';
    }
  };

  const getFlowCondition = (status: string) => {
    switch (status) {
      case 'Working': return 'Good flow';
      case 'Low water': return 'Reduced flow';
      case 'Dry': return 'No flow';
      case 'Broken': return 'Damaged';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'Borehole': return 'water';
      case 'Well': return 'water';
      case 'Dam': return 'business';
      case 'Berkad': return 'leaf';
      default: return 'water';
    }
  };


  const handleReportStatus = (source: WaterSource) => {
    // Navigate to report screen with source data
    Alert.alert(
      t('reportStatusTitle'),
      t('reportStatusMessage').replace('{name}', source.name),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('reportStatus'), onPress: () => navigation.navigate('Report' as never) },
      ]
    );
  };

  const handleGetDirections = async (well: WaterSource) => {
    if (!location) {
      Alert.alert(t('errorTitle'), 'Location not available');
      return;
    }
    const js = `addRoute(${location.latitude}, ${location.longitude}, ${well.latitude}, ${well.longitude});`;
    webViewRef.current?.injectJavaScript(js);
    setSelectedWell(null); // Close modal
  };

  const handleReportUpdate = (well: WaterSource) => {
    setSelectedWell(null);
    navigation.navigate('Report' as never);
  };


  return (
    <Layout noPadding>
      <LinearGradient colors={['#0c6dff', '#0056b3']} style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.titleContainer}>
              <Ionicons name="map" size={28} color="white" />
              <Typography variant="h1" style={styles.headerTitle}>{t('waterSourcesMapTitle')}</Typography>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Typography variant="h2" style={styles.statNumber}>{waterSources.filter(w => w.status === 'Working').length}</Typography>
                <Typography variant="caption" style={styles.statLabel}>{t('working')}</Typography>
              </View>
              <View style={styles.statItem}>
                <Typography variant="h2" style={styles.statNumber}>{waterSources.filter(w => w.status === 'Low water').length}</Typography>
                <Typography variant="caption" style={styles.statLabel}>{t('low')}</Typography>
              </View>
              <View style={styles.statItem}>
                <Typography variant="h2" style={styles.statNumber}>{waterSources.filter(w => w.status === 'Dry').length}</Typography>
                <Typography variant="caption" style={styles.statLabel}>{t('dry')}</Typography>
              </View>
            </View>
          </View>
          <View style={styles.legendContainer}>
            <Typography variant="body" style={styles.legendTitle}>{t('statusLegend')}</Typography>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#28a745' }]} />
                <Typography variant="caption" style={styles.legendText}>{t('working')}</Typography>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#ffc107' }]} />
                <Typography variant="caption" style={styles.legendText}>{t('low')}</Typography>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#dc3545' }]} />
                <Typography variant="caption" style={styles.legendText}>{t('dry')}</Typography>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#000000' }]} />
                <Typography variant="caption" style={styles.legendText}>{t('broken')}</Typography>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {isWeb || !MapViewComp ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h1">{isWeb ? 'Map not available on web' : 'Map not available on this device'}</Typography>
            </View>
          ) : (
            <MapViewComp
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
body { margin: 0; padding: 0; }
#map { height: 100vh; width: 100vw; }
.custom-icon { }
.bg-green-500 { background-color: #10b981; }
.bg-yellow-500 { background-color: #f59e0b; }
.bg-red-500 { background-color: #ef4444; }
.bg-gray-800 { background-color: #1f2937; }
.bg-gray-400 { background-color: #9ca3af; }
.w-6 { width: 1.5rem; }
.h-6 { height: 1.5rem; }
.rounded-full { border-radius: 9999px; }
.border-2 { border-width: 2px; }
.border-white { border-color: white; }
.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.leaflet-routing-container { font-size: 16px; background-color: rgba(255, 255, 255, 0.95); border-radius: 8px; }
.leaflet-routing-close-btn { font-size: 24px !important; width: 40px !important; height: 40px !important; background-color: #007bff; color: white; border-radius: 50%; border: none; }
</style>
</head>
<body>
<div id="map"></div>
<script>
var map = L.map('map').setView([${region.latitude}, ${region.longitude}], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function getStatusColor(status) {
  switch (status) {
    case 'Working': return '#10b981';
    case 'Low water': return '#f59e0b';
    case 'Dry': return '#ef4444';
    case 'Broken': return '#1f2937';
    default: return '#9ca3af';
  }
}

${waterSources.map(source => `
L.circleMarker([${source.latitude}, ${source.longitude}], {
  color: getStatusColor('${source.status}'),
  fillColor: getStatusColor('${source.status}'),
  fillOpacity: 0.8,
  radius: 10
}).addTo(map)
    .on('click', function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'select', id: '${source.id}' }));
    });
`).join('')}

var personIcon = L.divIcon({
 html: '<div style="color: blue; font-size: 24px;">👤</div>',
 className: 'person-marker',
 iconSize: [24, 24],
 iconAnchor: [12, 24]
});

function addRoute(originLat, originLng, destLat, destLng) {
  if (window.routingControl) {
    map.removeControl(window.routingControl);
  }
  window.routingControl = L.Routing.control({
    waypoints: [
      L.latLng(originLat, originLng),
      L.latLng(destLat, destLng)
    ],
    routeWhileDragging: false,
    createMarker: function(i, waypoint) {
      if (i === 0) {
        return L.marker(waypoint.latLng, { icon: personIcon });
      }
      return null;
    },
    lineOptions: {
      styles: [{ color: 'blue', weight: 5, opacity: 0.8 }]
    }
  }).addTo(map);
}
</script>
</body>
</html>
`
              }}
              style={styles.map}
              onMessage={(event) => {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  if (data.type === 'select') {
                    const source = waterSources.find(s => s.id === data.id);
                    setSelectedWell(source || null);
                  }
                } catch (e) {
                  console.warn('Failed to parse message', e);
                }
              }}
            />
          )}
        </View>

      </View>

      <Modal
        visible={!!selectedWell}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedWell(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedWell(null)}>
          <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { borderTopColor: selectedWell ? getStatusColor(selectedWell.status) : '#e2e8f0', borderTopWidth: 4, backgroundColor: '#ffffff' }]}>
            {selectedWell && (
              <>
                <View style={[styles.statusHeader, { backgroundColor: getStatusColor(selectedWell.status) + '20', borderBottomColor: '#e2e8f0' }]}>
                  <Ionicons name={getStatusIcon(selectedWell.type)} size={30} color={getStatusColor(selectedWell.status)} />
                  <Typography variant="h2" style={[styles.modalTitle, { color: '#0f172a' }]}>{selectedWell.name}</Typography>
                  <Typography variant="body" style={[styles.statusText, { color: getStatusColor(selectedWell.status) }]}>{selectedWell.status}</Typography>
                </View>

                <View style={styles.modalDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="water" size={16} color="#0c6dff" />
                    <Typography variant="body" style={styles.detailText}>{t('typeLabel')} {selectedWell.type}</Typography>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="location" size={16} color="#0c6dff" />
                    <Typography variant="body" style={styles.detailText}>{t('region')} {selectedWell.region}</Typography>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="time" size={16} color="#0c6dff" />
                    <Typography variant="body" style={styles.detailText}>{t('lastUpdateLabel')} {selectedWell.lastUpdate}</Typography>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="speedometer" size={16} color="#0c6dff" />
                    <Typography variant="body" style={styles.detailText}>{t('flowConditionLabel')} {getFlowCondition(selectedWell.status)}</Typography>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="navigate" size={16} color="#0c6dff" />
                    <Typography variant="body" style={styles.detailText}>{t('distanceLabel')} {selectedWell.distance}</Typography>
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <View style={styles.modalButtonCard}>
                    <LinearGradient colors={['#007bff', '#0056b3']} style={styles.buttonGradient}>
                      <TouchableOpacity style={styles.buttonTouchable} onPress={() => handleGetDirections(selectedWell)}>
                        <Ionicons name="navigate" size={24} color="white" />
                        <Typography variant="body" style={styles.buttonText}>{t('getDirections')}</Typography>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                  <View style={styles.modalButtonCard}>
                    <LinearGradient colors={['#ff8c00', '#e67e00']} style={styles.buttonGradient}>
                      <TouchableOpacity style={styles.buttonTouchable} onPress={() => handleReportUpdate(selectedWell)}>
                        <Ionicons name="create" size={24} color="white" />
                        <Typography variant="body" style={styles.buttonText}>{t('reportUpdate')}</Typography>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                  <View style={styles.modalButtonCard}>
                    <LinearGradient colors={['#6c757d', '#5a6268']} style={styles.buttonGradient}>
                      <TouchableOpacity style={styles.buttonTouchable} onPress={() => setSelectedWell(null)}>
                        <Ionicons name="close" size={24} color="white" />
                        <Typography variant="body" style={styles.buttonText}>{t('close')}</Typography>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
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
    marginBottom: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  legendContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 15,
  },
  legendTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    color: 'white',
    fontSize: 12,
  },
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  statusHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalDetails: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#0f172a',
  },
  modalButtons: {
    padding: 20,
    paddingTop: 0,
  },
  modalButtonCard: {
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    borderRadius: 16,
    padding: 15,
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
});

export default WaterSourcesMapScreen;