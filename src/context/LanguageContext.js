import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  es: {
    // Navigation
    home: 'Inicio',
    boards: 'Tableros',
    create: 'Crear',
    
    // Home Screen
    personalInfo: 'Información personal',
    fullName: 'Nombre Completo',
    email: 'Correo Electrónico',
    professionalProfile: 'Perfil Profesional',
    whyHireMe: '¿Por qué contratarme?',
    technicalSkills: 'Habilidades Técnicas',
    profileDescription: 'Desarrollador Full Stack con amplia experiencia en React Native y tecnologías móviles. Especializado en la creación de aplicaciones móviles escalables y de alto rendimiento, con sólidos conocimientos en arquitecturas limpias como MVC y patrones de diseño modernos.',
    reason1: 'Experiencia en desarrollo de aplicaciones móviles multiplataforma',
    reason2: 'Conocimientos sólidos en arquitecturas limpias y mejores prácticas',
    reason3: 'Capacidad para trabajar con APIs REST y gestión de estados',
    reason4: 'Enfoque en la calidad del código y experiencia del usuario',
    reason5: 'Aprendizaje continuo y adaptación a nuevas tecnologías',
    
    // List Screen
    boardsList: 'Lista de Tableros',
    editBoard: 'Editar Tablero',
    loading: 'Cargando tableros...',
    noBoards: 'No hay tableros registrados',
    noBoardsSubtext: 'Usa la pestaña "Crear" para agregar un nuevo tablero',
    confirmDelete: 'Confirmar Eliminación',
    deleteMessage: '¿Estás seguro de eliminar el tablero',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    success: 'Éxito',
    deletedSuccessfully: 'Tablero eliminado correctamente',
    error: 'Error',
    deleteError: 'No se pudo eliminar el tablero',
    edit: 'Editar',
    
    // Create Screen
    createBoard: 'Crear Tablero',
    newElectricalBoard: 'Nuevo Tablero Eléctrico',
    completeData: 'Complete los datos del tablero',
    name: 'Nombre',
    namePlaceholder: 'Ej: Tablero Piso 1 - Ala Norte',
    location: 'Ubicación',
    locationPlaceholder: 'Ej: Sala de máquinas, Sótano 1',
    manufacturingYear: 'Año de Fabricación',
    installationYear: 'Año de Instalación',
    capacity: 'Capacidad (Amperios)',
    capacityPlaceholder: 'Ej: 200',
    status: 'Estado',
    brand: 'Marca',
    brandPlaceholder: 'Ej: Schneider Electric',
    selectOption: 'Seleccionar una opción',
    selectYear: 'Seleccionar año',
    statusOperational: 'Operativo',
    statusMaintenance: 'En Mantenimiento',
    statusOutOfService: 'Fuera de Servicio',
    requiredFields: 'Campos obligatorios',
    confirmCreate: 'Confirmar Creación',
    createMessage: '¿Está seguro de que desea crear este tablero?',
    confirm: 'Confirmar',
    creating: 'Creando...',
    save: 'Guardar',
    clearForm: 'Limpiar Formulario',
    createdSuccessfully: 'Tablero creado exitosamente',
    
    // Edit Screen
    editingBoard: 'Editar Tablero',
    modifyData: 'Modifica los datos del tablero',
    boardId: 'ID del Tablero',
    confirmUpdate: 'Confirmar Actualización',
    updateMessage: '¿Está seguro de que desea actualizar este tablero?',
    updating: 'Actualizando...',
    update: 'Actualizar',
    updatedSuccessfully: 'Tablero actualizado exitosamente',
    discardChanges: '¿Descartar cambios?',
    discardMessage: '¿Está seguro de que desea descartar los cambios?',
    yes: 'Sí',
    no: 'No',
    
    // Validation
    allFieldsRequired: 'Todos los campos son obligatorios',
    validationError: 'Error de Validación',
  },
  en: {
    // Navigation
    home: 'Home',
    boards: 'Boards',
    create: 'Create',
    
    // Home Screen
    personalInfo: 'Personal Information',
    fullName: 'Full Name',
    email: 'Email',
    professionalProfile: 'Professional Profile',
    whyHireMe: 'Why hire me?',
    technicalSkills: 'Technical Skills',
    profileDescription: 'Full Stack Developer with extensive experience in React Native and mobile technologies. Specialized in creating scalable, high-performance mobile applications, with solid knowledge in clean architectures like MVC and modern design patterns.',
    reason1: 'Experience in cross-platform mobile application development',
    reason2: 'Strong knowledge in clean architectures and best practices',
    reason3: 'Ability to work with REST APIs and state management',
    reason4: 'Focus on code quality and user experience',
    reason5: 'Continuous learning and adaptation to new technologies',
    
    // List Screen
    boardsList: 'Boards List',
    editBoard: 'Edit Board',
    loading: 'Loading boards...',
    noBoards: 'No boards registered',
    noBoardsSubtext: 'Use the "Create" tab to add a new board',
    confirmDelete: 'Confirm Deletion',
    deleteMessage: 'Are you sure you want to delete the board',
    cancel: 'Cancel',
    delete: 'Delete',
    success: 'Success',
    deletedSuccessfully: 'Board deleted successfully',
    error: 'Error',
    deleteError: 'Could not delete the board',
    edit: 'Edit',
    
    // Create Screen
    createBoard: 'Create Board',
    newElectricalBoard: 'New Electrical Board',
    completeData: 'Complete the board data',
    name: 'Name',
    namePlaceholder: 'Ex: Floor 1 Board - North Wing',
    location: 'Location',
    locationPlaceholder: 'Ex: Machine room, Basement 1',
    manufacturingYear: 'Manufacturing Year',
    installationYear: 'Installation Year',
    capacity: 'Capacity (Amperes)',
    capacityPlaceholder: 'Ex: 200',
    status: 'Status',
    brand: 'Brand',
    brandPlaceholder: 'Ex: Schneider Electric',
    selectOption: 'Select an option',
    selectYear: 'Select year',
    statusOperational: 'Operational',
    statusMaintenance: 'Under Maintenance',
    statusOutOfService: 'Out of Service',
    requiredFields: 'Required fields',
    confirmCreate: 'Confirm Creation',
    createMessage: 'Are you sure you want to create this board?',
    confirm: 'Confirm',
    creating: 'Creating...',
    save: 'Save',
    clearForm: 'Clear Form',
    createdSuccessfully: 'Board created successfully',
    
    // Edit Screen
    editingBoard: 'Edit Board',
    modifyData: 'Modify board data',
    boardId: 'Board ID',
    confirmUpdate: 'Confirm Update',
    updateMessage: 'Are you sure you want to update this board?',
    updating: 'Updating...',
    update: 'Update',
    updatedSuccessfully: 'Board updated successfully',
    discardChanges: 'Discard changes?',
    discardMessage: 'Are you sure you want to discard the changes?',
    yes: 'Yes',
    no: 'No',
    
    // Validation
    allFieldsRequired: 'All fields are required',
    validationError: 'Validation Error',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
