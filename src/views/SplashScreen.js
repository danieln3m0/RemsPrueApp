import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Esperar 2.5 segundos y luego terminar
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="flash" size={80} color={theme.colors.primary} />
        </Animated.View>
        
        <Text style={[styles.title, { color: theme.colors.text }]}>Tableros Eléctricos</Text>
        <Text style={[styles.subtitle, { color: theme.colors.primary }]}>Sistema de Gestión</Text>
        
        <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
          <View style={[styles.loadingBar, { backgroundColor: `${theme.colors.primary}33` }]}>
            <Animated.View
              style={[
                styles.loadingProgress,
                {
                  backgroundColor: theme.colors.primary,
                  transform: [{
                    scaleX: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  }],
                },
              ]}
            />
          </View>
        </Animated.View>
      </Animated.View>

      <Animated.Text style={[styles.footer, { opacity: fadeAnim, color: theme.colors.textSecondary }]}>
        Powered by Francis D.
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 30,
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  loadingContainer: {
    marginTop: 50,
    width: width * 0.6,
  },
  loadingBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    width: '100%',
    borderRadius: 2,
    transformOrigin: 'left',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    fontSize: 12,
    letterSpacing: 1,
  },
});

export default SplashScreen;
