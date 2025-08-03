import * as React from 'react';
import { useWindowDimensions, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomNavigation, useTheme, IconButton } from 'react-native-paper';

// Project import
import AddPiece from '../addPiece';
import FindPiece from '../findPieces';
// import ThemeColorsScreen from '../dev/colors';

const MainScreen = () => {
  const { width, height } = useWindowDimensions();
  const { colors } = useTheme();
  const isLandscape = width > height;

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'addPiece', title: 'Agregar pieza', focusedIcon: 'plus-box-multiple', unfocusedIcon: 'plus-box-multiple-outline' },
    { key: 'findPiece', title: 'Buscar piezas', focusedIcon: 'view-list', unfocusedIcon: 'view-list-outline' },
    // { key: 'colors', title: 'Colores', focusedIcon: 'album' }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    addPiece: AddPiece,
    findPiece: FindPiece,
    // colors: ThemeColorsScreen,
  });

  // 👇 Render vertical sidebar when in landscape mode
  if (isLandscape) {
    const ActiveScene = renderScene({ route: routes[index] });

    return (
      <View style={styles.container}>
        <View style={[styles.sidebar, { backgroundColor: colors.surface }]}>
          {routes.map((route, i) => {
            const isActive = index === i;
            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => setIndex(i)}
                style={[styles.iconContainer, isActive && { backgroundColor: colors.secondaryContainer }]}
              >
                <IconButton
                  icon={isActive ? route.focusedIcon : route.unfocusedIcon}
                  iconColor={isActive ? colors.onSecondaryContainer : colors.onSurfaceVariant}
                  size={24}
                />
                <Text style={{
                  color: isActive ? colors.onSecondaryContainer : colors.onSurfaceVariant,
                  fontSize: 12,
                  textAlign: 'center'
                }}>
                  {route.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.content}>
          {ActiveScene}
        </View>
      </View>
    );
  }

  // 👇 Render bottom navigation in portrait mode
  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      shifting={false}
      activeColor={colors.onSecondaryContainer}
      inactiveColor={colors.onSurfaceVariant}
      barStyle={{ backgroundColor: colors.surface }}
    />
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 100,
    paddingVertical: 16,
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  iconContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    width: '100%',
  },
  content: {
    flex: 1,
  },
});
