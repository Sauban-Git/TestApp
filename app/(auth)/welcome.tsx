import MyButton from "@/components/button"
import { useColors } from "@/hooks/useColors"
import { useUserInfoStore } from "@/stores/userInfoStore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import { useEffect } from "react"
import { View, Text, StyleSheet, Image } from "react-native"
import CatLogo from "@/assets/logo/cat.png"
import Animated, { FadeInDown } from "react-native-reanimated"
import { useSocket } from "@/hooks/useSocket"

const Welcome = () => {
  const c = useColors()
  const router = useRouter()
  const loadUserInfo = useUserInfoStore((state) => state.loadUserInfo)
  const checkUser = async () => {
    const token = await AsyncStorage.getItem("token")
    if (token) {
      loadUserInfo()
      return router.replace('/(tabs)/conversationList')
    }

  }
  const { connected } = useSocket() // pass empty string if not loaded yet

  useEffect(() => {
    checkUser()
  }, [])

  return (
    <View style={[styles.container, { backgroundColor: c.card }]}>
      <Text style={[styles.text, { color: c.text }]}>
        Chat with
      </Text>

      <Animated.Text entering={FadeInDown.duration(700).springify()} style={[styles.text, { color: c.text }]}> purr-fection. </Animated.Text>
      <View style={{ alignItems: "center" }}>

        <Image resizeMode="contain" style={{ width: 200, height: 200 }} source={CatLogo} />
      </View>
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
    padding: 20,
  },
  text: {
    fontSize: 40,
    textAlign: "center"
  }
})
