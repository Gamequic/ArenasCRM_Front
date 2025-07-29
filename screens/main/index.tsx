import * as React from 'react';
import { BottomNavigation, useTheme } from 'react-native-paper';

// Proyect import
import AddPiece from '../addPiece';
import FindPiece from '../findPieces';
import ThemeColorsScreen from '../dev/colors';

const MainScreen = () => {
  const { colors } = useTheme();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'addPiece', title: 'Agregar pieza', focusedIcon: 'plus-box-multiple', unfocusedIcon: 'plus-box-multiple-outline'},
    { key: 'findPiece', title: 'Buscar piezas', focusedIcon: 'view-list', unfocusedIcon: 'view-list-outline' },
    // { key: 'colors', title: 'Colores', focusedIcon: 'album' }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    addPiece: AddPiece,
    findPiece: FindPiece,
    // colors: ThemeColorsScreen,
  });

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