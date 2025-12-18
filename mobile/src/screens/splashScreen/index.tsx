import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../components/Layout';
import Logo from '../../components/Logo';

const SplashScreen: React.FC = () => {
  const navigation = useNavigation();
  
  // Multiple animations for richer experience
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const gradientAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create parallel animations
    Animated.parallel([
      // Logo fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      // Logo scale up
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 7,
        useNativeDriver: true,
      }),
      // Continuous rotation for decorative elements
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      // Gradient animation
      Animated.timing(gradientAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.sin),
      }),
    ]).start();

    // Navigation after animation sequence
    const timer = setTimeout(() => {
      // Exit animation before navigation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.navigate('Onboarding' as never);
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim, rotateAnim, gradientAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const gradientInterpolate = gradientAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Layout style={styles.layout} centered={true} noPadding={true}>
      <LinearGradient
        colors={['#f0f7ff', '#e0f2fe', '#dbeafe']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Animated background elements - Simple circles without Svg */}
        <Animated.View 
          style={[
            styles.floatingCircle, 
            styles.circle1,
            { 
              opacity: fadeAnim,
              transform: [{ rotate: rotateInterpolate }] 
            }
          ]}
        />
        
        <Animated.View 
          style={[
            styles.floatingCircle, 
            styles.circle2,
            { 
              opacity: fadeAnim.interpolate({
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
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.2]
              })
            }
          ]}
        />

        {/* Animated gradient overlay */}
        <Animated.View style={[styles.animatedOverlay, {
          opacity: gradientAnim.interpolate({
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

        {/* Main logo container */}
        <View style={styles.logoContainer}>
          <Animated.View 
            style={[
              styles.animatedLogo,
              { 
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Logo size="xlarge" showTagline={true} animated={true} />
          </Animated.View>
          
          {/* Loading indicator */}
          <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
            <View style={styles.loadingTrack}>
              <Animated.View
                style={[
                  styles.loadingBar,
                  {
                    transform: [{ scaleX: gradientInterpolate }],
                  }
                ]}
              />
            </View>
            <Animated.Text 
              style={[
                styles.loadingText,
                { opacity: fadeAnim }
              ]}
            >
              Preparing your experience...
            </Animated.Text>
          </Animated.View>
        </View>

        {/* Decorative AI particles - simplified */}
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
                    opacity: fadeAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 0.5, 1]
                    }),
                    transform: [
                      { 
                        translateY: fadeAnim.interpolate({
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
    </Layout>
  );
};

const styles = StyleSheet.create({
  layout: {
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  animatedLogo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: 1000, // Large enough to be circle
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
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
    width: '80%',
  },
  loadingTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  loadingBar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0c6dff',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
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
});

export default SplashScreen;