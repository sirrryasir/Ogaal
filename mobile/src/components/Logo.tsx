import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

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
    small: { width: 40, height: 40 },
    medium: { width: 60, height: 60 },
    large: { width: 80, height: 80 },
    xlarge: { width: 100, height: 100 },
  };
  
  return (
    <View style={styles.container}>
      <View style={[styles.logoWrapper, animated && styles.animatedWrapper]}>
        {/* Logo Icon/Image */}
        <View>
          <Image 
            source={require('../../assets/logo.png')} // Update this path
            style={[styles.logoIcon, sizeStyles[size]]}
            resizeMode="contain"
          />
        </View>
        
        {/* Optional AI tag */}
        {showTagline && (
          <View style={styles.aiBadge}>
            <Text style={styles.aiText}>AI</Text>
          </View>
        )}
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
  iconContainer: {
    padding: 10,
    borderRadius: 16,
    // backgroundColor: '#0c6dff',
    shadowColor: '#0c6dff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoIcon: {
    // Dimensions set dynamically based on size prop
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