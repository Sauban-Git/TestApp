import { colors } from "@/constants/theme"
import { useRouter } from "expo-router"
import React, { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import Animated, { FadeInDown } from 'react-native-reanimated'

const SplashScreen = () => {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.replace('/(auth)/welcome')
    }, 1500)
  })
  return (
    <View style={styles.container}>
      <Animated.Text entering={FadeInDown.duration(700).springify()} style={styles.text}>Talkyy</Animated.Text>
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
    backgroundColor: colors.neutral900
  },
  text: {
    color: colors.primary,
    fontSize: 30
  }
})
