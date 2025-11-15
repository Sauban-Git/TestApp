import { colors } from "@/constants/theme"
import { View, Text, StyleSheet } from "react-native"

const Welcome = () => {
  return (
    <View style={styles.container} >
      <Text style={styles.text}>Helllllooooooooo</Text> </View>
  )
}

export default Welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.neutral900
  },
  text: {
    color: colors.primary,
    fontSize: 40
  }
})
