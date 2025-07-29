// App.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  AppState,
} from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Provider as PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  useTheme,
} from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Project imports
import { generateMaterialTheme } from './utils/theme';
import MainScreen from './screens/main';
import LogIn from './screens/auth/logIn';
import UpdatePiece from './screens/updatePiece';
import { vibrantDarkOverrides, vibrantLightOverrides} from './utils/vibrantOverrides';
import { setLogoutCallback } from './utils/axios';
import AuthService from './services/auth.service';

// Base color
const { light, dark } = generateMaterialTheme('#1565C0');

// Stack navigation
const Stack = createNativeStackNavigator();

const service = new AuthService();

export default function App() {
  const { colors } = useTheme();
  const [ isLogin, setIsLogin ] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const vibrantLightTheme = { ...light, ...vibrantLightOverrides };
  const vibrantDarkTheme = { ...dark, ...vibrantDarkOverrides };

  const paperTheme = {
    ...(isDark ? MD3DarkTheme : MD3LightTheme),
    colors: {
      ...((isDark ? MD3DarkTheme : MD3LightTheme).colors),
      ... (isDark ? vibrantDarkTheme : vibrantLightTheme),
    },
  };

  useEffect(() => {
    setLogoutCallback(() => {
      setIsLogin(false);
    });
  }, []);

  // Check if user is login
  const validate = async () => {
    const data = await service.Validate();
    // If validate give a good answer, then valid users
    setIsLogin(typeof data?.user_id === "number")
  }
  useEffect(() => {
    validate();
  }, [])

  // Log out the user if rememberMe is false
  const appState = useRef(AppState.currentState);

  const logoutIfNotRemembering = async () => {
    const rememberMe = await AsyncStorage.getItem('rememberMe');
    // null - "true" - "false"
    if (rememberMe === "false") {
      setIsLogin(false);
      service.LogOut();
    }
  }

  // useEffect to know when the app is close
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        logoutIfNotRemembering()
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
}, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {isLogin ? (
                <>
                  <Stack.Screen name="MainTabs" component={MainScreen} />
                  <Stack.Screen name="UpdatePiece" component={UpdatePiece} />
                </>
              ) : (
                <Stack.Screen name="LogIn">
                  {props => <LogIn {...props} setIsLogin={setIsLogin} />}
                </Stack.Screen>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
