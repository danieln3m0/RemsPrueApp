import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import TableroController from '../controllers/TableroController';

export default function TablerosListScreen({ navigation }) {
  const [tableros, setTableros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar tableros al montar el componente
  useEffect(() => {
    loadTableros();
  }, []);

  // Recargar tableros cada vez que la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      loadTableros();
    }, [])
  );

  // Función para cargar todos los tableros
  const loadTableros = async () => {
    try {
      setLoading(true);
      const data = await TableroController.getAllTableros();
      setTableros(data);
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudieron cargar los tableros');
    } finally {
      setLoading(false);
    }
  };

  // Función para refrescar la lista (pull to refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    await loadTableros();
    setRefreshing(false);
  };

  // Función para eliminar un tablero
  const handleDelete = (tablero) => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de eliminar el tablero "${tablero.nombre}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await TableroController.deleteTablero(tablero.id);
              Alert.alert('Éxito', 'Tablero eliminado correctamente');
              // Recargar la lista
              loadTableros();
            } catch (error) {
              Alert.alert('Error', error.message || 'No se pudo eliminar el tablero');
            }
          },
        },
      ]
    );
  };

  // Función para navegar a la pantalla de edición
  const handleEdit = (tablero) => {
    navigation.navigate('EditTablero', { tablero });
  };

  // Renderizar cada ítem de la lista
  const renderTablero = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="flash" size={24} color="#2196F3" />
        <Text style={styles.cardTitle}>{item.nombre}</Text>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.infoText}>{item.ubicacion}</Text>
        </View>
        
        {item.voltaje && (
          <View style={styles.infoRow}>
            <Ionicons name="speedometer" size={16} color="#666" />
            <Text style={styles.infoText}>{item.voltaje}</Text>
          </View>
        )}
        
        {item.marca && (
          <View style={styles.infoRow}>
            <Ionicons name="pricetag" size={16} color="#666" />
            <Text style={styles.infoText}>{item.marca}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="create" size={20} color="white" />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash" size={20} color="white" />
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Componente cuando la lista está vacía
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="folder-open-outline" size={80} color="#ccc" />
      <Text style={styles.emptyText}>No hay tableros registrados</Text>
      <Text style={styles.emptySubtext}>
        Usa la pestaña "Crear" para agregar un nuevo tablero
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
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
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
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
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    borderRadius: 8,
    gap: 5,
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
