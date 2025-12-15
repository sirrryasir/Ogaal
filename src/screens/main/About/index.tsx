import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import BrandColors from '../../../theme';
import { useTranslation } from '../../../contexts/LanguageContext';

const AboutScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <Layout>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBarLeft} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={BrandColors.brand.blue} />
        </TouchableOpacity>
        <Typography variant="h1" style={styles.topBarTitle}>{t('aboutTitle')}</Typography>
        <View style={styles.topBarRight} />
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Ionicons name="water" size={80} color={BrandColors.brand.blue} style={styles.logo} />
          <Typography variant="h1" style={styles.appName}>{t('appName')}</Typography>
          <Typography variant="body" style={styles.version}>{t('version')}</Typography>
          <Typography variant="body" style={styles.description}>
            {t('description')}
          </Typography>
          <Typography variant="h2" style={styles.sectionTitle}>{t('features')}</Typography>
          <Typography variant="body" style={styles.feature}>
            {t('feature1')}
          </Typography>
          <Typography variant="body" style={styles.feature}>
            {t('feature2')}
          </Typography>
          <Typography variant="body" style={styles.feature}>
            {t('feature3')}
          </Typography>
          <Typography variant="body" style={styles.feature}>
            {t('feature4')}
          </Typography>
          <Typography variant="h2" style={styles.sectionTitle}>{t('contact')}</Typography>
          <Typography variant="body" style={styles.contact}>
            {t('contactText')}
          </Typography>
        </View>
      </ScrollView>
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
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BrandColors.brand.blue,
    marginBottom: 10,
  },
  version: {
    fontSize: 16,
    color: BrandColors.ui.secondaryForeground,
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    color: BrandColors.ui.foreground,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BrandColors.brand.blue,
    alignSelf: 'flex-start',
    marginBottom: 15,
    marginTop: 20,
  },
  feature: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    color: BrandColors.ui.foreground,
  },
  contact: {
    textAlign: 'center',
    color: BrandColors.ui.foreground,
  },
});

export default AboutScreen;