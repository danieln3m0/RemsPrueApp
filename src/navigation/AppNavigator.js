import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Importar las vistas
import HomeScreen from '../views/HomeScreen';
import TablerosListScreen from '../views/TablerosListScreen';
import CreateTableroScreen from '../views/CreateTableroScreen';
import EditTableroScreen from '../views/EditTableroScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Componente para botón de tema
const ThemeToggleButton = () => {
  const { toggleTheme, isDark } = useTheme();
  
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={{ marginRight: 15 }}
    >
      <Ionicons 
        name={isDark ? 'moon' : 'sunny'} 
        size={24} 
        color="#fff" 
      />
    </TouchableOpacity>
  );
};

// Stack Navigator para la pestaña de Tableros (incluye Lista y Edición)
function TablerosStackNavigator() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen 
        name="TablerosList" 
        component={TablerosListScreen}
        options={{ 
          title: 'Lista de Tableros',
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.colors.buttonText,
          },
          headerRight: () => <ThemeToggleButton />,
        }}
      />
      <Stack.Screen 
        name="EditTablero" 
        component={EditTableroScreen}
        options={{ 
          title: 'Editar Tablero',
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.colors.buttonText,
          },
          headerRight: () => <ThemeToggleButton />,
        }}
      />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator principal
function MainTabNavigator() {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tableros') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Crear') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }
          const iconColor = focused ? theme.colors.primary : theme.colors.iconSecondary;
          return <Ionicons name={iconName} size={size} color={iconColor} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.iconSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.cardBackground,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Inicio" 
        component={HomeScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.colors.buttonText,
          },
          headerRight: () => <ThemeToggleButton />,
        }}
      />
      <Tab.Screen 
        name="Tableros" 
        component={TablerosStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Crear" 
        component={CreateTableroScreen}
        options={{
          headerShown: true,
          title: 'Crear Tablero',
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.colors.buttonText,
          },
          headerRight: () => <ThemeToggleButton />,
        }}
      />
    </Tab.Navigator>
  );
}

// Navegador principal de la aplicación
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
}
