import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Importar las vistas
import HomeScreen from '../views/HomeScreen';
import TablerosListScreen from '../views/TablerosListScreen';
import CreateTableroScreen from '../views/CreateTableroScreen';
import EditTableroScreen from '../views/EditTableroScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator para la pestaña de Tableros (incluye Lista y Edición)
function TablerosStackNavigator() {
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
            backgroundColor: '#FF6F00',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#111',
          },
        }}
      />
      <Stack.Screen 
        name="EditTablero" 
        component={EditTableroScreen}
        options={{ 
          title: 'Editar Tablero',
          headerStyle: {
            backgroundColor: '#FF6F00',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#111',
          },
        }}
      />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator principal
function MainTabNavigator() {
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
          // Naranja activo, negro inactivo
          const iconColor = focused ? '#FF6F00' : '#111';
          return <Ionicons name={iconName} size={size} color={iconColor} />;
        },
        tabBarActiveTintColor: '#FF6F00',
        tabBarInactiveTintColor: '#111',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#FF6F00',
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
            backgroundColor: '#FF6F00',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#111',
          },
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
            backgroundColor: '#FF6F00',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#111',
          },
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
