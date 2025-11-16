import { useMessageListStore } from "@/stores/messageListStore"
import { useOnlineUserList } from "@/stores/onlineUsersStore"
import { useRouter } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import io, { Socket } from "socket.io-client"

interface UseSocketOptions {
  token: string
}

export const useSocket = ({ token }: UseSocketOptions) => {

  const router = useRouter()
  const socketRef = useRef<Socket | null>(null)
  const [connected, setConnected] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const setOnlineUserList = useOnlineUserList((state) => state.setOnlineUserList)
  const addMessage = useMessageListStore((state) => state.addMessage)

  useEffect(() => {
    const socket = io('http://192.168.31.54:3000', {
      transports: ["websocket"],
      extraHeaders: {
        authorization: token
      }
    })

    socketRef.current = socket

    socket.on("connect", () => {
      setConnected(true)
    })

    socket.on("disconnect", () => {
      setConnected(false)
    })

    socket.on("online", (data) => {
      setOnlineUserList(data.onlineUser || [])
    })

    socket.on("message:new", (data) => {
      addMessage(data.message)
    })

    socket.on("typing:status", (data) => {
      setTypingUser(data.typing === "start" ? data.userId : null)
    })

    return () => {
      socket.disconnect()
    }

  }, [token])
  // Join conversation
  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit("conversation:join", { conversationId });
  }, []);

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
    joinConversation,
    sendMessage,
    setTyping,
  };
}
