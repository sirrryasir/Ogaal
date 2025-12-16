import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
const BrandColors = require('../../../theme');
import { useTranslation } from '../../../contexts/LanguageContext';

const ReportConditionsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [waterSourceType, setWaterSourceType] = useState('Borehole');
  const [villageLocation, setVillageLocation] = useState('');
  const [reportDetail, setReportDetail] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationText, setLocationText] = useState('Fetching location...');
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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


  const handleSubmit = async () => {
    if (!reportDetail.trim()) {
      Alert.alert(t('errorTitle'), t('errorMessage'));
      return;
    }

    setSubmitting(true);
    // Simulate submit
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    Alert.alert(t('successTitle'), t('successMessage'));
    // Reset form
    setWaterSourceType('Borehole');
    setVillageLocation('');
    setReportDetail('');
    setLocation(null);
    setLocationText('Fetching location...');
    setLoadingLocation(true);
    setPhotoUri(null);
    setSubmitting(false);
  };

  const handleAttachPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted === false) {
      Alert.alert(t('permissionDenied'), t('permissionDenied'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      uploadToUploadcare(uri);
    }
  };

  const uploadToUploadcare = async (uri: string) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('UPLOADCARE_PUB_KEY', 'db5971bb8db82d86a6b6');
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);

    try {
      const response = await fetch('https://upload.uploadcare.com/base/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setPhotoUri(`https://ucarecdn.com/${data.file}/`);
      Alert.alert(t('successTitle'), t('uploadSuccess'));
    } catch (error) {
      Alert.alert(t('errorTitle'), t('uploadError'));
    } finally {
      setUploading(false);
    }
  };

  const steps = [
    { icon: 'water', title: 'Source Type', completed: waterSourceType !== 'Borehole' },
    { icon: 'location', title: 'Location', completed: villageLocation.length > 0 },
    { icon: 'document-text', title: 'Details', completed: reportDetail.length > 0 },
    { icon: 'camera', title: 'Photo', completed: !!photoUri },
  ];

  const completedSteps = steps.filter(step => step.completed).length;

  return (
    <Layout noPadding>
      <LinearGradient colors={['#0c6dff', '#0056b3']} style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.titleContainer}>
              <Ionicons name="create" size={28} color="white" />
              <Typography variant="h1" style={styles.headerTitle}>{t('reportConditionsTitle')}</Typography>
            </View>
            <View style={styles.progressContainer}>
              <Typography variant="caption" style={styles.progressText}>
                {completedSteps}/{steps.length} Complete
              </Typography>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(completedSteps / steps.length) * 100}%` }]} />
              </View>
            </View>
          </View>

          <View style={styles.stepsContainer}>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={[styles.stepIcon, step.completed && styles.stepCompleted]}>
                  <Ionicons name={step.icon as any} size={16} color={step.completed ? "white" : "#0c6dff"} />
                </View>
                <Typography variant="caption" style={[styles.stepText, step.completed && styles.stepTextCompleted]}>
                  {step.title}
                </Typography>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeCard}>
          <LinearGradient colors={['#f0f7ff', '#ffffff']} style={styles.welcomeGradient}>
            <View style={styles.welcomeContent}>
              <Ionicons name="heart" size={24} color={BrandColors.brand.blue} />
              <Typography variant="h3" style={styles.welcomeTitle}>Help Your Community</Typography>
              <Typography variant="body" style={styles.welcomeText}>
                Your reports help improve drought monitoring and support affected communities with better decision-making.
              </Typography>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.formContainer}>
          {/* Water Source Type */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="water" size={20} color="white" />
              </View>
              <Typography variant="h3" style={styles.sectionTitle}>{t('waterSourceType')}</Typography>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={waterSourceType}
                onValueChange={(itemValue: string) => setWaterSourceType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="🏭 Borehole" value="Borehole" />
                <Picker.Item label="🏞️ Well" value="Well" />
                <Picker.Item label="🌊 Berkad" value="Berkad" />
                <Picker.Item label="🏗️ Dam" value="Dam" />
              </Picker>
            </View>
          </View>

          {/* Location */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="location" size={20} color="white" />
              </View>
              <Typography variant="h3" style={styles.sectionTitle}>{t('villageLocation')}</Typography>
            </View>
            <Input
              placeholder="Enter village or location name"
              value={villageLocation}
              onChangeText={setVillageLocation}
            />
          </View>

          {/* Report Details */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="document-text" size={20} color="white" />
              </View>
              <Typography variant="h3" style={styles.sectionTitle}>{t('reportDetail')}</Typography>
            </View>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Describe the water source condition (e.g., borehole is dry, well has low water)"
              value={reportDetail}
              onChangeText={setReportDetail}
              multiline
              numberOfLines={4}
              placeholderTextColor={BrandColors.ui.mutedForeground}
            />
          </View>

          {/* GPS Location */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="navigate" size={20} color="white" />
              </View>
              <Typography variant="h3" style={styles.sectionTitle}>GPS Location</Typography>
            </View>
            <View style={styles.locationDisplay}>
              <Ionicons name={loadingLocation ? "refresh" : "location"} size={20} color={BrandColors.brand.blue} />
              <Typography variant="body" style={styles.locationText}>
                {locationText}
              </Typography>
            </View>
          </View>

          {/* Photo Upload */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="camera" size={20} color="white" />
              </View>
              <Typography variant="h3" style={styles.sectionTitle}>{t('photoOptional')}</Typography>
            </View>

            {photoUri ? (
              <View style={styles.photoPreview}>
                <Image source={{ uri: photoUri }} style={styles.photoImage} />
                <TouchableOpacity style={styles.removePhotoButton} onPress={() => setPhotoUri(null)}>
                  <Ionicons name="close-circle" size={24} color="#dc3545" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.photoUpload} onPress={handleAttachPhoto} disabled={uploading}>
                <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.photoGradient}>
                  <Ionicons name={uploading ? "hourglass" : "camera"} size={32} color="white" />
                  <Typography variant="body" style={styles.photoText}>
                    {uploading ? t('uploading') : 'Add Photo'}
                  </Typography>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <LinearGradient colors={completedSteps === steps.length ? ['#28a745', '#20c997'] : ['#007bff', '#0056b3']} style={styles.submitGradient}>
            <TouchableOpacity
              style={styles.submitTouchable}
              onPress={handleSubmit}
              disabled={submitting || completedSteps < steps.length}
            >
              <Ionicons name={submitting ? "hourglass" : "send"} size={24} color="white" style={styles.submitIcon} />
              <Typography variant="h3" style={styles.submitText}>
                {submitting ? t('submitting') : completedSteps === steps.length ? 'Submit Report' : `Complete ${steps.length - completedSteps} More Steps`}
              </Typography>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 25,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressText: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  progressBar: {
    width: 80,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  stepCompleted: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  stepText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    textAlign: 'center',
  },
  stepTextCompleted: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeCard: {
    marginBottom: 25,
  },
  welcomeGradient: {
    borderRadius: 16,
    padding: 20,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeTitle: {
    color: BrandColors.brand.blue,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    color: BrandColors.ui.foreground,
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    gap: 20,
  },
  sectionCard: {
    backgroundColor: BrandColors.ui.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BrandColors.brand.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BrandColors.ui.foreground,
    marginLeft: 12,
  },
  pickerContainer: {
    marginTop: 5,
  },
  picker: {
    height: 50,
    color: BrandColors.ui.foreground,
    backgroundColor: BrandColors.ui.input,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  inputField: {
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
    borderRadius: 12,
    padding: 15,
    color: BrandColors.ui.foreground,
    fontSize: 16,
    backgroundColor: BrandColors.ui.input,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
    borderRadius: 12,
    padding: 15,
    color: BrandColors.ui.foreground,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: BrandColors.ui.input,
  },
  locationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.ui.muted,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
  },
  locationText: {
    marginLeft: 10,
    color: BrandColors.ui.foreground,
    flex: 1,
  },
  photoPreview: {
    position: 'relative',
    alignItems: 'center',
  },
  photoImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  photoUpload: {
    alignItems: 'center',
  },
  photoGradient: {
    width: '100%',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  photoText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
  },
  submitContainer: {
    marginTop: 10,
  },
  submitGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  submitTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  submitIcon: {
    marginRight: 10,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ReportConditionsScreen;