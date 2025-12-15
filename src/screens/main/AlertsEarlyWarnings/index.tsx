import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import BrandColors from '../../../theme';

interface Alert {
  id: string;
  type: 'Drought' | 'Rain Failure' | 'Heat Stress' | 'Water Shortage';
  message: string;
  severity: 'Low' | 'Medium' | 'High';
  timestamp: string;
}

const AlertsEarlyWarningsScreen: React.FC = () => {
  // Mock data
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'Drought',
      message: '⚠ Severe drought expected in next 30 days',
      severity: 'High',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'Rain Failure',
      message: 'No rain forecast – prepare water storage',
      severity: 'Medium',
      timestamp: '1 day ago',
    },
    {
      id: '3',
      type: 'Heat Stress',
      message: 'Livestock heat stress risk high',
      severity: 'High',
      timestamp: '3 days ago',
    },
    {
      id: '4',
      type: 'Water Shortage',
      message: 'Water shortage alerts active in your area',
      severity: 'Medium',
      timestamp: '1 week ago',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return BrandColors.brand.success;
      case 'Medium': return BrandColors.brand.warning;
      case 'High': return BrandColors.brand.danger;
      default: return BrandColors.ui.mutedForeground;
    }
  };

  return (
    <Layout noPadding>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <Typography variant="h1" style={styles.title}>Alerts & Early Warnings</Typography>

        <View style={styles.deliveryInfo}>
          <Typography variant="body" style={styles.deliveryText}>
            Alerts delivered via: In-app notifications, SMS fallback
          </Typography>
        </View>

        <Typography variant="h2" style={styles.sectionTitle}>Recent Alerts</Typography>

        {alerts.map((alert) => {
          const getAlertIcon = (type: string) => {
            switch (type) {
              case 'Drought': return 'warning';
              case 'Rain Failure': return 'rainy';
              case 'Heat Stress': return 'sunny';
              case 'Water Shortage': return 'water';
              default: return 'alert-circle';
            }
          };

          return (
            <View key={alert.id} style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <View style={styles.alertTypeContainer}>
                  <Ionicons name={getAlertIcon(alert.type)} size={20} color={BrandColors.ui.primary} style={styles.alertIcon} />
                  <Typography variant="h3" style={styles.alertType}>{alert.type}</Typography>
                </View>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(alert.severity) }]}>
                  <Typography variant="caption" color="primaryForeground">{alert.severity}</Typography>
                </View>
              </View>
              <Typography variant="body" style={styles.alertMessage}>{alert.message}</Typography>
              <Typography variant="caption" style={styles.timestamp}>{alert.timestamp}</Typography>
            </View>
          );
        })}
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
  deliveryInfo: {
    backgroundColor: BrandColors.ui.muted,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  deliveryText: {
    textAlign: 'center',
  },
  sectionTitle: {
    marginBottom: 15,
  },
  alertCard: {
    backgroundColor: BrandColors.ui.card,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    marginRight: 8,
  },
  alertType: {
    color: BrandColors.ui.primary,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  alertMessage: {
    marginBottom: 5,
  },
  timestamp: {
    color: BrandColors.ui.mutedForeground,
  },
});

export default AlertsEarlyWarningsScreen;