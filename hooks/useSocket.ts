import { getSocket } from "@/singleton/socket"
import { useConversationsListStore } from "@/stores/conversationListStore"
import { useMessageListStore } from "@/stores/messageListStore"
import { useOnlineUserList } from "@/stores/onlineUsersStore"
import { useSelectConversationStore } from "@/stores/selectConversationStore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useCallback, useEffect, useRef, useState } from "react"
import { type Socket } from "socket.io-client"


export const useSocket = () => {
  const conversation = useSelectConversationStore((state) => state.conversation)
  const socketRef = useRef<Socket | null>(null)
  const [connected, setConnected] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const setOnlineUserList = useOnlineUserList((state) => state.setOnlineUserList)
  const addMessage = useMessageListStore((state) => state.addMessage)
  const updateLastMessage = useConversationsListStore((state) => state.updateLastMessage)
  useEffect(() => {

    const initSocket = async () => {
      const token = await AsyncStorage.getItem("token")
      if (!token) return console.log("wrong token")
      console.log("Socket connecting.....")
      const socket = getSocket(token)

      socketRef.current = socket

      socket.on("connect", () => {
        setConnected(true)
        console.log("Socket connected")
      })

      socket.on("disconnect", () => {
        setConnected(false)
        console.log("Socket disconnected")
      })

      socket.on("connect_error", (err) => {
        console.log("Socket connect error:", err.message);
      });

      socket.on("online", (data) => {
        setOnlineUserList(data.onlineUser || [])
        console.log("set online true..")
      })

      socket.on("message:new", (data) => {
        addMessage(data.message)
        updateLastMessage(data.message, data.conversationId)
        console.log("new message goingg...")
      })

      socket.on("typing:status", (data) => {
        setTypingUser(data.typing === "start" ? data.userId : null)
      })

    }

    initSocket()

    return () => {
      const socket = socketRef.current
      if (socket) {

        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("online");
        socket.off("message:new");
        socket.off("typing:status");
      }
    };

  }, [])

  const sendMessage = useCallback(
    (conversationId: string, message: string) => {
      socketRef.current?.emit("message:new", { conversationId, message });
    },
    []
  );

  const setTyping = useCallback(
    (conversationId: string, status: "start" | "stop") => {
      socketRef.current?.emit("typing:status", { conversationId, typing: status });
    },
    []
  );

  return {
    connected,
    typingUser,
    sendMessage,
    setTyping,
  };
}
