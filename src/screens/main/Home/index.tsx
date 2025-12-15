import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import Button from '../../../components/Button';
import BrandColors from '../../../theme';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  // Mock data - in real app, fetch from API
  const droughtLevel = 'Moderate'; // Normal, Mild, Moderate, Severe, Extreme
  const explanation = 'Rainfall is below average. Soil moisture is low.';

  const getDroughtColor = (level: string) => {
    switch (level) {
      case 'Normal': return BrandColors.brand.success;
      case 'Mild': return BrandColors.brand.warning;
      case 'Moderate': return '#ff8c00'; // Orange
      case 'Severe': return BrandColors.brand.danger;
      case 'Extreme': return '#8b0000'; // Dark red
      default: return BrandColors.brand.success;
    }
  };

  const handleWhatToDo = () => {
    // Navigate to Actions & Guidance
    navigation.navigate('Actions' as never);
  };

  const handleViewWaterSources = () => {
    // Navigate to Water Sources Map
    navigation.navigate('WaterSources' as never);
  };

  const handleReportImpact = () => {
    // Navigate to Report Conditions
    navigation.navigate('Report' as never);
  };

  return (
    <Layout noPadding>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <Typography variant="h1" style={styles.title}>Drought Status Dashboard</Typography>

        <View style={[styles.droughtCard, { backgroundColor: getDroughtColor(droughtLevel) }]}>
          <Typography variant="h2" color="primaryForeground" style={styles.droughtLevel}>
            {droughtLevel} Drought
          </Typography>
          <Typography variant="body" color="primaryForeground" style={styles.explanation}>
            {explanation}
          </Typography>
        </View>

        <View style={styles.actionsContainer}>
          <View style={styles.actionButtonContainer}>
            <Ionicons name="help-circle" size={24} color={BrandColors.ui.primaryForeground} style={styles.actionIcon} />
            <Button
              title="What should I do now?"
              onPress={handleWhatToDo}
              style={styles.actionButton}
            />
          </View>
          <View style={styles.actionButtonContainer}>
            <Ionicons name="water" size={24} color={BrandColors.ui.secondaryForeground} style={styles.actionIcon} />
            <Button
              title="View nearby water sources"
              onPress={handleViewWaterSources}
              variant="secondary"
              style={styles.actionButton}
            />
          </View>
          <View style={styles.actionButtonContainer}>
            <Ionicons name="warning" size={24} color={BrandColors.ui.secondaryForeground} style={styles.actionIcon} />
            <Button
              title="Report drought impact"
              onPress={handleReportImpact}
              variant="secondary"
              style={styles.actionButton}
            />
          </View>
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
    alignItems: 'center',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  droughtCard: {
    width: '100%',
    padding: 30,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  droughtLevel: {
    marginBottom: 10,
  },
  explanation: {
    textAlign: 'center',
  },
  actionsContainer: {
    width: '100%',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionButton: {
    flex: 1,
  },
});

export default HomeScreen;