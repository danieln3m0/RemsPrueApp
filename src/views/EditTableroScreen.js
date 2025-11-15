import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import TableroController from '../controllers/TableroController';

export default function EditTableroScreen({ route, navigation }) {
  const { tablero } = route.params;
  
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    voltaje: '',
    capacidad: '',
    marca: '',
    modelo: '',
    fecha_instalacion: '',
  });
  
  const [loading, setLoading] = useState(false);

  // Cargar los datos del tablero al montar el componente
  useEffect(() => {
    if (tablero) {
      setFormData({
        nombre: tablero.nombre || '',
        ubicacion: tablero.ubicacion || '',
        voltaje: tablero.voltaje || '',
        capacidad: tablero.capacidad || '',
        marca: tablero.marca || '',
        modelo: tablero.modelo || '',
        fecha_instalacion: tablero.fecha_instalacion || '',
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
    if (!formData.voltaje.trim()) {
      Alert.alert('Error', 'El voltaje es obligatorio');
      return false;
    }
    return true;
  };

  // Enviar formulario
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await TableroController.updateTablero(tablero.id, formData);
      
      Alert.alert(
        'Éxito',
        'Tablero actualizado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navegar de regreso a la lista de tableros
              navigation.navigate('TablerosList');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo actualizar el tablero');
    } finally {
      setLoading(false);
    }
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
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Ionicons name="create" size={40} color="#2196F3" />
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
              placeholder="Ej: Tablero Principal"
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
              placeholder="Ej: Edificio A - Planta Baja"
              value={formData.ubicacion}
              onChangeText={(value) => handleInputChange('ubicacion', value)}
            />
          </View>

          {/* Voltaje */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Voltaje <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.voltaje}
                onValueChange={(value) => handleInputChange('voltaje', value)}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione un voltaje" value="" />
                <Picker.Item label="110V" value="110V" />
                <Picker.Item label="220V" value="220V" />
                <Picker.Item label="380V" value="380V" />
                <Picker.Item label="440V" value="440V" />
              </Picker>
            </View>
          </View>

          {/* Capacidad */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Capacidad</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 100A"
              value={formData.capacidad}
              onChangeText={(value) => handleInputChange('capacidad', value)}
            />
          </View>

          {/* Marca */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Marca</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Siemens"
              value={formData.marca}
              onChangeText={(value) => handleInputChange('marca', value)}
            />
          </View>

          {/* Modelo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Modelo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: QP-2024"
              value={formData.modelo}
              onChangeText={(value) => handleInputChange('modelo', value)}
            />
          </View>

          {/* Fecha de Instalación */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha de Instalación</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 2024-01-15"
              value={formData.fecha_instalacion}
              onChangeText={(value) => handleInputChange('fecha_instalacion', value)}
            />
            <Text style={styles.hint}>Formato: YYYY-MM-DD</Text>
          </View>

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
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
              disabled={loading}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.requiredNote}>
            <Text style={styles.required}>*</Text> Campos obligatorios
          </Text>
        </View>
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
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    borderRadius: 8,
    gap: 8,
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
