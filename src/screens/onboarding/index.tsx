import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Layout from '../../components/Layout';
import Typography from '../../components/Typography';
import Button from '../../components/Button';
import Logo from '../../components/Logo';
import BrandColors from '../../theme';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Welcome to BARWAAQO AI',
    subtitle: 'Your intelligent assistant for productivity and creativity.',
  },
  {
    title: 'Smart Features',
    subtitle: 'Experience AI-powered tools that help you work smarter and faster.',
  },
  {
    title: 'Get Started',
    subtitle: 'Join thousands of users who trust BARWAAQO AI for their daily tasks.',
  },
];

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== currentIndex) {
      setCurrentIndex(roundIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      navigation.navigate('Auth' as never);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Auth' as never);
  };

  const renderIndicators = () => {
    return (
      <View style={styles.indicators}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <Layout style={styles.container} noPadding={true}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipButton}
          accessibilityLabel="Skip onboarding"
          accessibilityRole="button"
        >
          <Typography variant="body" style={styles.skipText}>
            Skip
          </Typography>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ref={scrollViewRef}
          style={styles.scrollView}
        >
          {onboardingData.map((item, index) => (
            <View key={index} style={styles.slide}>
              <View style={styles.textContainer}>
                <Logo size="medium" />
                <Typography variant="h1" style={styles.title}>
                  {item.title}
                </Typography>
                <Typography variant="body" style={styles.subtitle}>
                  {item.subtitle}
                </Typography>
              </View>
            </View>
          ))}
        </ScrollView>
        {renderIndicators()}
        <View style={styles.buttonContainer}>
          <Button
            title={currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            size="large"
            style={styles.fullWidthButton}
            accessibilityLabel={currentIndex === onboardingData.length - 1 ? 'Get Started with BARWAAQO AI' : 'Next onboarding screen'}
          />
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: BrandColors.app.bodyBackground,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: BrandColors.brand.blue,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 40,
    textAlign: 'center',
    color: BrandColors.ui.mutedForeground,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(12, 109, 255, 0.3)',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: BrandColors.brand.blue,
    width: 30,
    height: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  fullWidthButton: {
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default OnboardingScreen;