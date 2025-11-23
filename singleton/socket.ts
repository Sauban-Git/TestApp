
import { io, type Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMessageListStore } from "@/stores/messageListStore";
import { useConversationsListStore } from "@/stores/conversationListStore";
import { useOnlineUserList } from "@/stores/onlineUsersStore";
import { useTypingStore } from "@/stores/typingStore";

let socket: Socket | null = null;

export const getSocket = async () => {
  if (socket) return socket;

  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No token found");

  socket = io("http://192.168.31.54:3000", {
    auth: { token },
  });

  // Set up listeners only once
  const addMessage = useMessageListStore.getState().addMessage;
  const markMessagesAsRead = useMessageListStore.getState().markMessagesAsRead;
  const markMessagesAsDelivered = useMessageListStore.getState().markMessagesAsDelivered;
  const updateLastMessage = useConversationsListStore.getState().updateLastMessage;
  const setOnlineUserList = useOnlineUserList.getState().setOnlineUserList;

  socket.on("online", (data) => {
    setOnlineUserList(data.onlineUser || []);
  });

  socket.on("message:new", (data) => {
    addMessage(data.message);
    updateLastMessage(data.message, data.conversationId);
  });

  socket.on("message:read", () => {
    markMessagesAsRead(new Date());
  });

  socket.on("message:deliver", () => {
    markMessagesAsDelivered(new Date());
  });

  socket.on("typing:status", (data) => {
    if (data.typing === "start") {
      useTypingStore.getState().addTypingUser(data.userId);
    } else {
      useTypingStore.getState().removeTypingUser(data.userId);
    }
  });

  return socket;
};
;
