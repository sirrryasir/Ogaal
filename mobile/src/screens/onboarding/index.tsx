import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Layout from '../../components/Layout';
import Typography from '../../components/Typography';
import Button from '../../components/Button';
import Logo from '../../components/Logo';
import { useTranslation } from '../../contexts/LanguageContext';

const { width } = Dimensions.get('window');

interface OnboardingItem {
   title: string;
   subtitle: string;
   icon: string;
}

const getOnboardingData = (lang: string): OnboardingItem[] => {
   if (lang === 'so') {
     return [
       {
         title: 'Ujeedo',
         subtitle: 'Raadi ceelasha u dhow oo arag haddii biyuhu diyaar yihiin ka hor intaadan dhaqaaqin.',
         icon: 'location-on',
       },
       {
         title: 'Sida ay u shaqeyso',
         subtitle: 'Ceelasha waxaa lagu muujiyaa khariidad toos ah. Midabada waxay muujinayaan shaqeynaya, hooseeya, ama qalalan.',
         icon: 'map',
       },
       {
         title: 'Doorka bulshada',
         subtitle: 'Ka warbixi xaaladda ceelka si aad u caawiso dadka kale. Cusbooneysiinta la xaqiijiyay waxay badbaadinayaan qof walba.',
         icon: 'people',
       },
     ];
   }
   return [
     {
       title: 'Purpose',
       subtitle: 'Find nearby wells and see if water is available before you move.',
       icon: 'location-on',
     },
     {
       title: 'How it works',
       subtitle: 'Wells are shown on a live map. Colors show working, low, or dry.',
       icon: 'map',
     },
     {
       title: 'Community role',
       subtitle: 'Report well status to help others. Verified updates keep everyone safe.',
       icon: 'people',
     },
   ];
 };

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { language, setLanguage, t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const data = useMemo(() => getOnboardingData(language), [language]);
  const animValues = useRef(data.map(() => new Animated.Value(0.5))).current;
  const textAnimValues = useRef(data.map(() => new Animated.Value(0))).current;
  const rotateAnimValues = useRef(data.map(() => new Animated.Value(0))).current;

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== currentIndex) {
      setCurrentIndex(roundIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      navigation.navigate('Main' as never);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Main' as never);
  };

  useEffect(() => {
    animValues.forEach((anim, i) => {
      if (i !== currentIndex) {
        Animated.spring(anim, {
          toValue: 0.5,
          useNativeDriver: true,
          friction: 5,
        }).start();
        Animated.timing(textAnimValues[i], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
        Animated.timing(rotateAnimValues[i], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });
    Animated.spring(animValues[currentIndex], {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
    Animated.timing(textAnimValues[currentIndex], {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.timing(rotateAnimValues[currentIndex], {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  useEffect(() => {
    setCurrentIndex(0);
    scrollViewRef.current?.scrollTo({ x: 0, animated: false });
  }, [language]);

  const renderIndicators = () => {
    return (
      <View style={styles.indicators}>
        {data.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.indicator,
              {
                opacity: animValues[index].interpolate({
                  inputRange: [0.5, 1],
                  outputRange: [0.3, 1],
                }),
                transform: [
                  {
                    scale: animValues[index].interpolate({
                      inputRange: [0.5, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <Layout style={styles.container} noPadding={true}>
      <View style={styles.backgroundOverlay} />
      <View style={styles.logoContainer}>
        <Logo size="large" />
      </View>
      <View style={styles.header}>
        <View style={styles.languageContainer}>
          <TouchableOpacity
            onPress={() => setShowDropdown(!showDropdown)}
            style={styles.dropdownButton}
            accessibilityLabel="Select language"
            accessibilityRole="button"
          >
            <Typography variant="body" style={styles.dropdownText}>
              {language === 'en' ? t('english') : t('somali')}
            </Typography>
            <MaterialIcons name={showDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color={'#0c6dff'} />
          </TouchableOpacity>
          {showDropdown && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                onPress={() => { setLanguage('en'); setShowDropdown(false); }}
                style={styles.dropdownItem}
                accessibilityLabel="Switch to English"
                accessibilityRole="button"
              >
                <Typography variant="body" style={styles.dropdownItemText}>
                  {t('english')}
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setLanguage('so'); setShowDropdown(false); }}
                style={styles.dropdownItem}
                accessibilityLabel="Switch to Somali"
                accessibilityRole="button"
              >
                <Typography variant="body" style={styles.dropdownItemText}>
                  {t('somali')}
                </Typography>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
          {data.map((item, index) => (
            <View key={index} style={styles.slide}>
              <View style={styles.textContainer}>
                <Animated.View style={{
                  transform: [
                    { scale: animValues[index] },
                    { rotate: rotateAnimValues[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }) }
                  ]
                }}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name={item.icon as any} size={80} color={'#ffffff'} />
                  </View>
                </Animated.View>
                <Animated.View style={{ opacity: textAnimValues[index] }}>
                  <Typography variant="h1" style={styles.title}>
                    {item.title}
                  </Typography>
                  <Typography variant="body" style={styles.subtitle}>
                    {item.subtitle}
                  </Typography>
                </Animated.View>
              </View>
            </View>
          ))}
        </ScrollView>
        {renderIndicators()}
        <View style={styles.buttonContainer}>
          <Button
            title={currentIndex === data.length - 1 ? 'Start Exploring' : 'Continue'}
            onPress={handleNext}
            size="large"
            style={styles.fullWidthButton}
            accessibilityLabel={currentIndex === data.length - 1 ? 'Start exploring the app' : 'Continue to next screen'}
          />
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f0f7ff',
    opacity: 0.1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: '#0c6dff',
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
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0c6dff',
  },
  subtitle: {
    marginBottom: 50,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 26,
    color: '#0f172a',
    paddingHorizontal: 30,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0c6dff',
    marginHorizontal: 5,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  fullWidthButton: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
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
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0c6dff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lang: {
    padding: 5,
  },
  activeLang: {
    padding: 5,
    backgroundColor: '#0c6dff',
    borderRadius: 5,
  },
  langText: {
    color: '#0f172a',
    fontWeight: '500',
  },
  activeLangText: {
    color: '#f8fafc',
    fontWeight: '500',
  },
  separator: {
    marginHorizontal: 5,
    color: '#0f172a',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  dropdownText: {
    color: '#0c6dff',
    fontWeight: '500',
    marginRight: 5,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#f8fafc',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 100,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    color: '#0f172a',
    fontWeight: '500',
  },
});

export default OnboardingScreen;