import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';

const colorKeys = [
  'primary',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'secondary',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'tertiary',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'error',
  'onError',
  'errorContainer',
  'onErrorContainer',
  'background',
  'onBackground',
  'surface',
  'onSurface',
  'surfaceVariant',
  'onSurfaceVariant',
  'outline',
  'shadow',
  'inverseSurface',
  'inverseOnSurface',
  'inversePrimary',
];

export default function ThemeColorsScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {colorKeys.map((key) => {
        const colorValue = colors[key];
        if (!colorValue) return null;
        return (
          <View key={key} style={styles.colorRow}>
            <View style={[styles.colorBox, { backgroundColor: colorValue }]} />
            <Text style={styles.colorName}>{key}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  colorName: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
