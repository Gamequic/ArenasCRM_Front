// App.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Provider as PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  Text,
} from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Project imports
import { generateMaterialTheme } from './utils/theme';
import MainScreen from './screens/main';
import LogIn from './screens/auth/logIn';
import UpdatePiece from './screens/updatePiece';
import { vibrantDarkOverrides, vibrantLightOverrides} from './utils/vibrantOverrides';

// Base color
const { light, dark } = generateMaterialTheme('#1565C0');

// Stack navigation
const Stack = createNativeStackNavigator();

export default function App() {
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD"
  },
});

/* 
Developer note
  Why is this color picket manually?
  For simplicity, it is probably better ways to do it but it just the fastest one at the time
*/