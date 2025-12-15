import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import BrandColors from '../../../theme';
import { useTranslation } from '../../../contexts/LanguageContext';

const LanguageSelectScreen: React.FC = () => {
  const navigation = useNavigation();
  const { language, setLanguage, t } = useTranslation();

  const selectLang = (lang: 'en' | 'so') => {
    setLanguage(lang);
    navigation.goBack();
  };

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
        <TouchableOpacity style={styles.option} onPress={() => selectLang('en')}>
          <Typography variant="h2" style={styles.optionText}>{t('english')}</Typography>
          {language === 'en' && <Ionicons name="checkmark" size={24} color={BrandColors.brand.blue} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => selectLang('so')}>
          <Typography variant="h2" style={styles.optionText}>{t('somali')}</Typography>
          {language === 'so' && <Ionicons name="checkmark" size={24} color={BrandColors.brand.blue} />}
        </TouchableOpacity>
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
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: BrandColors.ui.card,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
  },
  optionText: {
    color: BrandColors.ui.foreground,
  },
});

export default LanguageSelectScreen;