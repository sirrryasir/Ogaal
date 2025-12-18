import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';

const AccountSettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    Alert.alert(
      'Profile Updated',
      'Your changes have been saved successfully.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <Layout style={styles.container} noPadding>
      {/* Header - Fixed to use more screen width */}
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
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
          <Typography style={styles.headerTitle}>Account Settings</Typography>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Typography style={styles.saveButtonText}>Save</Typography>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Section - Better spacing */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#F59E0B', '#F97316']}
                style={styles.avatar}
              >
                <Typography style={styles.avatarText}>JD</Typography>
              </LinearGradient>
              <TouchableOpacity style={styles.cameraButton}>
                <Feather name="camera" size={18} color="white" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.changePhotoButton}>
              <Typography style={styles.changePhotoText}>Change Profile Photo</Typography>
            </TouchableOpacity>
          </View>

          {/* Form Section - Better edge alignment */}
          <View style={styles.formSection}>
            {/* Personal Information */}
            <View style={styles.formGroup}>
              <Typography style={styles.formLabel}>PERSONAL INFORMATION</Typography>
              
              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, styles.halfInput]}>
                  <Typography style={styles.inputLabel}>First Name</Typography>
                  <TextInput
                    style={styles.input}
                    value={formData.firstName}
                    onChangeText={(value) => updateField('firstName', value)}
                    placeholder="Enter first name"
                  />
                </View>
                
                <View style={[styles.inputContainer, styles.halfInput]}>
                  <Typography style={styles.inputLabel}>Last Name</Typography>
                  <TextInput
                    style={styles.input}
                    value={formData.lastName}
                    onChangeText={(value) => updateField('lastName', value)}
                    placeholder="Enter last name"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Typography style={styles.inputLabel}>Email Address</Typography>
                <View style={styles.inputWithIcon}>
                  <MaterialIcons name="email" size={20} color="#94A3B8" />
                  <TextInput
                    style={[styles.input, styles.inputWithIconText]}
                    value={formData.email}
                    onChangeText={(value) => updateField('email', value)}
                    placeholder="Enter email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Typography style={styles.inputLabel}>Phone Number</Typography>
                <View style={styles.inputWithIcon}>
                  <MaterialIcons name="phone" size={20} color="#94A3B8" />
                  <TextInput
                    style={[styles.input, styles.inputWithIconText]}
                    value={formData.phone}
                    onChangeText={(value) => updateField('phone', value)}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Typography style={styles.inputLabel}>Location</Typography>
                <View style={styles.inputWithIcon}>
                  <Feather name="map-pin" size={20} color="#94A3B8" />
                  <TextInput
                    style={[styles.input, styles.inputWithIconText]}
                    value={formData.location}
                    onChangeText={(value) => updateField('location', value)}
                    placeholder="Enter your location"
                  />
                </View>
              </View>
            </View>

            {/* Security Options */}
            <View style={styles.optionsSection}>
              <Typography style={styles.sectionTitle}>SECURITY</Typography>
              
              <TouchableOpacity style={styles.optionCard}>
                <View style={styles.optionIcon}>
                  <Feather name="lock" size={22} color="#10B981" />
                </View>
                <View style={styles.optionText}>
                  <Typography style={styles.optionTitle}>Change Password</Typography>
                  <Typography style={styles.optionSubtitle}>Update your password regularly</Typography>
                </View>
                <Feather name="chevron-right" size={20} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionCard}>
                <View style={styles.optionIcon}>
                  <MaterialIcons name="security" size={22} color="#3B82F6" />
                </View>
                <View style={styles.optionText}>
                  <Typography style={styles.optionTitle}>Two-Factor Authentication</Typography>
                  <Typography style={styles.optionSubtitle}>Add extra security to your account</Typography>
                </View>
                <Feather name="chevron-right" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Danger Zone */}
            <View style={styles.dangerSection}>
              <Typography style={styles.dangerTitle}>DANGER ZONE</Typography>
              
              <TouchableOpacity style={styles.dangerCard}>
                <View style={styles.dangerIcon}>
                  <Feather name="trash-2" size={22} color="#EF4444" />
                </View>
                <View style={styles.dangerText}>
                  <Typography style={styles.dangerCardTitle}>Delete Account</Typography>
                  <Typography style={styles.dangerCardSubtitle}>Permanently delete your account</Typography>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  // Header - Better edge alignment
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 16, // Reduced from 24
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  // Profile Section
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  // Form Section - Better edge alignment
  formSection: {
    paddingHorizontal: 16, // Reduced from 24
  },
  formGroup: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20, // Reduced from 24
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    fontSize: 15,
    color: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWithIconText: {
    flex: 1,
    marginLeft: 12,
    paddingLeft: 0,
  },
  // Options Section
  optionsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  // Danger Zone
  dangerSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dangerTitle: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  dangerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dangerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dangerText: {
    flex: 1,
  },
  dangerCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 2,
  },
  dangerCardSubtitle: {
    fontSize: 12,
    color: '#EF4444',
  },
});

export default AccountSettingsScreen;