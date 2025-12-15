import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import BrandColors from '../../../theme';

type UserRole = 'Community Member' | 'Farmer' | 'Herder';

interface GuidanceItem {
  id: string;
  title: string;
  content: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const ActionsGuidanceScreen: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Community Member');

  const guidanceData: Record<UserRole, GuidanceItem[]> = {
    'Community Member': [
      {
        id: '1',
        title: 'Store Water',
        content: 'Collect rainwater in clean containers. Use barrels or tanks for household storage.',
        icon: 'water',
      },
      {
        id: '2',
        title: 'Reduce Usage',
        content: 'Take shorter showers, fix leaks, and reuse water for multiple purposes.',
        icon: 'water-outline',
      },
      {
        id: '3',
        title: 'Protect Vulnerable',
        content: 'Keep children and elderly in shade during heat. Provide extra water and rest.',
        icon: 'people',
      },
    ],
    'Farmer': [
      {
        id: '1',
        title: 'Crop Selection',
        content: 'Choose drought-resistant crops like sorghum, millet, or cowpeas for current conditions.',
        icon: 'leaf',
      },
      {
        id: '2',
        title: 'Planting Timing',
        content: 'Wait for adequate rainfall before planting. Avoid planting during dry spells.',
        icon: 'leaf-outline',
      },
      {
        id: '3',
        title: 'Soil Management',
        content: 'Use mulch to retain moisture. Practice conservation tillage to preserve soil water.',
        icon: 'earth',
      },
    ],
    'Herder': [
      {
        id: '1',
        title: 'Grazing Assessment',
        content: 'Monitor pasture conditions. Move livestock to areas with better grass availability.',
        icon: 'paw',
      },
      {
        id: '2',
        title: 'Water Planning',
        content: 'Locate reliable water sources in advance. Plan routes to avoid water scarcity.',
        icon: 'walk',
      },
      {
        id: '3',
        title: 'Livestock Care',
        content: 'Provide shade and water during heat. Supplement feed if pasture is poor.',
        icon: 'medical',
      },
    ],
  };

  const roles: UserRole[] = ['Community Member', 'Farmer', 'Herder'];

  return (
    <Layout noPadding>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <Typography variant="h1" style={styles.title}>Actions & Guidance</Typography>

        <View style={styles.roleSelector}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleButton,
                selectedRole === role && styles.selectedRoleButton,
              ]}
              onPress={() => setSelectedRole(role)}
            >
              <Typography
                variant="button"
                style={[
                  styles.roleButtonText,
                  selectedRole === role && styles.selectedRoleButtonText,
                ]}
              >
                {role}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        <Typography variant="h2" style={styles.sectionTitle}>
          Guidance for {selectedRole}s
        </Typography>

        {guidanceData[selectedRole].map((item) => (
          <View key={item.id} style={styles.guidanceCard}>
            <View style={styles.guidanceHeader}>
              <Ionicons name={item.icon} size={24} color={BrandColors.ui.primary} style={styles.icon} />
              <Typography variant="h3" style={styles.guidanceTitle}>{item.title}</Typography>
            </View>
            <Typography variant="body" style={styles.guidanceContent}>{item.content}</Typography>
          </View>
        ))}
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
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  roleButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
  },
  selectedRoleButton: {
    backgroundColor: BrandColors.ui.primary,
    borderColor: BrandColors.ui.primary,
  },
  roleButtonText: {
    color: BrandColors.ui.foreground,
  },
  selectedRoleButtonText: {
    color: BrandColors.ui.primaryForeground,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  guidanceCard: {
    backgroundColor: BrandColors.ui.card,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
  },
  guidanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  guidanceTitle: {
    flex: 1,
  },
  guidanceContent: {
    lineHeight: 20,
  },
});

export default ActionsGuidanceScreen;