import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import { useTranslation } from '../../../contexts/LanguageContext';

const LanguageSelectScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t, language, setLanguage } = useTranslation();
  
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      description: 'International English',
    },
    {
      code: 'so',
      name: 'Somali',
      nativeName: 'Af-Soomaali',
      flag: '🇸🇴',
      description: 'Somali language',
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      description: 'Arabic language',
    },
    {
      code: 'sw',
      name: 'Swahili',
      nativeName: 'Kiswahili',
      flag: '🇹🇿',
      description: 'Swahili language',
    },
  ];

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
  };

  const handleApplyLanguage = () => {
    if (selectedLanguage !== language) {
    //   setLanguage(selectedLanguage);
      Alert.alert(
        'Language Changed',
        `App language changed to ${languages.find(l => l.code === selectedLanguage)?.name}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <Layout style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#4f46e5" />
        </TouchableOpacity>
        <Typography variant="h1" style={styles.headerTitle}>
          Select Language
        </Typography>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Current Language Indicator */}
        <View style={styles.currentLanguageCard}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.currentLanguageGradient}
          >
            <View style={styles.currentLanguageContent}>
              <Feather name="globe" size={24} color="white" />
              <View style={styles.currentLanguageText}>
                <Typography variant="h3" style={styles.currentLanguageTitle}>
                  Current Language
                </Typography>
                <Typography variant="caption" style={styles.currentLanguageName}>
                  {languages.find(l => l.code === language)?.name} ({language.toUpperCase()})
                </Typography>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Language Options */}
        <View style={styles.languagesContainer}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageOption,
                selectedLanguage === lang.code && styles.languageOptionSelected,
              ]}
              onPress={() => handleLanguageSelect(lang.code)}
              activeOpacity={0.7}
            >
              <View style={styles.languageOptionContent}>
                {/* Flag */}
                <View style={styles.languageFlag}>
                  <Typography variant="h1" style={styles.flagText}>
                    {lang.flag}
                  </Typography>
                </View>
                
                {/* Language Info */}
                <View style={styles.languageInfo}>
                  {/* <Typography variant="h4" style={styles.languageName}>
                    {lang.name}
                  </Typography> */}
                  <Typography style={styles.languageName}>
                    {lang.name}
                  </Typography>
                  <Typography variant="caption" style={styles.languageNative}>
                    {lang.nativeName}
                  </Typography>
                  <Typography variant="caption" style={styles.languageDescription}>
                    {lang.description}
                  </Typography>
                </View>
                
                {/* Radio Button */}
                <View style={styles.radioContainer}>
                  <View
                    style={[
                      styles.radioOuter,
                      selectedLanguage === lang.code && styles.radioOuterSelected,
                    ]}
                  >
                    {selectedLanguage === lang.code && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Apply Button */}
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyLanguage}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.applyButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Typography variant="h3" style={styles.applyButtonText}>
              Apply Language
            </Typography>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  currentLanguageCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
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
  currentLanguageText: {
    marginLeft: 16,
  },
  currentLanguageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  currentLanguageName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  languagesContainer: {
    marginBottom: 24,
  },
  languageOption: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageOptionSelected: {
    borderColor: '#667eea',
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
  },
  languageOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  flagText: {
    fontSize: 32,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 2,
  },
  languageDescription: {
    fontSize: 12,
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
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#667eea',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#667eea',
  },
  applyButton: {
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 16,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 16,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default LanguageSelectScreen;