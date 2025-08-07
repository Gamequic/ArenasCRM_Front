import * as React from 'react';
import { useWindowDimensions, View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { BottomNavigation, useTheme, IconButton } from 'react-native-paper';

import AddPiece from '../addPiece';
import FindPiece from '../findPieces';

const MainScreen = () => {
  const { width, height } = useWindowDimensions();
  const { colors } = useTheme();
  const isLandscape = width > height;

  const [index, setIndex] = React.useState(0);
  const [hoveredTooltip, setHoveredTooltip] = React.useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const [routes] = React.useState([
    { key: 'addPiece', title: 'Agregar pieza', focusedIcon: 'plus-box-multiple', unfocusedIcon: 'plus-box-multiple-outline' },
    { key: 'findPiece', title: 'Buscar piezas', focusedIcon: 'view-list', unfocusedIcon: 'view-list-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    addPiece: AddPiece,
    findPiece: FindPiece,
  });

  if (isLandscape) {
    const ActiveScene = renderScene({ route: routes[index] });

    return (
      <View style={styles.landscapeContainer}>
        <View style={[styles.topbar, { backgroundColor: colors.surface }]}>
          {routes.map((route, i) => {
            const isActive = index === i;
            const iconColor = isActive ? colors.onSecondaryContainer : colors.onSurfaceVariant;
            const isHovered = hoveredIndex === i;

            return (
              <Pressable
                key={route.key}
                onPress={() => setIndex(i)}
                onHoverIn={() => {
                  setHoveredTooltip(route.key);
                  setHoveredIndex(i);
                }}
                onHoverOut={() => {
                  setHoveredTooltip(null);
                  setHoveredIndex(null);
                }}
                style={styles.tooltipWrapper}
              >
                <View
                  style={[
                    styles.iconContainer,
                    isActive && { backgroundColor: colors.secondaryContainer },
                    !isActive && isHovered && { backgroundColor: colors.surfaceVariant },
                  ]}
                >
                  <IconButton
                    icon={isActive ? route.focusedIcon : route.unfocusedIcon}
                    iconColor={iconColor}
                    size={24}
                  />
                </View>
                {hoveredTooltip === route.key && Platform.OS === 'web' && (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>{route.title}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
        <View style={styles.content}>{ActiveScene}</View>
      </View>
    );
  }

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
  landscapeContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  topbar: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  iconContainer: {
    padding: 4,
    borderRadius: 12,
  },
  tooltip: {
    position: 'absolute',
    top: 36,
    backgroundColor: 'rgba(60, 60, 60, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 999,
    maxWidth: 140,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
});
