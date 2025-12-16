import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showTagline?: boolean;
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showTagline = false,
  animated = false 
}) => {
  const sizeStyles = {
    small: { fontSize: 24, letterSpacing: 2 },
    medium: { fontSize: 36, letterSpacing: 3 },
    large: { fontSize: 48, letterSpacing: 4 },
    xlarge: { fontSize: 64, letterSpacing: 5 },
  };

  const gradientColors = ['#0c6dff', '#8a2be2', '#00d4ff'];
  
  return (
    <View style={styles.container}>
      <View style={[styles.logoWrapper, animated && styles.animatedWrapper]}>
        {/* Modern logo with gradient effect simulation */}
        <View style={styles.gradientBackground}>
          <Text style={[
            styles.logoText, 
            sizeStyles[size], 
            styles.textShadow
          ]}>
            OGAAL
          </Text>
        </View>
        
        {/* Optional AI tag */}
        <View style={styles.aiBadge}>
          <Text style={styles.aiText}>AI</Text>
        </View>
      </View>
      
      {showTagline && (
        <Text style={styles.tagline}>
          Smart Solutions, Seamless Experience
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  animatedWrapper: {
    transform: [{ scale: 1 }],
  },
  gradientBackground: {
    backgroundColor: '#0c6dff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#0c6dff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'System', // Consider using a custom font like 'Inter-Black'
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  aiBadge: {
    backgroundColor: '#00d4ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 10,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  aiText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  tagline: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 12,
    letterSpacing: 0.5,
    opacity: 0.8,
  },
});

export default Logo;