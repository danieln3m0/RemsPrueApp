import React, { useState } from 'react';
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

export default function CreateTableroScreen({ navigation }) {
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

  // Limpiar formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      ubicacion: '',
      voltaje: '',
      capacidad: '',
      marca: '',
      modelo: '',
      fecha_instalacion: '',
    });
  };

  // Enviar formulario
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await TableroController.createTablero(formData);
      
      Alert.alert(
        'Éxito',
        'Tablero creado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              // Navegar a la lista de tableros
              navigation.navigate('Tableros', { screen: 'TablerosList' });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo crear el tablero');
    } finally {
      setLoading(false);
    }
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
            <Ionicons name="add-circle" size={40} color="#2196F3" />
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
                  <Ionicons name="save" size={20} color="white" />
                  <Text style={styles.buttonText}>Guardar Tablero</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={resetForm}
              disabled={loading}
            >
              <Ionicons name="refresh" size={20} color="#666" />
              <Text style={styles.resetButtonText}>Limpiar Formulario</Text>
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
    borderRadius: 8,
    gap: 8,
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
