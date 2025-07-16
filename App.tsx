// App.tsx
import React from 'react';
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
} from 'react-native-paper';

// Project imports
import { generateMaterialTheme } from './utils/theme';
import MainScreen from './screens/main';
import { vibrantDarkOverrides, vibrantLightOverrides} from './utils/vibrantOverrides';

// Base color
const { light, dark } = generateMaterialTheme('#1565C0');

export default function App() {
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
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            <StatusBar
              barStyle={isDark ? 'light-content' : 'dark-content'}
            />
            <MainScreen />
          </View>
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
