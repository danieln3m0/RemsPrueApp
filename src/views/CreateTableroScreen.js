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
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function CreateTableroScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useLanguage();
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
      Alert.alert(t('validationError'), t('allFieldsRequired'));
      return false;
    }
    if (!formData.ubicacion.trim()) {
      Alert.alert(t('validationError'), t('allFieldsRequired'));
      return false;
    }
    if (!formData.ano_fabricacion || isNaN(Number(formData.ano_fabricacion))) {
      Alert.alert(t('validationError'), t('allFieldsRequired'));
      return false;
    }
    if (!formData.ano_instalacion || isNaN(Number(formData.ano_instalacion))) {
      Alert.alert(t('validationError'), t('allFieldsRequired'));
      return false;
    }
    if (!formData.capacidad_amperios || isNaN(Number(formData.capacidad_amperios))) {
      Alert.alert(t('validationError'), t('allFieldsRequired'));
      return false;
    }
    if (!formData.estado.trim()) {
      Alert.alert(t('validationError'), t('allFieldsRequired'));
      return false;
    }
    if (!formData.marca.trim()) {
      Alert.alert(t('validationError'), t('allFieldsRequired'));
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
          t('success'),
          t('createdSuccessfully'),
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
        Alert.alert(t('error'), error.message || t('deleteError'));
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
      t('confirmCreate'),
      t('createMessage'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('confirm'),
          onPress: () => setPendingSubmit(true),
        },
      ]
    );
  };

  const styles = getStyles(theme);

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
            <Ionicons name="add-circle" size={40} color={theme.colors.primary} />
            <Text style={styles.headerTitle}>{t('newElectricalBoard')}</Text>
            <Text style={styles.headerSubtitle}>
              {t('completeData')}
            </Text>
          </View>

          {/* Nombre */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {t('name')} <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('namePlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
            />
          </View>

          {/* Ubicación */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {t('location')} <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('locationPlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.ubicacion}
              onChangeText={(value) => handleInputChange('ubicacion', value)}
            />
          </View>

          {/* Año de Fabricación */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {t('manufacturingYear')} <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.ano_fabricacion}
                onValueChange={(value) => handleInputChange('ano_fabricacion', value)}
                style={styles.picker}
              >
                <Picker.Item label={t('selectYear')} value="" />
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
              {t('installationYear')} <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.ano_instalacion}
                onValueChange={(value) => handleInputChange('ano_instalacion', value)}
                style={styles.picker}
              >
                <Picker.Item label={t('selectYear')} value="" />
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
              {t('capacity')} <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('capacityPlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
              value={formData.capacidad_amperios}
              onChangeText={(value) => handleInputChange('capacidad_amperios', value)}
            />
          </View>

          {/* Estado */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {t('status')} <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.estado}
                onValueChange={(value) => handleInputChange('estado', value)}
                style={styles.picker}
              >
                <Picker.Item label={t('selectOption')} value="" />
                <Picker.Item label={t('statusOperational')} value="Operativo" />
                <Picker.Item label={t('statusMaintenance')} value="Mantenimiento" />
                <Picker.Item label={t('statusOutOfService')} value="Fuera de servicio" />
              </Picker>
            </View>
          </View>

          {/* Marca */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {t('brand')} <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('brandPlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
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
                  <Text style={styles.buttonText}>{t('save')}</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={resetForm}
              disabled={createMutation.isPending}
            >
              <Ionicons name="refresh" size={20} color={theme.colors.primary} />
              <Text style={styles.resetButtonText}>{t('clearForm')}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.requiredNote}>
            <Text style={styles.required}>*</Text> {t('requiredFields')}
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formContainer: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 12,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 6,
    letterSpacing: 0.2,
  },
  inputGroup: {
    marginBottom: 22,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  required: {
    color: theme.colors.danger,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: theme.colors.inputBackground,
    color: theme.colors.text,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    backgroundColor: theme.colors.inputBackground,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: theme.colors.text,
  },
  hint: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 6,
    fontStyle: 'italic',
    letterSpacing: 0.2,
  },
  buttonContainer: {
    marginTop: 28,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButton: {
    backgroundColor: theme.colors.secondary,
  },
  buttonText: {
    color: theme.colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  resetButton: {
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resetButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  requiredNote: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 15,
    textAlign: 'center',
  },
});
