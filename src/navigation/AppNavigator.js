import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

// Importar las vistas
import HomeScreen from '../views/HomeScreen';
import TablerosListScreen from '../views/TablerosListScreen';
import CreateTableroScreen from '../views/CreateTableroScreen';
import EditTableroScreen from '../views/EditTableroScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Componente para botón de idioma con animación
const LanguageToggleButton = () => {
  const { language, toggleLanguage } = useLanguage();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    toggleLanguage();
  };
  
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.headerButton}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={styles.flagIcon}>
          {language === 'es' ? '🇪🇸' : '🇺🇸'}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Componente para botón de tema con animación
const ThemeToggleButton = () => {
  const { toggleTheme, isDark } = useTheme();
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
    toggleTheme();
  };
  
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.headerButton}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <Ionicons 
          name={isDark ? 'moon' : 'sunny'} 
          size={24} 
          color="#fff" 
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

// Componente que agrupa ambos botones
const HeaderButtons = () => {
  return (
    <View style={styles.headerButtonsContainer}>
      <LanguageToggleButton />
      <ThemeToggleButton />
    </View>
  );
};

// Stack Navigator para la pestaña de Tableros (incluye Lista y Edición)
function TablerosStackNavigator() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: ({ current, next, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
                {
                  scale: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
              opacity: current.progress.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.8, 1],
              }),
            },
            overlayStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
            },
          };
        },
        transitionSpec: {
          open: {
            animation: 'spring',
            config: {
              stiffness: 300,
              damping: 30,
              mass: 1,
            },
          },
          close: {
            animation: 'spring',
            config: {
              stiffness: 300,
              damping: 30,
              mass: 1,
            },
          },
        },
      }}
    >
      <Stack.Screen 
        name="TablerosList" 
        component={TablerosListScreen}
        options={{ 
          title: t('boardsList'),
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.colors.buttonText,
          },
          headerRight: () => <HeaderButtons />,
        }}
      />
      <Stack.Screen 
        name="EditTablero" 
        component={EditTableroScreen}
        options={{ 
          title: t('editBoard'),
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.colors.buttonText,
          },
          headerRight: () => <HeaderButtons />,
        }}
      />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator principal
function MainTabNavigator() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
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
          
          const scaleValue = React.useRef(new Animated.Value(focused ? 1 : 0)).current;
          
          React.useEffect(() => {
            Animated.spring(scaleValue, {
              toValue: focused ? 1 : 0,
              friction: 5,
              tension: 100,
              useNativeDriver: true,
            }).start();
          }, [focused]);
          
          const scale = scaleValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.9, 1.15],
          });
          
          const dropScale = scaleValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          });
          
          return (
            <View style={styles.tabIconContainer}>
              <Animated.View style={{ transform: [{ scale }] }}>
                <View style={[
                  styles.iconWrapper,
                  focused && { 
                    ...styles.iconWrapperFocused,
                    backgroundColor: `${theme.colors.primary}15`,
                  }
                ]}>
                  <Ionicons name={iconName} size={size} color={iconColor} />
                  {focused && (
                    <Animated.View 
                      style={[
                        styles.dropIndicator, 
                        { 
                          backgroundColor: theme.colors.primary,
                          transform: [{ scale: dropScale }],
                        }
                      ]} 
                    />
                  )}
                </View>
              </Animated.View>
            </View>
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.iconSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.cardBackground,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 65,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -5,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}
    >
      <Tab.Screen 
        name="Inicio" 
        component={HomeScreen}
        options={{
          headerShown: true,
          title: t('home'),
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.colors.buttonText,
          },
          headerRight: () => <HeaderButtons />,
        }}
      />
      <Tab.Screen 
        name="Tableros" 
        component={TablerosStackNavigator}
        options={{
          headerShown: false,
          title: t('boards'),
        }}
      />
      <Tab.Screen 
        name="Crear" 
        component={CreateTableroScreen}
        options={{
          headerShown: true,
          title: t('createBoard'),
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.colors.buttonText,
          },
          headerRight: () => <HeaderButtons />,
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

const styles = StyleSheet.create({
  headerButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  headerButton: {
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  flagIcon: {
    fontSize: 26,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    position: 'relative',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'relative',
  },
  iconWrapperFocused: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  dropIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});
