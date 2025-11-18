
import React, { useEffect, useRef, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  BackHandler,
  KeyboardAvoidingView,
  Platform
} from "react-native"


import axios from "@/utils/axios"
import { useMessageListStore } from "@/stores/messageListStore"
import { useUserInfoStore } from "@/stores/userInfoStore"
import { useSelectConversationStore } from "@/stores/selectConversationStore"
import { Stack, useRouter } from "expo-router"
import Message from "@/components/message"
import { formatToLocalTime } from "@/utils/formatToLocalTime"
import { MessageListApi, type MessageApi } from "@/types/types"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { colors } from "@/constants/theme"
import { useOnlineUserList } from "@/stores/onlineUsersStore"
import { useSocket } from "@/hooks/useSocket"

const MessagesList = () => {

  const router = useRouter()

  const [content, setContent] = useState("")
  const scrollRef = useRef<ScrollView>(null)

  const messageList = useMessageListStore((state) => state.messagesList)
  const setMessageList = useMessageListStore((state) => state.setMessagesList)
  const addMessage = useMessageListStore((state) => state.addMessage)
  const userInfo = useUserInfoStore((state) => state.user)
  const conversation = useSelectConversationStore((state) => state.conversation)

  const participant = conversation?.participants.find(p => p.id !== userInfo?.id);
  const onlineUserList = useOnlineUserList((state) => state.onlineUserList)
  const [isOnline, setIsOnline] = useState(false)

  const fetchMessages = async () => {
    const token = await AsyncStorage.getItem("token")
    if (!token) return router.replace('/(auth)/login')
    if (!conversation?.id) return router.replace('/(tabs)/conversationList')
    try {
      const res = await axios.get<{ messages: MessageListApi }>(`/message/${conversation?.id}`, {
        headers: {
          Authorization: token
        }
      })
      if (res.data.messages) setMessageList(res.data.messages)
    } catch (error) {
      console.log("Error fetching messages:", error)
    }
  }

  const { sendMessage } = useSocket()

  const newMessage = () => {
    if (!content) return
    sendMessage(conversation!.id, content)
    scrollRef.current?.scrollToEnd({ animated: true })
    setContent("")
  }

  useEffect(() => {
    if (participant?.id && onlineUserList) {
      setIsOnline(onlineUserList.includes(participant.id));
    }
  }, [participant?.id, onlineUserList]);


  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      // If we can navigate back, do it
      if (router.canGoBack()) {
        router.replace('/(tabs)/conversationList');
        return true; // prevent default
      }

      // Otherwise exit the app
      router.replace('/(tabs)/conversationList');
      return true;
    });

    return () => sub.remove();
  }, []);



  useEffect(() => {
    fetchMessages()
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200)
  }, [])

  const isSender = (id: string | undefined) => userInfo?.id === id

  return (<KeyboardAvoidingView style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
    <Stack.Screen options={{
      title: conversation?.name || "Unknown", headerStyle: {
        backgroundColor: colors.neutral900,
      },
      headerTintColor: '#fff',
      headerTitle: () => (
        <View>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
            {conversation?.name || "Unknown"}
          </Text>
          {typeof isOnline !== "undefined" && (
            <Text style={{ color: isOnline ? "#22c55e" : "#aaa", fontSize: 12 }}>
              {isOnline ? "Online" : "Offline"}
            </Text>
          )}
        </View>
      ),
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }} />
    <View style={styles.container}>

      {/* Header */}
      {/* <View style={styles.header}> */}
      {/*   <TouchableOpacity */}
      {/*     style={styles.headerLeft} */}
      {/*     onPress={() => router.replace('/(tabs)/conversationList')} */}
      {/*   > */}
      {/* <Image source={require("../../assets/back.png")} style={styles.icon} /> */}
      {/* <Image source={require("@/assets/images/back.png")} style={styles.profileIcon} /> */}
      {/*   </TouchableOpacity> */}
      {/**/}
      {/*   <View style={styles.headerCenter}> */}
      {/*     <Text style={styles.headerTitle}>{conversationId}</Text> */}
      {/*   </View> */}
      {/**/}
      {/* <Image source={require("../../assets/options.png")} style={styles.icon} /> */}
      {/* </View> */}

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messageList && messageList.map((msg, index) => (
          <Message
            key={index}
            sender={isSender(msg.senderId)}
            status="sent"
            time={formatToLocalTime(msg.createdAt)}
            content={msg.content}
          />
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Type here..."
          style={styles.textInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={newMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

    </View></KeyboardAvoidingView>
  )
}

export default MessagesList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 5
  },
  profileIcon: {
    width: 35,
    height: 35,
    borderRadius: 20
  },
  headerCenter: {
    justifyContent: "center",
    alignItems: "center"
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold"
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#ccc",
    padding: 10,
    marginBottom: 20
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 18
  },
  sendButton: {
    padding: 12,
    marginLeft: 10,
    backgroundColor: "#3399ff",
    borderRadius: 12,
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold"
  }
})

