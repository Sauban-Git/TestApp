
// _layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useThemeStore } from "@/stores/themeStore";

export default function Layout() {
  const theme = useThemeStore((state) => state.theme)
  const c = useColors()

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
