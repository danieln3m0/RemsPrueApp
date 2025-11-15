# RemsPrueApp - Aplicación de Gestión de Tableros Eléctricos

Aplicación móvil desarrollada en React Native para la gestión de tableros eléctricos utilizando arquitectura MVC.

## 🏗️ Arquitectura

La aplicación sigue el patrón de arquitectura **MVC (Model-View-Controller)**:

### Estructura de Carpetas

```
RemsPrueApp/
├── src/
│   ├── models/              # Modelos de datos
│   │   └── TableroElectrico.js
│   ├── controllers/         # Lógica de negocio
│   │   └── TableroController.js
│   ├── views/              # Vistas/Pantallas
│   │   ├── HomeScreen.js
│   │   ├── TablerosListScreen.js
│   │   ├── CreateTableroScreen.js
│   │   └── EditTableroScreen.js
│   ├── navigation/         # Configuración de navegación
│   │   └── AppNavigator.js
│   └── config/            # Configuraciones
│       └── api.js
├── App.js
├── package.json
└── README.md
```

## 📱 Características

### Navegación

- **Bottom Tab Navigator** con 3 pestañas principales:
  1. **Inicio**: Información del candidato
  2. **Tableros**: Lista de tableros con navegación a edición
  3. **Crear**: Formulario de creación

- **Stack Navigator** anidado en "Tableros" para navegación a edición

### Vistas Implementadas

#### 1. Vista Inicio (Home)
- Muestra información del candidato
- Nombre completo
- Correo electrónico
- Perfil profesional
- Razones para contratar
- Habilidades técnicas

#### 2. Vista Lista de Tableros
- Consume endpoint `GET /tableros/`
- FlatList con todos los tableros
- Muestra nombre y ubicación de cada tablero
- Botones de **Editar** y **Eliminar** por cada ítem
- Pull-to-refresh
- Navegación a vista de edición
- Eliminación con confirmación

#### 3. Vista Crear Tablero
- Formulario completo para crear tableros
- Campos:
  - Nombre (obligatorio)
  - Ubicación (obligatorio)
  - Voltaje (obligatorio - selector)
  - Capacidad
  - Marca
  - Modelo
  - Fecha de instalación
- Validación de campos obligatorios
- Llama a `POST /tableros/`
- Navega automáticamente a lista tras creación exitosa

#### 4. Vista Editar Tablero
- Formulario precargado con datos del tablero
- Mismos campos que la vista de creación
- Llama a `PUT /tableros/{tablero_id}`
- Navega automáticamente a lista tras actualización

## 🔌 API Endpoints

La aplicación consume los siguientes endpoints:

- `POST /tableros/` - Crear tablero
- `GET /tableros/` - Obtener todos los tableros
- `GET /tableros/{tablero_id}` - Obtener un tablero específico
- `PUT /tableros/{tablero_id}` - Actualizar tablero
- `DELETE /tableros/{tablero_id}` - Eliminar tablero

## ⚙️ Configuración

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar URL de la API

Edita el archivo `src/config/api.js` y cambia la URL base:

```javascript
const API_BASE_URL = 'http://tu-api-url:puerto';
```

**Importante**: 
- Si usas un emulador Android, usa `http://10.0.2.2:8000` para localhost
- Si usas un dispositivo físico, usa la IP local de tu computadora

### 3. Ejecutar la Aplicación

```bash
# Iniciar Metro Bundler
npm start

# Para Android
npm run android

# Para iOS
npm run ios

# Para web
npm run web
```

## 📦 Dependencias Principales

- **React Native** 0.72.6
- **Expo** ~49.0.0
- **React Navigation** 6.x
  - @react-navigation/native
  - @react-navigation/bottom-tabs
  - @react-navigation/stack
- **Axios** - Para peticiones HTTP
- **@react-native-picker/picker** - Selector de opciones

## 🎨 Características de UI/UX

- Diseño Material Design
- Iconos de Ionicons
- Colores consistentes:
  - Primary: #2196F3 (Azul)
  - Success: #4CAF50 (Verde)
  - Danger: #f44336 (Rojo)
- Feedback visual con ActivityIndicator
- Alertas de confirmación para acciones destructivas
- Pull-to-refresh en lista
- Validación de formularios
- Estados de carga

## 🔧 Arquitectura MVC

### Model (Modelo)
- `TableroElectrico.js`: Define la estructura de datos y validaciones

### Controller (Controlador)
- `TableroController.js`: Maneja la lógica de negocio y comunicación con la API
- Centraliza las operaciones CRUD
- Manejo de errores

### View (Vista)
- `HomeScreen.js`: Vista de presentación
- `TablerosListScreen.js`: Vista de lista
- `CreateTableroScreen.js`: Vista de creación
- `EditTableroScreen.js`: Vista de edición

## 📝 Notas Importantes

1. **Configuración de API**: No olvides configurar la URL correcta de tu API en `src/config/api.js`

2. **Permisos de Red**: Si usas Android, asegúrate de que tu `AndroidManifest.xml` permita conexiones HTTP si tu API no usa HTTPS

3. **CORS**: Si tienes problemas de CORS, configura tu backend para permitir las peticiones desde el origen de la app

4. **Estados de la Aplicación**: La aplicación maneja correctamente:
   - Carga inicial
   - Estados de loading
   - Errores de red
   - Validaciones de formulario
   - Navegación entre pantallas

## 🚀 Próximas Mejoras

- Implementar Context API o Redux para gestión de estado global
- Añadir autenticación
- Implementar caché offline
- Añadir tests unitarios y de integración
- Mejorar manejo de errores
- Añadir selector de fechas visual
- Implementar búsqueda y filtros en la lista

## 👨‍💻 Autor

**Francis Daniel Nemocón**
- Email: francis.nemocon@ejemplo.com

## 📄 Licencia

Este proyecto es una prueba técnica.
