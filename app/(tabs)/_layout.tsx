
// _layout.tsx
import { colors } from "@/constants/theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { useSocket } from "@/hooks/useSocket";

export default function Layout() {

  // Initialize socket once token is loaded
  const { connected } = useSocket(); // pass empty string if not loaded yet

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={colors.neutral900} translucent={false} />

      {/* Render nested screens */}
      <Stack />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
});
;
