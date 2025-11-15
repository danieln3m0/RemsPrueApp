import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen() {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const styles = getStyles(theme);

  return (
    <ScrollView style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Avatar/Icono del perfil */}
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={120} color={theme.colors.primary} />
        </View>

        {/* Información personal */}
        <View style={styles.infoCard}>
          <Text style={styles.title}>Información personal</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="person" size={24} color={theme.colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.label}>Nombre Completo</Text>
              <Text style={styles.value}>Francis Daniel Mamani Silva</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail" size={24} color={theme.colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <Text style={styles.value}>francisdani@gmail.com</Text>
            </View>
          </View>
        </View>

        {/* Perfil Profesional */}
        <View style={styles.profileCard}>
          <Text style={styles.sectionTitle}>Perfil Profesional</Text>
          <Text style={styles.description}>
            Desarrollador Full Stack con amplia experiencia en React Native y tecnologías móviles. 
            Especializado en la creación de aplicaciones móviles escalables y de alto rendimiento, 
            con sólidos conocimientos en arquitecturas limpias como MVC y patrones de diseño modernos.
          </Text>
          
          <Text style={styles.sectionTitle}>¿Por qué contratarme?</Text>
          <View style={styles.reasonsList}>
            <View style={styles.reasonItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.reasonText}>
                Experiencia en desarrollo de aplicaciones móviles multiplataforma
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.reasonText}>
                Conocimientos sólidos en arquitecturas limpias y mejores prácticas
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.reasonText}>
                Capacidad para trabajar con APIs REST y gestión de estados
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.reasonText}>
                Enfoque en la calidad del código y experiencia del usuario
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.reasonText}>
                Aprendizaje continuo y adaptación a nuevas tecnologías
              </Text>
            </View>
          </View>
        </View>

        {/* Habilidades técnicas */}
        <View style={styles.skillsCard}>
          <Text style={styles.sectionTitle}>Habilidades Técnicas</Text>
          <View style={styles.skillsContainer}>
            <View style={styles.skillBadge}>
              <Text style={styles.skillText}>React Native</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillText}>JavaScript</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillText}>REST APIs</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillText}>MVC Architecture</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillText}>Navigation</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillText}>State Management</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 30,
    marginBottom: 35,
  },
  infoCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoText: {
    marginLeft: 16,
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  profileCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 12,
    marginTop: 8,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    textAlign: 'justify',
    letterSpacing: 0.2,
  },
  reasonsList: {
    marginTop: 12,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingLeft: 4,
  },
  reasonText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  skillsCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  skillBadge: {
    backgroundColor: theme.colors.skillBadgeBackground,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  skillText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
