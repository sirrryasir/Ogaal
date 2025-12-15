import React, { useState, useEffect } from 'react';
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


  // Mock data with coordinates around Hargeisa, Somaliland
  const [waterSources, setWaterSources] = useState<WaterSource[]>([
    { id: '1', type: 'Borehole', name: 'Borehole A1', status: 'Working', lastUpdate: '2 hours ago', distance: '2.5 km', latitude: 9.5624, longitude: 44.0770 },
    { id: '2', type: 'Well', name: 'Well B2', status: 'Low water', lastUpdate: '1 day ago', distance: '3.1 km', latitude: 9.5650, longitude: 44.0800 },
    { id: '3', type: 'Dam', name: 'Dam C3', status: 'Dry', lastUpdate: '3 days ago', distance: '5.0 km', latitude: 9.5600, longitude: 44.0750 },
    { id: '4', type: 'Berkad', name: 'Berkad D4', status: 'Broken', lastUpdate: '1 week ago', distance: '1.8 km', latitude: 9.5630, longitude: 44.0780 },
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
    const origin = `${location.latitude},${location.longitude}`;
    const destination = `${well.latitude},${well.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;

    try {
      await Linking.openURL(url);
      setSelectedWell(null); // Close modal
    } catch (error) {
      Alert.alert(t('errorTitle'), 'Unable to open maps');
    }
  };

  const handleReportUpdate = (well: WaterSource) => {
    setSelectedWell(null);
    navigation.navigate('Report' as never);
  };


  return (
    <Layout noPadding>
      <View style={[styles.topBar, { backgroundColor: '#f8fafc', borderBottomColor: '#e2e8f0' }]}>
        <Typography variant="h1" style={[styles.topBarTitle, { color: '#0c6dff' }]}>{t('waterSourcesMapTitle')}</Typography>
        <TouchableOpacity style={styles.topBarRight} onPress={() => navigation.navigate('Notifications' as never)}>
          <MaterialIcons name="notifications" size={24} color={'#0c6dff'} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {isWeb || !MapViewComp ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h1">{isWeb ? 'Map not available on web' : 'Map not available on this device'}</Typography>
            </View>
          ) : (
            <MapViewComp
              source={{
                html: `
<!DOCTYPE html>
<html>
<head>
<title>Water Sources Map</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
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
                  <Typography variant="body" style={styles.modalText}>{t('typeLabel')} {selectedWell.type}</Typography>
                  <Typography variant="body" style={styles.modalText}>{t('lastUpdateLabel')} {selectedWell.lastUpdate}</Typography>
                  <Typography variant="body" style={styles.modalText}>{t('flowConditionLabel')} {getFlowCondition(selectedWell.status)}</Typography>
                  <Typography variant="body" style={styles.modalText}>{t('distanceLabel')} {selectedWell.distance}</Typography>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  topBarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  topBarRight: {
    // For future icons
  },
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 2,
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
    minHeight: 350,
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
  modalText: {
    marginBottom: 10,
    fontSize: 16,
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