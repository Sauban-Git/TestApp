
// _layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { useSocket } from "@/hooks/useSocket";
import { useColors } from "@/hooks/useColors";
import { useThemeStore } from "@/stores/themeStore";

export default function Layout() {
  const theme = useThemeStore((state) => state.theme)
  const c = useColors()
  // Initialize socket once token is loaded
  const { connected } = useSocket(); // pass empty string if not loaded yet

  return (
    <View style={styles.container}>
      <StatusBar style={theme === "light" ? "dark" : "light"} backgroundColor={c.background} translucent={false} />

      {/* Render nested screens */}
      <Stack />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
;
