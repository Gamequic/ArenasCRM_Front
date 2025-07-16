import { TouchableOpacity, View } from "react-native";
import { useTheme, Text } from "react-native-paper";
import Icon from "react-native-paper/src/components/Icon";

type QuickToggleProps = {
  label: string;
  iconOn: string;
  iconOff: string;
  value: boolean;
  onToggle: () => void;
};

export default function TogglePill({
  label,
  iconOn,
  iconOff,
  value,
  onToggle,
}: QuickToggleProps) {
  const { colors } = useTheme();

  // Background and text colors according to the toggle state
  const containerColor = value ? colors.primaryContainer : colors.surfaceVariant;
  const contentColor = value ? colors.onPrimaryContainer : colors.onSurfaceVariant;

  // Slightly lighter color for the ON/OFF indicator text for subtlety
  const onOffColor = colors.onSurfaceVariant;

  return (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        width: "45%",
        height: 64,
        borderRadius: 20,
        backgroundColor: containerColor,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        elevation: 2,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      }}
    >
      {/* Icon container with fixed width to align all icons uniformly */}
      <View style={{ width: 28, alignItems: "center" }}>
        <Icon source={value ? iconOn : iconOff} size={24} color={contentColor} />
      </View>

      <View style={{ marginLeft: 12 }}>
        {/* Label with main content color */}
        <Text style={{ color: contentColor, fontSize: 14 }}>{label}</Text>

        {/* ON/OFF indicator with lighter color */}
        <Text
          style={{
            color: onOffColor,
            fontWeight: "bold",
            fontSize: 12,
            marginTop: 2,
          }}
        >
          {value ? "ON" : "OFF"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
