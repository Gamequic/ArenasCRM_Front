// utils/theme.ts
import {
  themeFromSourceColor,
  argbFromHex,
  hexFromArgb,
} from '@material/material-color-utilities';

export function generateMaterialTheme(sourceColor: string) {
  const theme = themeFromSourceColor(argbFromHex(sourceColor));

  // Convierte todos los valores de ARGB a HEX string
  const light = Object.fromEntries(
    Object.entries(theme.schemes.light.toJSON()).map(([key, value]) => [key, hexFromArgb(value)])
  );

  const dark = Object.fromEntries(
    Object.entries(theme.schemes.dark.toJSON()).map(([key, value]) => [key, hexFromArgb(value)])
  );

  return {
    light,
    dark,
  };
}
