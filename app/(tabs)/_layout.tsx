import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks/use-auth";
import { StationsProvider } from "@/lib/stations-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const canSeeAdminEntry = !user || user.role === "admin";
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);

  return (
    <StationsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#0B6B5A",
          tabBarInactiveTintColor: "#81908A",
          tabBarButton: HapticTab,
          tabBarStyle: {
            height: 64 + bottomPadding,
            paddingTop: 8,
            paddingBottom: bottomPadding,
            backgroundColor: "#FFFFFF",
            borderTopColor: "#DCE6E0",
            borderTopWidth: 0.5,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Explorer",
            tabBarIcon: ({ color }) => <IconSymbol name="map.fill" size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="report"
          options={{
            title: "Signaler",
            tabBarIcon: ({ color }) => <IconSymbol name="flag.fill" size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="info"
          options={{
            title: "Guide",
            tabBarIcon: ({ color }) => <IconSymbol name="info.circle.fill" size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="admin"
          options={{
            title: "Admin",
            href: canSeeAdminEntry ? undefined : null,
            tabBarIcon: ({ color }) => <IconSymbol name="info.circle.fill" size={22} color={color} />,
          }}
        />
      </Tabs>
    </StationsProvider>
  );
}
