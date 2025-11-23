import { View } from "react-native"
import { useSocket } from "@/hooks/useSocket"
import { useRouter } from "expo-router"
const Loader = () => {
  const { connected } = useSocket()
  const router = useRouter()

  router.replace("/(tabs)/conversationList")

  return (
    <View></View>
  )
}

export default Loader

