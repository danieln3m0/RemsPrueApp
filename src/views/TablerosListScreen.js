import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTableros, useDeleteTablero } from '../hooks/useTableros';

export default function TablerosListScreen({ navigation }) {
  // React Query hooks
  const { data: tableros = [], isLoading, isError, error, refetch } = useTableros();
  const deleteMutation = useDeleteTablero();

  // Recargar tableros cada vez que la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Mostrar error si ocurre
  useEffect(() => {
    if (isError) {
      Alert.alert('Error', error?.message || 'No se pudieron cargar los tableros');
    }
  }, [isError, error]);

  // Función para eliminar un tablero
  const handleDelete = async (tablero) => {
    console.log('Intentando eliminar tablero:', tablero.id, tablero.nombre);
    
    if (!tablero.id) {
      Alert.alert('Error', 'El tablero no tiene un ID válido');
      return;
    }
    
    // Usar confirm() para web, que funciona en todos los navegadores
    const confirmDelete = Platform.OS === 'web' 
      ? window.confirm(`¿Estás seguro de eliminar el tablero "${tablero.nombre}"?\nID: ${tablero.id}`)
      : await new Promise((resolve) => {
          Alert.alert(
            'Confirmar Eliminación',
            `¿Estás seguro de eliminar el tablero "${tablero.nombre}"?\nID: ${tablero.id}`,
            [
              { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Eliminar', style: 'destructive', onPress: () => resolve(true) },
            ]
          );
        });
    
    if (!confirmDelete) {
      console.log('Eliminación cancelada por el usuario');
      return;
    }
    
    // Usar React Query mutation para eliminar
    deleteMutation.mutate(tablero.id, {
      onSuccess: () => {
        if (Platform.OS === 'web') {
          alert('Tablero eliminado correctamente');
        } else {
          Alert.alert('Éxito', 'Tablero eliminado correctamente');
        }
      },
      onError: (error) => {
        console.error('Error al eliminar:', error);
        if (Platform.OS === 'web') {
          alert(`Error al eliminar: ${error.message || 'No se pudo eliminar el tablero'}`);
        } else {
          Alert.alert('Error al eliminar', error.message || 'No se pudo eliminar el tablero');
        }
      },
    });
  };

  // Función para navegar a la pantalla de edición
  const handleEdit = (tablero) => {
    navigation.navigate('EditTablero', { tablero });
  };

  // Componente de tarjeta con animación
  const AnimatedTableroCard = ({ item, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          delay: index * 80,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          delay: index * 80,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View 
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="flash" size={24} color="#FF6F00" />
          <Text style={styles.cardTitle}>{item.nombre}</Text>
        </View>
      
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color="#111" />
            <Text style={styles.infoText}>{item.ubicacion}</Text>
          </View>
          
          {item.estado && (
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={16} color="#FF6F00" />
              <Text style={styles.infoText}>Estado: {item.estado}</Text>
            </View>
          )}
          
          {item.capacidad_amperios && (
            <View style={styles.infoRow}>
              <Ionicons name="speedometer" size={16} color="#111" />
              <Text style={styles.infoText}>{item.capacidad_amperios} A</Text>
            </View>
          )}
          
          {item.marca && (
            <View style={styles.infoRow}>
              <Ionicons name="pricetag" size={16} color="#FF6F00" />
              <Text style={styles.infoText}>{item.marca}</Text>
            </View>
          )}
          
          {(item.ano_fabricacion || item.ano_instalacion) && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={16} color="#FF6F00" />
              <Text style={styles.infoText}>
                Fab: {item.ano_fabricacion || 'N/A'} | Inst: {item.ano_instalacion || 'N/A'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => handleEdit(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="create" size={20} color="white" />
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => handleDelete(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash" size={20} color="white" />
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  // Renderizar cada ítem de la lista
  const renderTablero = ({ item, index }) => (
    <AnimatedTableroCard item={item} index={index} />
  );

  // Componente cuando la lista está vacía
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="folder-open-outline" size={80} color="#FF6F00" />
      <Text style={styles.emptyText}>No hay tableros registrados</Text>
      <Text style={styles.emptySubtext}>
        Usa la pestaña "Crear" para agregar un nuevo tablero
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F00" />
        <Text style={styles.loadingText}>Cargando tableros...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tableros}
        renderItem={renderTablero}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={deleteMutation.isPending}
            onRefresh={refetch}
            colors={['#FF6F00']}
            tintColor="#FF6F00"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6F00',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  cardBody: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 20,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
