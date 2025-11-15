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
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function TablerosListScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useLanguage();
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
      Alert.alert(t('error'), error?.message || t('deleteError'));
    }
  }, [isError, error]);

  // Función para eliminar un tablero
  const handleDelete = async (tablero) => {
    console.log('Intentando eliminar tablero:', tablero.id, tablero.nombre);
    
    if (!tablero.id) {
      Alert.alert(t('error'), 'El tablero no tiene un ID válido');
      return;
    }
    
    // Usar confirm() para web, que funciona en todos los navegadores
    const confirmDelete = Platform.OS === 'web' 
      ? window.confirm(`${t('deleteMessage')} "${tablero.nombre}"?\nID: ${tablero.id}`)
      : await new Promise((resolve) => {
          Alert.alert(
            t('confirmDelete'),
            `${t('deleteMessage')} "${tablero.nombre}"?\nID: ${tablero.id}`,
            [
              { text: t('cancel'), style: 'cancel', onPress: () => resolve(false) },
              { text: t('delete'), style: 'destructive', onPress: () => resolve(true) },
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
          alert(t('deletedSuccessfully'));
        } else {
          Alert.alert(t('success'), t('deletedSuccessfully'));
        }
      },
      onError: (error) => {
        console.error('Error al eliminar:', error);
        if (Platform.OS === 'web') {
          alert(`${t('error')}: ${error.message || t('deleteError')}`);
        } else {
          Alert.alert(t('error'), error.message || t('deleteError'));
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
          <Ionicons name="flash" size={24} color={theme.colors.primary} />
          <Text style={styles.cardTitle}>{item.nombre}</Text>
        </View>
      
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color={theme.colors.iconSecondary} />
            <Text style={styles.infoText}>{item.ubicacion}</Text>
          </View>
          
          {item.estado && (
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={16} color={theme.colors.primary} />
              <Text style={styles.infoText}>Estado: {item.estado}</Text>
            </View>
          )}
          
          {item.capacidad_amperios && (
            <View style={styles.infoRow}>
              <Ionicons name="speedometer" size={16} color={theme.colors.iconSecondary} />
              <Text style={styles.infoText}>{item.capacidad_amperios} A</Text>
            </View>
          )}
          
          {item.marca && (
            <View style={styles.infoRow}>
              <Ionicons name="pricetag" size={16} color={theme.colors.primary} />
              <Text style={styles.infoText}>{item.marca}</Text>
            </View>
          )}
          
          {(item.ano_fabricacion || item.ano_instalacion) && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={16} color={theme.colors.primary} />
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
            <Text style={styles.buttonText}>{t('edit')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => handleDelete(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash" size={20} color="white" />
            <Text style={styles.buttonText}>{t('delete')}</Text>
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
      <Ionicons name="folder-open-outline" size={80} color={theme.colors.primary} />
      <Text style={styles.emptyText}>{t('noBoards')}</Text>
      <Text style={styles.emptySubtext}>
        {t('noBoardsSubtext')}
      </Text>
    </View>
  );

  const styles = getStyles(theme);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>{t('loading')}</Text>
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
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
    marginLeft: 12,
    flex: 1,
    letterSpacing: 0.3,
  },
  cardBody: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 10,
    letterSpacing: 0.2,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 13,
    borderRadius: 12,
    gap: 6,
  },
  editButton: {
    backgroundColor: theme.colors.secondary,
  },
  deleteButton: {
    backgroundColor: theme.colors.danger,
  },
  buttonText: {
    color: theme.colors.buttonText,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.primary,
    marginTop: 20,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
