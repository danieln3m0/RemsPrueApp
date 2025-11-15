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
import { useCreateTablero } from '../hooks/useTableros';

export default function CreateTableroScreen({ navigation }) {
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    ano_fabricacion: '',
    ano_instalacion: '',
    capacidad_amperios: '',
    estado: '',
    marca: '',
  });
  
  const [pendingSubmit, setPendingSubmit] = useState(false);
  
  // React Query mutation
  const createMutation = useCreateTablero();
  
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

  // Limpiar formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      ubicacion: '',
      ano_fabricacion: '',
      ano_instalacion: '',
      capacidad_amperios: '',
      estado: '',
      marca: '',
    });
  };

  // Lógica real de creación con React Query
  const submitCreate = () => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        Alert.alert(
          'Éxito',
          'Tablero creado correctamente',
          [
            {
              text: 'OK',
              onPress: () => {
                resetForm();
                navigation.navigate('Tableros', { screen: 'TablerosList' });
              },
            },
          ]
        );
        setPendingSubmit(false);
      },
      onError: (error) => {
        Alert.alert('Error', error.message || 'No se pudo crear el tablero');
        setPendingSubmit(false);
      },
    });
  };

  useEffect(() => {
    if (pendingSubmit) {
      submitCreate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSubmit]);

  // Enviar formulario
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    Alert.alert(
      'Confirmar Creación',
      '¿Está seguro de que desea crear este tablero?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => setPendingSubmit(true),
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
            <Ionicons name="add-circle" size={40} color="#FF6F00" />
            <Text style={styles.headerTitle}>Nuevo Tablero Eléctrico</Text>
            <Text style={styles.headerSubtitle}>
              Complete los datos del tablero
            </Text>
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
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="save" size={20} color="white" />
                  <Text style={styles.buttonText}>Guardar Tablero</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={resetForm}
              disabled={createMutation.isPending}
            >
              <Ionicons name="refresh" size={20} color="#FF6F00" />
              <Text style={styles.resetButtonText}>Limpiar Formulario</Text>
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
    marginBottom: 30,
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
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resetButtonText: {
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
