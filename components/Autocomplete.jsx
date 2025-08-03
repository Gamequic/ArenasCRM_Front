import React, { useState, useEffect, useMemo } from "react";
import { View, ScrollView } from "react-native";
import {
  TextInput,
  useTheme,
  HelperText,
  Menu,
} from "react-native-paper";
import { Controller } from "react-hook-form";

export default function Autocomplete({
  error,
  control,
  value,
  icon,
  label,
  options,
  onSelect,
}) {
  const { colors } = useTheme();

  const [query, setQuery] = useState(value || "");
  const [visible, setVisible] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);

  // Prevent reopening if already visible
  const openMenu = () => {
    if (!visible) setVisible(true);
  };
  const closeMenu = () => {
    if (visible) setVisible(false);
  };

  // Filter options on text change
  const filterOptions = (text) => {
    setQuery(text);
    if (text.length === 0) {
      setFilteredOptions([]);
      closeMenu();
    } else {
      const filtered = options.filter((opt) =>
        opt.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredOptions(filtered);
      if (filtered.length > 0) openMenu();
      else closeMenu();
    }
  };

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  return (
    <View style={{ zIndex: 999 }}>
      <Controller
        control={control}
        name={label}
        defaultValue=""
        render={({ field: { onChange, onBlur, value } }) => {
          const anchor = useMemo(() => (
            <View style={{ marginBottom: 8 }}>
              <TextInput
                label={label}
                value={query}
                onChangeText={(text) => {
                  filterOptions(text);
                  onChange(text);
                  onSelect?.(text);
                }}
                onBlur={onBlur}
                error={!!error}
                mode="outlined"
                style={{ backgroundColor: colors.surface }}
                textColor={colors.onSurface}
                activeOutlineColor={colors.primary}
                left={icon ? <TextInput.Icon icon={icon} /> : undefined}
              />
            </View>
          ), [query, error, colors, icon]);

          return (
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={anchor}
              contentStyle={{ marginTop: 64 }}
            >
              <ScrollView style={{ maxHeight: 200 }}>
                {filteredOptions.map((item) => (
                  <Menu.Item
                    key={item}
                    onPress={() => {
                      setQuery(item);
                      onChange(item);
                      onSelect?.(item);
                      closeMenu();
                    }}
                    title={item}
                  />
                ))}
              </ScrollView>
            </Menu>
          );
        }}
      />
      {error && <HelperText type="error">{error.message}</HelperText>}
    </View>
  );
}
