import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
const BrandColors = require('../../../theme');
import { useTranslation } from '../../../contexts/LanguageContext';

const LanguageSelectScreen: React.FC = () => {
  const navigation = useNavigation();
  const { language, setLanguage, t } = useTranslation();

  const selectLang = (lang: 'en' | 'so') => {
    setLanguage(lang);
    navigation.goBack();
  };

  const languages = [
    {
      code: 'en' as const,
      name: t('english'),
      flag: '🇺🇸',
      nativeName: 'English',
      gradient: ['#667eea', '#764ba2'],
    },
    {
      code: 'so' as const,
      name: t('somali'),
      // flag: '🇸🇴',
      nativeName: 'Soomaali',
      gradient: ['#f093fb', '#f5576c'],
    },
  ];

  return (
    <Layout>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBarLeft} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={BrandColors.brand.blue} />
        </TouchableOpacity>
        <Typography variant="h1" style={styles.topBarTitle}>{t('selectLanguage')}</Typography>
        <View style={styles.topBarRight} />
      </View>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <Ionicons name="language" size={60} color={BrandColors.brand.blue} style={styles.headerIcon} />
          <Typography variant="h2" style={styles.headerTitle}>{t('chooseLanguageTitle')}</Typography>
          <Typography variant="body" style={styles.headerSubtitle}>{t('selectPreferredLanguage')}</Typography>
        </View>

        <View style={styles.languagesSection}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageCard,
                language === lang.code && styles.selectedCard
              ]}
              onPress={() => selectLang(lang.code)}
            >
              <LinearGradient
                colors={lang.gradient as any}
                style={styles.languageGradient}
              >
                <View style={styles.languageContent}>
                  <Text style={styles.flag}>{lang.flag}</Text>
                  <View style={styles.textContainer}>
                    <Typography variant="h3" style={styles.languageName}>
                      {lang.name}
                    </Typography>
                    <Typography variant="caption" style={styles.nativeName}>
                      {lang.nativeName}
                    </Typography>
                  </View>
                  {language === lang.code && (
                    <View style={styles.checkmarkContainer}>
                      <Ionicons name="checkmark-circle" size={24} color="white" />
                    </View>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: BrandColors.app.bodyBackground,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.ui.border,
  },
  topBarLeft: {
    width: 40,
    alignItems: 'center',
  },
  topBarTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: BrandColors.brand.blue,
    textAlign: 'center',
  },
  topBarRight: {
    width: 40,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  headerIcon: {
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BrandColors.brand.blue,
    marginBottom: 5,
  },
  headerSubtitle: {
    color: BrandColors.ui.secondaryForeground,
    textAlign: 'center',
  },
  languagesSection: {
    gap: 15,
  },
  languageCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  selectedCard: {
    shadowColor: BrandColors.brand.blue,
    shadowOpacity: 0.3,
    elevation: 8,
  },
  languageGradient: {
    borderRadius: 16,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  flag: {
    fontSize: 40,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  languageName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  nativeName: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  checkmarkContainer: {
    marginLeft: 10,
  },
});

export default LanguageSelectScreen;