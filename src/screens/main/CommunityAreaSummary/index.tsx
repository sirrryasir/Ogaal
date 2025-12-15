import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import BrandColors from '../../../theme';

interface SummaryData {
  droughtTrend: string;
  affectedHouseholds: number;
  waterSourceAvailability: string;
  riskOutlook: string;
}

const CommunityAreaSummaryScreen: React.FC = () => {
  // Mock data
  const summaryData: SummaryData = {
    droughtTrend: 'Increasing over last 3 months',
    affectedHouseholds: 1250,
    waterSourceAvailability: 'Declining - 40% of sources low or dry',
    riskOutlook: 'High risk of severe impacts in next month',
  };

  const trendData = [
    { month: '3 months ago', level: 'Mild', color: BrandColors.brand.warning },
    { month: '2 months ago', level: 'Moderate', color: '#ff8c00' },
    { month: '1 month ago', level: 'Severe', color: BrandColors.brand.danger },
    { month: 'Current', level: 'Severe', color: BrandColors.brand.danger },
  ];

  return (
    <Layout noPadding>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <Typography variant="h1" style={styles.title}>Community / Area Summary</Typography>

        <View style={styles.summaryCard}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="trending-up" size={20} color={BrandColors.ui.primary} style={styles.cardIcon} />
            <Typography variant="h2" style={styles.cardTitle}>Drought Trend (Last 3 Months)</Typography>
          </View>
          <View style={styles.trendContainer}>
            {trendData.map((item, index) => (
              <View key={index} style={styles.trendItem}>
                <View style={[styles.trendBar, { backgroundColor: item.color }]} />
                <Typography variant="caption" style={styles.trendMonth}>{item.month}</Typography>
                <Typography variant="body" style={styles.trendLevel}>{item.level}</Typography>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="home" size={20} color={BrandColors.ui.primary} style={styles.cardIcon} />
            <Typography variant="h2" style={styles.cardTitle}>Affected Households</Typography>
          </View>
          <Typography variant="h1" style={styles.statNumber}>{summaryData.affectedHouseholds.toLocaleString()}</Typography>
          <Typography variant="body" style={styles.statDescription}>
            households reporting drought impacts
          </Typography>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="water" size={20} color={BrandColors.ui.primary} style={styles.cardIcon} />
            <Typography variant="h2" style={styles.cardTitle}>Water Source Availability</Typography>
          </View>
          <Typography variant="body" style={styles.statDescription}>
            {summaryData.waterSourceAvailability}
          </Typography>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: BrandColors.brand.danger }]} />
            <Typography variant="body" style={styles.statusText}>Critical</Typography>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="warning" size={20} color={BrandColors.ui.primary} style={styles.cardIcon} />
            <Typography variant="h2" style={styles.cardTitle}>Risk Outlook</Typography>
          </View>
          <Typography variant="body" style={styles.riskText}>
            {summaryData.riskOutlook}
          </Typography>
          <View style={styles.riskActions}>
            <Typography variant="h3" style={styles.actionsTitle}>Recommended Actions:</Typography>
            <Typography variant="body" style={styles.actionItem}>• Prepare emergency water supplies</Typography>
            <Typography variant="body" style={styles.actionItem}>• Monitor livestock health closely</Typography>
            <Typography variant="body" style={styles.actionItem}>• Coordinate with local authorities</Typography>
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
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: BrandColors.ui.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTitle: {
    color: BrandColors.ui.primary,
  },
  trendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendItem: {
    alignItems: 'center',
    flex: 1,
  },
  trendBar: {
    width: 40,
    height: 60,
    borderRadius: 4,
    marginBottom: 5,
  },
  trendMonth: {
    fontSize: 12,
    color: BrandColors.ui.mutedForeground,
    marginBottom: 2,
  },
  trendLevel: {
    fontSize: 12,
    fontWeight: '600',
  },
  statNumber: {
    textAlign: 'center',
    color: BrandColors.ui.primary,
    marginBottom: 5,
  },
  statDescription: {
    textAlign: 'center',
    color: BrandColors.ui.mutedForeground,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontWeight: '600',
  },
  riskText: {
    marginBottom: 15,
    lineHeight: 20,
  },
  riskActions: {
    backgroundColor: BrandColors.ui.muted,
    padding: 15,
    borderRadius: 8,
  },
  actionsTitle: {
    marginBottom: 10,
    color: BrandColors.ui.primary,
  },
  actionItem: {
    marginBottom: 5,
    lineHeight: 18,
  },
});

export default CommunityAreaSummaryScreen;