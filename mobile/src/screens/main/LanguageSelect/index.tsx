import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';

const LanguageSelectScreen: React.FC = () => {
  const navigation = useNavigation();
  
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [autoTranslate, setAutoTranslate] = useState(true);

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      description: 'International English',
      color: '#3B82F6',
    },
    {
      code: 'so',
      name: 'Somali',
      nativeName: 'Af-Soomaali',
      flag: '🇸🇴',
      description: 'Somali language',
      color: '#10B981',
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      description: 'Arabic language',
      color: '#EF4444',
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      description: 'French language',
      color: '#8B5CF6',
    },
    {
      code: 'sw',
      name: 'Swahili',
      nativeName: 'Kiswahili',
      flag: '🇹🇿',
      description: 'Swahili language',
      color: '#F59E0B',
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      description: 'Spanish language',
      color: '#EC4899',
    },
  ];

  const handleSelectLanguage = (langCode: string) => {
    setSelectedLanguage(langCode);
  };

  const handleApplyLanguage = () => {
    const selectedLang = languages.find(l => l.code === selectedLanguage);
    Alert.alert(
      'Language Changed',
      `App language has been changed to ${selectedLang?.name}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
          style: 'default',
        },
      ]
    );
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage);
  };

  return (
    <Layout style={styles.container} noPadding>
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
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
            <Feather name="arrow-left" size={22} color="white" />
          </TouchableOpacity>
          <Typography style={styles.headerTitle}>Select Language</Typography>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyLanguage}
            activeOpacity={0.8}
          >
            <Typography style={styles.applyButtonText}>Apply</Typography>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Language Card */}
        <View style={styles.currentLanguageCard}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.currentLanguageGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.currentLanguageContent}>
              <View style={styles.currentLanguageIcon}>
                <Feather name="globe" size={24} color="white" />
              </View>
              <View style={styles.currentLanguageText}>
                <Typography style={styles.currentLanguageLabel}>Current Language</Typography>
                <Typography style={styles.currentLanguageName}>
                  {getCurrentLanguage()?.name} ({getCurrentLanguage()?.flag})
                </Typography>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Available Languages */}
        <View style={styles.languagesSection}>
          <Typography style={styles.sectionTitle}>AVAILABLE LANGUAGES</Typography>
          
          <View style={styles.languagesList}>
            {languages.map((lang, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.languageCard,
                  selectedLanguage === lang.code && styles.languageCardSelected,
                ]}
                onPress={() => handleSelectLanguage(lang.code)}
                activeOpacity={0.7}
              >
                <View style={styles.languageCardContent}>
                  <View style={[styles.languageFlag, { backgroundColor: lang.color + '15' }]}>
                    <Typography style={styles.flagText}>{lang.flag}</Typography>
                  </View>
                  
                  <View style={styles.languageInfo}>
                    <Typography style={styles.languageName}>{lang.name}</Typography>
                    <Typography style={styles.languageNative}>{lang.nativeName}</Typography>
                    <Typography style={styles.languageDescription}>{lang.description}</Typography>
                  </View>

                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioOuter,
                        { borderColor: selectedLanguage === lang.code ? lang.color : '#CBD5E1' },
                      ]}
                    >
                      {selectedLanguage === lang.code && (
                        <View
                          style={[
                            styles.radioInner,
                            { backgroundColor: lang.color },
                          ]}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Auto Translate */}
        <View style={styles.autoTranslateCard}>
          <View style={styles.autoTranslateContent}>
            <View style={[styles.autoTranslateIcon, { backgroundColor: '#8b5cf615' }]}>
              <MaterialCommunityIcons name="translate" size={24} color="#8B5CF6" />
            </View>
            <View style={styles.autoTranslateText}>
              <Typography style={styles.autoTranslateTitle}>Auto-Translate</Typography>
              <Typography style={styles.autoTranslateDescription}>
                Automatically translate content when available
              </Typography>
            </View>
            <Switch
              value={autoTranslate}
              onValueChange={() => setAutoTranslate(!autoTranslate)}
              trackColor={{ false: '#e2e8f0', true: '#ddd6fe' }}
              thumbColor={autoTranslate ? '#8B5CF6' : '#94a3b8'}
              ios_backgroundColor="#e2e8f0"
            />
          </View>
        </View>

        {/* Note */}
        <View style={styles.noteCard}>
          <View style={styles.noteIcon}>
            <Feather name="info" size={18} color="#F59E0B" />
          </View>
          <Typography style={styles.noteText}>
            Changing the language will update all text in the app. Some features may require a restart.
          </Typography>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 16,
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
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  // Current Language Card
  currentLanguageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  currentLanguageGradient: {
    padding: 20,
  },
  currentLanguageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLanguageIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  currentLanguageText: {
    flex: 1,
  },
  currentLanguageLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 4,
  },
  currentLanguageName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  // Languages Section
  languagesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 14,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  languagesList: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  languageCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: 'white',
  },
  languageCardSelected: {
    backgroundColor: '#F8FAFC',
  },
  languageCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  flagText: {
    fontSize: 24,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2,
  },
  languageDescription: {
    fontSize: 11,
    color: '#94a3b8',
  },
  radioContainer: {
    marginLeft: 12,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  // Auto Translate Card
  autoTranslateCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  autoTranslateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoTranslateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  autoTranslateText: {
    flex: 1,
  },
  autoTranslateTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  autoTranslateDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  // Note Card
  noteCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  noteIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
});

export default LanguageSelectScreen;