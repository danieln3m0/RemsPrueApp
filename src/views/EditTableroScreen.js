import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useUpdateTablero } from '../hooks/useTableros';

export default function EditTableroScreen({ route, navigation }) {
  const { tablero } = route.params;
  
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    ano_fabricacion: '',
    ano_instalacion: '',
    capacidad_amperios: '',
    estado: '',
    marca: '',
  });
  
  // React Query mutation
  const updateMutation = useUpdateTablero();
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Cargar los datos del tablero al montar el componente
  useEffect(() => {
    if (tablero) {
      setFormData({
        nombre: tablero.nombre || '',
        ubicacion: tablero.ubicacion || '',
        ano_fabricacion: tablero.ano_fabricacion ? String(tablero.ano_fabricacion) : '',
        ano_instalacion: tablero.ano_instalacion ? String(tablero.ano_instalacion) : '',
        capacidad_amperios: tablero.capacidad_amperios ? String(tablero.capacidad_amperios) : '',
        estado: tablero.estado || '',
        marca: tablero.marca || '',
      });
    }
  }, [tablero]);

  // Actualizar valores del formulario
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Validar formulario
  const validateForm = () => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return false;
    }
    if (!formData.ubicacion.trim()) {
      Alert.alert('Error', 'La ubicación es obligatoria');
      return false;
    }
    if (!formData.ano_fabricacion || isNaN(Number(formData.ano_fabricacion))) {
      Alert.alert('Error', 'El año de fabricación es obligatorio y debe ser un número');
      return false;
    }
    if (!formData.ano_instalacion || isNaN(Number(formData.ano_instalacion))) {
      Alert.alert('Error', 'El año de instalación es obligatorio y debe ser un número');
      return false;
    }
    if (!formData.capacidad_amperios || isNaN(Number(formData.capacidad_amperios))) {
      Alert.alert('Error', 'La capacidad en amperios es obligatoria y debe ser un número');
      return false;
    }
    if (!formData.estado.trim()) {
      Alert.alert('Error', 'El estado es obligatorio');
      return false;
    }
    if (!formData.marca.trim()) {
      Alert.alert('Error', 'La marca es obligatoria');
      return false;
    }
    return true;
  };

  // Lógica real de edición con React Query
  const submitEdit = () => {
    updateMutation.mutate(
      { id: tablero.id, data: formData },
      {
        onSuccess: () => {
          Alert.alert(
            'Éxito',
            'Tablero actualizado correctamente',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('TablerosList');
                },
              },
            ]
          );
        },
        onError: (error) => {
          Alert.alert('Error', error.message || 'No se pudo actualizar el tablero');
        },
      }
    );
  };

  // Enviar formulario
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    Alert.alert(
      'Confirmar Actualización',
      '¿Está seguro de que desea guardar los cambios?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: submitEdit,
        },
      ]
    );
  };

  // Cancelar y volver atrás
  const handleCancel = () => {
    Alert.alert(
      'Cancelar',
      '¿Deseas descartar los cambios?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View 
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Ionicons name="create" size={40} color="#FF6F00" />
            <Text style={styles.headerTitle}>Editar Tablero</Text>
            <Text style={styles.headerSubtitle}>
              Modifica los datos del tablero
            </Text>
          </View>

          {/* ID del tablero (solo lectura) */}
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>ID del Tablero:</Text>
            <Text style={styles.infoValue}>{tablero.id}</Text>
          </View>

          {/* Nombre */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nombre <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Tablero Piso 1 - Ala Norte"
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
            />
          </View>

          {/* Ubicación */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Ubicación <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Sala de máquinas, Sótano 1"
              value={formData.ubicacion}
              onChangeText={(value) => handleInputChange('ubicacion', value)}
            />
          </View>

          {/* Año de Fabricación */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Año de Fabricación <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.ano_fabricacion}
                onValueChange={(value) => handleInputChange('ano_fabricacion', value)}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione un año" value="" />
                {Array.from({ length: 50 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <Picker.Item key={year} label={year.toString()} value={year.toString()} />;
                })}
              </Picker>
            </View>
          </View>

          {/* Año de Instalación */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Año de Instalación <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.ano_instalacion}
                onValueChange={(value) => handleInputChange('ano_instalacion', value)}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione un año" value="" />
                {Array.from({ length: 50 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <Picker.Item key={year} label={year.toString()} value={year.toString()} />;
                })}
              </Picker>
            </View>
          </View>

          {/* Capacidad en Amperios */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Capacidad (Amperios) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 200"
              keyboardType="numeric"
              value={formData.capacidad_amperios}
              onChangeText={(value) => handleInputChange('capacidad_amperios', value)}
            />
          </View>

          {/* Estado */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Estado <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.estado}
                onValueChange={(value) => handleInputChange('estado', value)}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione un estado" value="" />
                <Picker.Item label="Operativo" value="Operativo" />
                <Picker.Item label="Mantenimiento" value="Mantenimiento" />
                <Picker.Item label="Fuera de servicio" value="Fuera de servicio" />
              </Picker>
            </View>
          </View>

          {/* Marca */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Marca <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Schneider Electric"
              value={formData.marca}
              onChangeText={(value) => handleInputChange('marca', value)}
            />
          </View>

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <Text style={styles.buttonText}>Actualizar</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={updateMutation.isPending}
            >
              <Ionicons name="close-circle" size={20} color="#FF6F00" />
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.requiredNote}>
            <Text style={styles.required}>*</Text> Campos obligatorios
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    borderTopWidth: 3,
    borderTopColor: '#FF6F00',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#f44336',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  requiredNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
});
