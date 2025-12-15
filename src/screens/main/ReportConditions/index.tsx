import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import BrandColors from '../../../theme';

type ReportType = 'Water Source' | 'Crop Failure' | 'Livestock Deaths' | 'Severe Heat Impacts';

const ReportConditionsScreen: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('Water Source');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationText, setLocationText] = useState('Fetching location...');
  const [photo, setPhoto] = useState(''); // Optional
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationText('Location permission denied');
        setLoadingLocation(false);
        return;
      }

      try {
        let locationData = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
        });
        setLocationText(`${locationData.coords.latitude.toFixed(4)}, ${locationData.coords.longitude.toFixed(4)}`);
      } catch (error) {
        setLocationText('Unable to fetch location');
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  const reportTypes: ReportType[] = [
    'Water Source',
    'Crop Failure',
    'Livestock Deaths',
    'Severe Heat Impacts',
  ];

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description');
      return;
    }

    // Submit report logic here
    Alert.alert('Success', 'Report submitted successfully');
    // Reset form
    setDescription('');
    setLocation(null);
    setLocationText('Fetching location...');
    setLoadingLocation(true);
    setPhoto('');
  };

  const handleAttachPhoto = () => {
    // Photo picker logic
    Alert.alert('Photo', 'Photo attachment feature (to be implemented)');
  };

  return (
    <Layout noPadding>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <Typography variant="h1" style={styles.title}>Report Conditions</Typography>

        <Typography variant="body" style={styles.description}>
          Help improve drought monitoring by reporting conditions in your area.
          Your reports contribute to better decision-making and support for affected communities.
        </Typography>

        <View style={styles.form}>
          <Typography variant="h3" style={styles.label}>Report Type</Typography>
          <View style={styles.typeSelector}>
            {reportTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  reportType === type && styles.selectedTypeButton,
                ]}
                onPress={() => setReportType(type)}
              >
                <Typography
                  variant="body"
                  style={[
                    styles.typeButtonText,
                    reportType === type && styles.selectedTypeButtonText,
                  ]}
                >
                  {type}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Describe the condition (e.g., borehole is dry, crops failing)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor={BrandColors.ui.mutedForeground}
            />
          </View>

          <View style={styles.locationContainer}>
            <View style={styles.locationHeader}>
              <Ionicons name="location" size={20} color={BrandColors.ui.primary} />
              <Typography variant="body" style={styles.locationLabel}>Location (GPS auto-captured):</Typography>
            </View>
            <Typography variant="body" style={styles.locationText}>
              {locationText}
            </Typography>
          </View>

          <View style={styles.photoButtonContainer}>
            <Ionicons name="camera" size={20} color={BrandColors.ui.secondary} style={styles.photoIcon} />
            <Button
              title="Attach Photo (Optional)"
              onPress={handleAttachPhoto}
              variant="secondary"
              style={styles.photoButton}
            />
          </View>

          <Button
            title="Submit Report"
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    flex: 1,
  },
  label: {
    marginBottom: 10,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedTypeButton: {
    backgroundColor: BrandColors.ui.primary,
    borderColor: BrandColors.ui.primary,
  },
  typeButtonText: {
    color: BrandColors.ui.foreground,
  },
  selectedTypeButtonText: {
    color: BrandColors.ui.primaryForeground,
  },
  inputContainer: {
    marginBottom: 15,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
    borderRadius: 8,
    padding: 12,
    color: BrandColors.ui.foreground,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationLabel: {
    marginLeft: 8,
  },
  locationText: {
    backgroundColor: BrandColors.ui.muted,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
  },
  photoButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoIcon: {
    marginRight: 10,
  },
  photoButton: {
    flex: 1,
  },
  submitButton: {
    marginTop: 10,
  },
});

export default ReportConditionsScreen;