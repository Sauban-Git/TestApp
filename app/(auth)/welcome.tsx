import MyButton from "@/components/button"
import { colors } from "@/constants/theme"
import { useRouter } from "expo-router"
import { View, Text, StyleSheet } from "react-native"

const Welcome = () => {
  const router = useRouter()
  return (
    <View style={styles.container} >
      <Text style={styles.text}>
        Welcome to Chatty..
      </Text>
      <MyButton title="Login" onPress={() => router.replace('/(auth)/login')} />
      <MyButton title="Signup" onPress={() => router.replace('/(auth)/signup')} />
    </View>
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
