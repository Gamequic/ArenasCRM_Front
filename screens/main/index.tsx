import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';

// Proyect import
import AddPiece from '../addPiece';
import FindPiece from '../findPieces';

const RecentsRoute = () => <Text>Recents</Text>;

const NotificationsRoute = () => <Text>Notifications</Text>;

const MainScreen = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'addPiece', title: 'Agregar pieza', focusedIcon: 'heart', unfocusedIcon: 'heart-outline'},
    { key: 'findPiece', title: 'Buscar piezas', focusedIcon: 'album' }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    addPiece: AddPiece,
    findPiece: FindPiece,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default MainScreen;