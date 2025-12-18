import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
  ImageBackground,
  Platform,
  Text,
  Easing
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../components/Layout';
import Typography from '../../components/Typography';
import Button from '../../components/Button';
import { useTranslation } from '../../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

interface OnboardingItem {
  title: string;
  subtitle: string;
  icon: string;
  gradient: readonly [string, string];
  illustration?: string;
}


const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { language, setLanguage, t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const data = useMemo(() => (t('onboarding') as any).slides as OnboardingItem[], [language]);
  
  // Animation values
  const scrollX = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Background animations
  const backgroundFadeAnim = useRef(new Animated.Value(0)).current;
  const backgroundRotateAnim = useRef(new Animated.Value(0)).current;
  const backgroundGradientAnim = useRef(new Animated.Value(0)).current;
  
  // Individual slide animations
  const iconScale = useRef(data.map(() => new Animated.Value(0))).current;
  const titleTranslateY = useRef(data.map(() => new Animated.Value(50))).current;
  const subtitleTranslateY = useRef(data.map(() => new Animated.Value(30))).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleScrollEnd = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
    animateSlide(index);
  };

  const animateSlide = (index: number) => {
    // Reset animations for all slides
    data.forEach((_, i) => {
      if (i !== index) {
        Animated.timing(iconScale[i], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
        Animated.timing(titleTranslateY[i], {
          toValue: 50,
          duration: 300,
          useNativeDriver: true,
        }).start();
        Animated.timing(subtitleTranslateY[i], {
          toValue: 30,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });

    // Animate current slide
    Animated.parallel([
      Animated.spring(iconScale[index], {
        toValue: 1,
        tension: 150,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(titleTranslateY[index], {
        toValue: 0,
        tension: 150,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(subtitleTranslateY[index], {
        toValue: 0,
        tension: 150,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    // Button press animation
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    if (currentIndex < data.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
      animateSlide(nextIndex);
    } else {
      // Final slide animation before navigation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(iconScale[currentIndex], {
          toValue: 1.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.navigate('Main' as never);
      });
    }
  };

  const handleSkip = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Main' as never);
    });
  };

  useEffect(() => {
    // Initial fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animate first slide
    animateSlide(0);

    // Background animations
    Animated.parallel([
      Animated.timing(backgroundFadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.loop(
        Animated.timing(backgroundRotateAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      Animated.timing(backgroundGradientAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.sin),
      }),
    ]).start();
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    scrollViewRef.current?.scrollTo({ x: 0, animated: false });
    animateSlide(0);
  }, [language]);

  // Background animation interpolates
  const backgroundRotateInterpolate = backgroundRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const backgroundGradientInterpolate = backgroundGradientAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const renderIndicators = () => {
    return (
      <View style={styles.indicatorsContainer}>
        {data.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.indicator,
                {
                  transform: [{ scale }],
                  opacity,
                  backgroundColor: data[index].gradient[0],
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <Layout style={styles.container} noPadding={true}>
      <LinearGradient
        colors={['#f0f7ff', '#e0f2fe', '#dbeafe']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Animated background elements */}
        <Animated.View
          style={[
            styles.floatingCircle,
            styles.circle1,
            {
              opacity: backgroundFadeAnim,
              transform: [{ rotate: backgroundRotateInterpolate }]
            }
          ]}
        />

        <Animated.View
          style={[
            styles.floatingCircle,
            styles.circle2,
            {
              opacity: backgroundFadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.3]
              })
            }
          ]}
        />

        <Animated.View
          style={[
            styles.floatingCircle,
            styles.circle3,
            {
              opacity: backgroundFadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.2]
              })
            }
          ]}
        />

        {/* Animated gradient overlay */}
        <Animated.View style={[styles.animatedOverlay, {
          opacity: backgroundGradientAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.3, 0]
          })
        }]}>
          <LinearGradient
            colors={['rgba(12, 109, 255, 0.2)', 'rgba(138, 43, 226, 0.2)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        {/* Decorative AI particles */}
        <View style={styles.particlesContainer}>
          {[...Array(6)].map((_, index) => {
            const angle = (index * 60) * Math.PI / 180;
            const radius = 150;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            return (
              <Animated.View
                key={index}
                style={[
                  styles.particle,
                  {
                    left: x + 200, // Center offset
                    top: y + 200,  // Center offset
                    opacity: backgroundFadeAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 0.5, 1]
                    }),
                    transform: [
                      {
                        translateY: backgroundFadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0]
                        })
                      }
                    ]
                  }
                ]}
              >
                <Text style={styles.particleText}>water</Text>
              </Animated.View>
            );
          })}
        </View>
      </LinearGradient>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Language Selector */}
            <View style={styles.languageContainer}>
              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)}
                style={styles.dropdownButton}
                accessibilityLabel="Select language"
                accessibilityRole="button"
              >
                <Ionicons name="language" size={20} color="#000" style={styles.languageIcon} />
                <Typography variant="body" style={styles.dropdownText}>
                  {language === 'en' ? t('english') : t('somali')}
                </Typography>
                <MaterialIcons
                  name={showDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>

              {showDropdown && (
                <View style={styles.dropdown}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
                    style={styles.dropdownGradient}
                  >
                    <TouchableOpacity
                      onPress={() => { setLanguage('en'); setShowDropdown(false); }}
                      style={styles.dropdownItem}
                    >
                      <Typography variant="body" style={styles.dropdownItemText}>
                        🇬🇧 {t('english')}
                      </Typography>
                    </TouchableOpacity>
                    <View style={styles.dropdownDivider} />
                    <TouchableOpacity
                      onPress={() => { setLanguage('so'); setShowDropdown(false); }}
                      style={styles.dropdownItem}
                    >
                      <Typography variant="body" style={styles.dropdownItemText}>
                        🇸🇴 {t('somali')}
                      </Typography>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              )}
            </View>
          </View>

          <View style={styles.headerRight}>
            {/* Skip Button */}
            <TouchableOpacity
              onPress={handleSkip}
              style={styles.skipButton}
              accessibilityLabel="Skip onboarding"
              accessibilityRole="button"
            >
              <Typography variant="body" style={styles.skipText}>
                {t('skip')}
              </Typography>
              <MaterialIcons name="arrow-forward" size={16} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Slides */}
        <View style={styles.slidesContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleScrollEnd}
            scrollEventThrottle={16}
            style={styles.scrollView}
          >
            {data.map((item, index) => {
              const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
              
              const slideScale = scrollX.interpolate({
                inputRange,
                outputRange: [0.8, 1, 0.8],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View 
                  key={index} 
                  style={[
                    styles.slide,
                    {
                      transform: [{ scale: slideScale }],
                    },
                  ]}
                >
                  {/* Icon with gradient background */}
                  <Animated.View 
                    style={[
                      styles.iconWrapper,
                      {
                        transform: [{ scale: iconScale[index] }],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={item.gradient}
                      style={styles.iconGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.iconContainer}>
                        <MaterialIcons name={item.icon as any} size={60} color="#fff" />
                        <View style={styles.illustration}>
                          <Typography variant="h2" style={styles.illustrationText}>
                            {item.illustration}
                          </Typography>
                        </View>
                      </View>
                    </LinearGradient>
                  </Animated.View>

                  {/* Title */}
                  <Animated.View 
                    style={[
                      styles.textContainer,
                      {
                        transform: [{ translateY: titleTranslateY[index] }],
                        opacity: iconScale[index],
                      },
                    ]}
                  >
                    <Typography variant="h1" style={styles.title}>
                      {item.title}
                    </Typography>
                  </Animated.View>

                  {/* Subtitle */}
                  <Animated.View 
                    style={[
                      styles.subtitleContainer,
                      {
                        transform: [{ translateY: subtitleTranslateY[index] }],
                        opacity: iconScale[index],
                      },
                    ]}
                  >
                    <Typography variant="body" style={styles.subtitle}>
                      {item.subtitle}
                    </Typography>
                  </Animated.View>
                </Animated.View>
              );
            })}
          </ScrollView>

          {/* Indicators */}
          {renderIndicators()}
        </View>

        {/* Button */}
        <View style={styles.buttonSection}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <LinearGradient
              colors={data[currentIndex].gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Button
                title={currentIndex === data.length - 1 ? t('startExploring') : t('continue')}
                onPress={handleNext}
                size="large"
                style={styles.button}
                textStyle={styles.buttonText}
                icon={
                  currentIndex === data.length - 1 ?
                  <MaterialIcons name="explore" size={20} color="#fff" style={styles.buttonIcon} /> :
                  <MaterialIcons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
                }
                iconPosition="right"
              />
            </LinearGradient>
          </Animated.View>

          {/* Optional: Swipe hint */}
          {currentIndex < data.length - 1 && (
            <View style={styles.swipeHint}>
              <Typography variant="caption" style={styles.swipeHintText}>
                {t('swipeToContinue')}
              </Typography>
              <MaterialIcons name="swipe" size={20} color="rgba(0,0,0,0.7)" />
            </View>
          )}
        </View>
      </Animated.View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: 1000, // Large enough to be circle
    pointerEvents: 'none',
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: 'rgba(12, 109, 255, 0.08)',
    top: '10%',
    left: '-10%',
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(138, 43, 226, 0.06)',
    bottom: '15%',
    right: '-5%',
  },
  circle3: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
    top: '60%',
    left: '70%',
  },
  animatedOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    pointerEvents: 'none',
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(12, 109, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(12, 109, 255, 0.2)',
  },
  particleText: {
    fontSize: 10,
    color: '#0c6dff',
    fontWeight: '600',
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    zIndex: 10,
  },
  logoContainer: {
    opacity: 0.9,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  languageContainer: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageIcon: {
  },
  dropdownText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    minWidth: 140,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 100,
  },
  dropdownGradient: {
    paddingVertical: 8,
    borderRadius: 12,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dropdownItemText: {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 14,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 12,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skipText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  slidesContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconWrapper: {
    marginBottom: 40,
  },
  iconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    position: 'relative',
  },
  illustration: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  illustrationText: {
    fontSize: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#000',
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitle: {
    color: 'rgba(0,0,0,0.85)',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '400',
    paddingHorizontal: 20,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    gap: 12,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonSection: {
    paddingHorizontal: 40,
    paddingBottom: Platform.OS === 'ios' ? 60 : 40,
    alignItems: 'center',
  },
  buttonGradient: {
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  button: {
    backgroundColor: 'transparent',
    height: 56,
    borderRadius: 25,
    paddingHorizontal: 50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
    opacity: 0.7,
  },
  swipeHintText: {
    color: 'rgba(0,0,0,0.7)',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default OnboardingScreen;