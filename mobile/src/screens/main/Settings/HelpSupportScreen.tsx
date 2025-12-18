import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';

const HelpSupportScreen: React.FC = () => {
    const navigation = useNavigation();

    const contactOptions = [
        {
            icon: 'phone' as const,
            title: 'Call Support',
            subtitle: '24/7 customer support hotline',
            action: () => Linking.openURL('tel:+1234567890'),
            color: '#3b82f6',
        },
        {
            icon: 'email' as const,
            title: 'Email Support',
            subtitle: 'Send us an email',
            action: () => Linking.openURL('mailto:support@sol-etsgo.com'),
            color: '#10b981',
        },
        {
            icon: 'chat' as const,
            title: 'Live Chat',
            subtitle: 'Chat with our support team',
            action: () => Alert.alert('Live Chat', 'Live chat will be available soon.'),
            color: '#8b5cf6',
        },
        {
            icon: 'help' as const,
            title: 'FAQ',
            subtitle: 'Frequently asked questions',
            action: () => navigation.navigate('FAQ' as never),
            color: '#f59e0b',
        },
    ];

    const resources = [
        {
            title: 'User Guide',
            description: 'Complete guide to using SOL ETSGO',
            icon: 'book' as const,
            color: '#3b82f6',
        },
        {
            title: 'Video Tutorials',
            description: 'Step-by-step video tutorials',
            icon: 'play-circle' as const,
            color: '#ef4444',
        },
        {
            title: 'Community Forum',
            description: 'Connect with other users',
            icon: 'people' as const,
            color: '#10b981',
        },
        {
            title: 'System Status',
            description: 'Check app and server status',
            icon: 'info' as const,
            color: '#f59e0b',
        },
    ];

    const handleReportProblem = () => {
        Alert.prompt(
            'Report a Problem',
            'Please describe the issue you\'re experiencing:',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Submit',
                    onPress: (description: any) => {
                        if (description) {
                            console.log('Problem reported:', description);
                            Alert.alert('Thank You', 'Your report has been submitted. We\'ll get back to you soon.');
                        }
                    }
                },
            ],
            'plain-text'
        );
    };

    const handleRateApp = () => {
        Alert.alert(
            'Rate Our App',
            'Would you like to rate SOL ETSGO in the app store?',
            [
                { text: 'Not Now', style: 'cancel' },
                { text: 'Rate Now', onPress: () => console.log('Navigate to app store') },
            ]
        );
    };

    return (
        <Layout style={styles.container} noPadding>
            {/* Header with Gradient */}
            <LinearGradient
                colors={['#0c6dff', '#4f46e5']}
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
                    <Typography style={styles.headerTitle}>
                        Help & Support
                    </Typography>
                    <View style={styles.headerPlaceholder} />
                </View>
            </LinearGradient>

            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Contact Section */}
                <View style={styles.section}>
                    <Typography style={styles.sectionTitle}>
                        Get Help
                    </Typography>

                    <View style={styles.contactGrid}>
                        {contactOptions.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.contactCard}
                                onPress={option.action}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[option.color, `${option.color}90`]}
                                    style={styles.contactCardGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <View style={styles.contactIconContainer}>
                                        <MaterialIcons name={option.icon} size={24} color="white" />
                                    </View>
                                    <Typography style={styles.contactTitle}>
                                        {option.title}
                                    </Typography>
                                    <Typography style={styles.contactSubtitle}>
                                        {option.subtitle}
                                    </Typography>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Resources Section */}
                <View style={styles.section}>
                    <Typography style={styles.sectionTitle}>
                        Resources
                    </Typography>

                    <View style={styles.resourcesList}>
                        {resources.map((resource, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.resourceCard}
                                activeOpacity={0.7}
                            >
                                <View style={styles.resourceContent}>
                                    <View style={[styles.resourceIcon, { backgroundColor: resource.color + '15' }]}>
                                        {/* <Ionicons name={resource.icon} size={20} color={resource.color} /> */}
                                        <Ionicons name={resource.icon} size={20} color={resource.color} />
                                    </View>
                                    <View style={styles.resourceText}>
                                        <Typography style={styles.resourceTitle}>
                                            {resource.title}
                                        </Typography>
                                        <Typography style={styles.resourceDescription}>
                                            {resource.description}
                                        </Typography>
                                    </View>
                                    <Feather name="chevron-right" size={18} color="#94a3b8" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Action Cards */}
                <View style={styles.actionCards}>
                    {/* Report Problem */}
                    <TouchableOpacity
                        style={styles.reportCard}
                        onPress={handleReportProblem}
                        activeOpacity={0.8}
                    >
                        <View style={styles.reportContent}>
                            <View style={[styles.reportIcon, { backgroundColor: '#ef444415' }]}>
                                <Feather name="alert-circle" size={22} color="#ef4444" />
                            </View>
                            <View style={styles.reportText}>
                                <Typography style={styles.reportTitle}>
                                    Report a Problem
                                </Typography>
                                <Typography style={styles.reportDescription}>
                                    Found a bug or issue? Let us know
                                </Typography>
                            </View>
                            <Feather name="chevron-right" size={18} color="#ef4444" />
                        </View>
                    </TouchableOpacity>

                    {/* Rate App */}
                    <TouchableOpacity
                        style={styles.rateCard}
                        onPress={handleRateApp}
                        activeOpacity={0.8}
                    >
                        <View style={styles.rateContent}>
                            <View style={[styles.rateIcon, { backgroundColor: '#f59e0b15' }]}>
                                <Ionicons name="star" size={22} color="#f59e0b" />
                            </View>
                            <View style={styles.rateText}>
                                <Typography style={styles.rateTitle}>
                                    Rate Our App
                                </Typography>
                                <Typography style={styles.rateDescription}>
                                    Enjoying SOL ETSGO? Leave us a review
                                </Typography>
                            </View>
                            <Feather name="chevron-right" size={18} color="#f59e0b" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Contact Info */}
                <View style={styles.infoCard}>
                    <Typography style={styles.infoTitle}>
                        Contact Information
                    </Typography>
                    
                    <View style={styles.infoList}>
                        <View style={styles.infoItem}>
                            <View style={[styles.infoIcon, { backgroundColor: '#3b82f615' }]}>
                                <Feather name="mail" size={16} color="#3b82f6" />
                            </View>
                            <Typography style={styles.infoText}>
                                support@sol-etsgo.com
                            </Typography>
                        </View>
                        
                        <View style={styles.infoItem}>
                            <View style={[styles.infoIcon, { backgroundColor: '#10b98115' }]}>
                                <Feather name="phone" size={16} color="#10b981" />
                            </View>
                            <Typography style={styles.infoText}>
                                +1 (800) 123-4567
                            </Typography>
                        </View>
                        
                        <View style={styles.infoItem}>
                            <View style={[styles.infoIcon, { backgroundColor: '#f59e0b15' }]}>
                                <Feather name="clock" size={16} color="#f59e0b" />
                            </View>
                            <Typography style={styles.infoText}>
                                Support Hours: 24/7
                            </Typography>
                        </View>
                        
                        <View style={styles.infoItem}>
                            <View style={[styles.infoIcon, { backgroundColor: '#8b5cf615' }]}>
                                <Feather name="globe" size={16} color="#8b5cf6" />
                            </View>
                            <Typography style={styles.infoText}>
                                www.sol-etsgo.com/support
                            </Typography>
                        </View>
                    </View>
                </View>

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
    headerPlaceholder: {
        width: 44,
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
    
    // Sections
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 16,
        marginLeft: 4,
    },
    
    // Contact Grid
    contactGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    contactCard: {
        width: '48%',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    contactCardGradient: {
        padding: 16,
        alignItems: 'center',
        borderRadius: 16,
        minHeight: 140,
    },
    contactIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    contactTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        textAlign: 'center',
    },
    contactSubtitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 14,
    },
    
    // Resources
    resourcesList: {
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        overflow: 'hidden',
    },
    resourceCard: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    resourceContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resourceIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    resourceText: {
        flex: 1,
    },
    resourceTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 2,
    },
    resourceDescription: {
        fontSize: 12,
        color: '#64748b',
        lineHeight: 16,
    },
    
    // Action Cards
    actionCards: {
        gap: 12,
        marginBottom: 24,
    },
    reportCard: {
        backgroundColor: '#fef2f2',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    reportContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reportIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    reportText: {
        flex: 1,
    },
    reportTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#dc2626',
        marginBottom: 2,
    },
    reportDescription: {
        fontSize: 12,
        color: '#ef4444',
        lineHeight: 16,
    },
    rateCard: {
        backgroundColor: '#fffbeb',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#fde68a',
    },
    rateContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rateIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        borderWidth: 1,
        borderColor: '#fde68a',
    },
    rateText: {
        flex: 1,
    },
    rateTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#d97706',
        marginBottom: 2,
    },
    rateDescription: {
        fontSize: 12,
        color: '#f59e0b',
        lineHeight: 16,
    },
    
    // Contact Info
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 16,
    },
    infoList: {
        gap: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#475569',
        flex: 1,
    },
    
    // Bottom Spacing
    bottomSpacing: {
        height: 20,
    },
});

export default HelpSupportScreen;