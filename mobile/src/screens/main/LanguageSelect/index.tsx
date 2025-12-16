import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
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
      flag: '🇬🇧',
      nativeName: 'English',
      gradient: ['#667eea', '#764ba2'],
      description: 'International language',
    },
    {
      code: 'so' as const,
      name: t('somali'),
      flag: '🇸🇴',
      nativeName: 'Soomaali',
      gradient: ['#f093fb', '#f5576c'],
      description: 'Native language',
    },
  ];

  return (
    <Layout style={styles.container} noPadding>
      {/* Header */}
      <LinearGradient 
        colors={['#0c6dff', '#4f46e5']} 
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={22} color="white" />
            </TouchableOpacity>
            
            <View style={styles.titleContainer}>
              <View style={styles.titleIcon}>
                <Ionicons name="language" size={20} color="white" />
              </View>
              <Typography variant="h1" style={styles.headerTitle}>
                {t('selectLanguage')}
              </Typography>
            </View>
            
            <View style={styles.rightPlaceholder} />
          </View>
          
          <Typography variant="body" style={styles.headerSubtitle}>
            {t('selectPreferredLanguage')}
          </Typography>
        </View>
        
        {/* Curved bottom */}
        <View style={styles.headerCurve} />
      </LinearGradient>

      {/* Language Selection Cards */}
      <View style={styles.content}>
        <View style={styles.languageGrid}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageCard,
                language === lang.code && styles.selectedCard
              ]}
              onPress={() => selectLang(lang.code)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={lang.gradient as any}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Selected indicator */}
                {language === lang.code && (
                  <View style={styles.selectedBadge}>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Typography variant="caption" style={styles.selectedText}>
                      Current
                    </Typography>
                  </View>
                )}
                
                <View style={styles.cardContent}>
                  {/* Flag & Icon */}
                  <View style={styles.flagContainer}>
                    <Typography variant="h1" style={styles.flag}>
                      {lang.flag}
                    </Typography>
                    <View style={styles.languageIcon}>
                      <Ionicons name="language" size={18} color={lang.gradient[0]} />
                    </View>
                  </View>
                  
                  {/* Language Info */}
                  <View style={styles.languageInfo}>
                    <Typography variant="h3" style={styles.languageName}>
                      {lang.name}
                    </Typography>
                    <Typography variant="caption" style={styles.nativeName}>
                      {lang.nativeName}
                    </Typography>
                    <Typography variant="caption" style={styles.description}>
                      {lang.description}
                    </Typography>
                  </View>
                  
                  {/* Select indicator */}
                  <View style={styles.selectIndicator}>
                    {language === lang.code ? (
                      <View style={styles.selectedCircle}>
                        <Ionicons name="checkmark" size={16} color="white" />
                      </View>
                    ) : (
                      <View style={styles.unselectedCircle} />
                    )}
                  </View>
                </View>
                
                {/* Decorative corner */}
                <View style={styles.decorativeCorner} />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Help text */}
        <View style={styles.helpContainer}>
          <Feather name="info" size={16} color="#64748b" />
          <Typography variant="caption" style={styles.helpText}>
            {t('languageChangeWarning')}
          </Typography>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // Header Styles
  headerGradient: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  titleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.3,
  },
  rightPlaceholder: {
    width: 40,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
  headerCurve: {
    height: 20,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  // Content Styles
  content: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  languageGrid: {
    gap: 16,
  },
  languageCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
  },
  selectedCard: {
    shadowColor: '#0c6dff',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    transform: [{ scale: 1.02 }],
  },
  cardGradient: {
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  selectedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagContainer: {
    position: 'relative',
    marginRight: 16,
  },
  flag: {
    fontSize: 48,
    marginBottom: 8,
  },
  languageIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  nativeName: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontStyle: 'italic',
  },
  selectIndicator: {
    marginLeft: 12,
  },
  selectedCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  unselectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  decorativeCorner: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  helpText: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
});

export default LanguageSelectScreen;