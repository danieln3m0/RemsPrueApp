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

export default function HomeScreen() {
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
          <Ionicons name="person-circle" size={120} color="#FF6F00" />
        </View>

        {/* Información personal */}
        <View style={styles.infoCard}>
          <Text style={styles.title}>Información personal</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="person" size={24} color="#FF6F00" />
            <View style={styles.infoText}>
              <Text style={styles.label}>Nombre Completo</Text>
              <Text style={styles.value}>Francis Daniel Mamani Silva</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail" size={24} color="#FF6F00" />
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
              <Ionicons name="checkmark-circle" size={20} color="#FF6F00" />
              <Text style={styles.reasonText}>
                Experiencia en desarrollo de aplicaciones móviles multiplataforma
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FF6F00" />
              <Text style={styles.reasonText}>
                Conocimientos sólidos en arquitecturas limpias y mejores prácticas
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FF6F00" />
              <Text style={styles.reasonText}>
                Capacidad para trabajar con APIs REST y gestión de estados
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FF6F00" />
              <Text style={styles.reasonText}>
                Enfoque en la calidad del código y experiencia del usuario
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FF6F00" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6F00',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 15,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6F00',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginBottom: 10,
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    textAlign: 'justify',
  },
  reasonsList: {
    marginTop: 10,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reasonText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  skillsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6F00',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  skillBadge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 5,
    borderWidth: 1,
    borderColor: '#FF6F00',
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skillText: {
    color: '#FF6F00',
    fontSize: 13,
    fontWeight: '600',
  },
});
