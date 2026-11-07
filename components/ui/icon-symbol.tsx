// Fallback partagé pour Android et web, avec noms SF Symbols équivalents sur iOS.
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  "house.fill": "home",
  "map.fill": "map",
  "flag.fill": "flag",
  "info.circle.fill": "info-outline",
  "magnifyingglass": "search",
  "line.3.horizontal.decrease.circle": "tune",
  "location.fill": "place",
  "fuelpump.fill": "local-gas-station",
  "checkmark.circle.fill": "check-circle",
  "xmark.circle.fill": "cancel",
  "questionmark.circle.fill": "help-outline",
  "arrow.clockwise": "refresh",
  "chevron.right": "chevron-right",
  "chevron.left.forwardslash.chevron.right": "code",
  "paperplane.fill": "send",
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
