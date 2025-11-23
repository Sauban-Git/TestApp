
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";

import axios from "@/utils/axios";
import { useMessageListStore } from "@/stores/messageListStore";
import { useUserInfoStore } from "@/stores/userInfoStore";
import { useSelectConversationStore } from "@/stores/selectConversationStore";
import { Stack, useRouter } from "expo-router";
import Message from "@/components/message";
import { formatToLocalTime } from "@/utils/formatToLocalTime";
import { MessageListApi } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOnlineUserList } from "@/stores/onlineUsersStore";
import { useSocket } from "@/hooks/useSocket";
import { useColors } from "@/hooks/useColors";
import MyButton from "@/components/button";
import { useTypingStore } from "@/stores/typingStore";
import TypingIndicator from "@/components/typingIndicator";

const MessagesList = () => {
  const c = useColors();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [content, setContent] = useState("");
  const [isOnline, setIsOnline] = useState(false);

  const messageList = useMessageListStore((state) => state.messagesList);
  const setMessageList = useMessageListStore((state) => state.setMessagesList);
  const userInfo = useUserInfoStore((state) => state.user);
  const conversation = useSelectConversationStore((state) => state.conversation);

  const participant = conversation?.participants.find(
    (p) => p.id !== userInfo?.id
  );
  const onlineUserList = useOnlineUserList((state) => state.onlineUserList);

  const { connected, sendMessage, setTyping, readMessage } = useSocket();
  const typingUsers = useTypingStore((state) => state.typingUsers)

  const typingUsersExceptMe = Array.from(typingUsers).filter(
    (id) => id !== userInfo?.id
  );

  const handleFocus = () => {
    if (conversation?.id) {
      setTyping(conversation.id, "start");
    }
  };

  const handleBlurOrSend = () => {
    if (conversation?.id) {
      setTyping(conversation.id, "stop");
    }
  };

  const isSomeoneTyping = typingUsersExceptMe.length > 0;

  // Fetch messages
  const fetchMessages = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return router.replace("/(auth)/login");
    if (!conversation?.id) return router.replace("/(tabs)/conversationList");

    try {
      const res = await axios.get<{ messages: MessageListApi }>(
        `/message/${conversation?.id}`,
        {
          headers: { Authorization: token },
        }
      );
      if (res.data.messages) setMessageList(res.data.messages);
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  // Send new message
  const newMessage = () => {
    if (!content) return;
    sendMessage(conversation!.id, content);
    scrollRef.current?.scrollToEnd({ animated: true });
    setContent("");
  };

  // Update online status
  useEffect(() => {
    if (participant?.id && onlineUserList) {
      setIsOnline(onlineUserList.includes(participant.id));
    }
  }, [participant?.id, onlineUserList]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });

    return () => showSub.remove();
  }, []);

  // Initial fetch and scroll
  useEffect(() => {
    fetchMessages();
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);

    return () => {
      setMessageList(null)
    }
  }, []);

  useEffect(() => {
    if (conversation?.id && connected) {
      console.log("reading message...")
      readMessage(conversation.id);
    }
  }, [conversation?.id, connected]);

  const isSender = (id: string | undefined) => userInfo?.id === id;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 150 : 80}
    >
      <Stack.Screen
        options={{
          title: conversation?.name || "Unknown",
          headerStyle: { backgroundColor: c.background },
          headerTintColor: c.primary,
          headerTitle: () => (
            <View>
              <Text
                style={{ color: c.text, fontWeight: "bold", fontSize: 18 }}
              >
                {conversation?.name || "Unknown"}
              </Text>
              {typeof isOnline !== "undefined" && (
                <Text
                  style={{
                    color: isOnline ? "#22c55e" : c.textSecondary,
                    fontSize: 12,
                  }}
                >
                  {isOnline ? "Online" : "Offline"}
                </Text>
              )}
            </View>
          ),
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <View style={[styles.container, { backgroundColor: c.background }]}>
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messagesContainer}
          contentContainerStyle={{ paddingBottom: 10 }}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messageList?.map((msg, index) => (
            <Message
              key={index}
              sender={isSender(msg.senderId)}
              status="sent"
              time={formatToLocalTime(msg.createdAt)}
              content={msg.content}
            />
          ))}

          <TypingIndicator
            isSomeoneTyping={isSomeoneTyping}
            usersTyping={typingUsersExceptMe}
          />

        </ScrollView>

        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: c.background }]}>
          <TextInput
            onFocus={handleFocus}
            onBlur={handleBlurOrSend}
            value={content}
            onChangeText={setContent}
            placeholder="Type here..."
            style={[styles.textInput, { backgroundColor: c.background }]}
          />
          <MyButton onPress={newMessage} title="Send" />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessagesList;

const styles = StyleSheet.create({
  container: { flex: 1 },
  messagesContainer: { flex: 1, padding: 15 },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 0.5,
    borderColor: "#ccc",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 18,
  },
});

