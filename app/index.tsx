import { useColors } from "@/hooks/useColors"
import { useRouter } from "expo-router"
import React, { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import CatLogo from "@/assets/logo/cat.png"
import Animated, { FadeInDown } from 'react-native-reanimated'

const SplashScreen = () => {
  const router = useRouter()
  const c = useColors()
  useEffect(() => {
    setTimeout(() => {
      router.replace('/(auth)/welcome')
    }, 3000)
  })
  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Animated.Image entering={FadeInDown.duration(700).springify()} resizeMode="contain" style={{ width: 200, height: 200 }} source={CatLogo} />
      <Animated.Text entering={FadeInDown.duration(700).springify()} style={[styles.text, { color: c.text }]}> Katty </Animated.Text>

    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontStyle: "italic",
    padding: 20,
  },
  text: {
    fontSize: 30
  }
})
