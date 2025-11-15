
import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import Conversation from "@/components/conversation";
import axios from "@/utils/axios";
import type { ConversationApi, ConversationsListApi, UserInfoApi } from "@/types/types";
import { useConversationsListStore } from "@/stores/conversationListStore";
import { useSelectConversationStore } from "@/stores/selectConversationStore";
import { colors } from "@/constants/theme";
import { useUserInfoStore } from "@/stores/userInfoStore";
import { Options } from "@/components/options";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ConversationList = () => {
  const [users, setUsers] = useState<UserInfoApi[] | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const setConversationsList = useConversationsListStore((state) => state.setConversationsList);
  const conversationList = useConversationsListStore((state) => state.conversationsList);
  const setSelectConversation = useSelectConversationStore((state) => state.setConversationStore);
  const userInfo = useUserInfoStore((state) => state.user);

  const togglePopup = () => setIsPopupOpen((prev) => !prev);
  const closePopup = () => setIsPopupOpen(false);

  const searchRef = useRef<TextInput>(null);

  const filteredConversations = conversationList?.filter(
    (conv) =>
      conv.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.messages[0]?.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchConversationList = async () => {
    const token = await AsyncStorage.getItem("token")
    if (!token) return router.replace("/(auth)/login")
    const response = await axios.get<{ conversationList: ConversationsListApi }>("/conversation/", {
      headers: {
        Authorization: token
      }
    });
    setConversationsList(response.data.conversationList);

    const res = await axios.get<{ users: UserInfoApi[] }>("/user/");
    setUsers(res.data.users);
  };

  const openMessage = (id: string, name: string | undefined) => {
    setSelectConversation({
      id,
      name: name ?? null,
    });
    router.replace('/(tabs)/messageList')
  };

  const newConversation = async (id: string) => {
    const token = await AsyncStorage.getItem("token")
    if (!token) return router.replace('/(auth)/login')
    try {
      const res = await axios.post<{ conversation: ConversationApi }>("/conversation", {
        userId: userInfo?.id,
        participantId: id,
        isGroup: false,
      }, {
        headers: {
          Authorization: token
        }
      });

      if (res.data.conversation) {
        setSelectConversation({
          name: res.data.conversation.name ?? null,
          id: res.data.conversation.id,
        });
        router.replace('/(tabs)/messageList')
      }
    } catch (error) {
      console.log("Error while creating conversation:", error);
    }
  };

  useEffect(() => {
    fetchConversationList();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.username}>{userInfo?.name}</Text>
        <TouchableOpacity onPress={togglePopup}>
          {/* <Image source={require("@/assets/images/options.png")} style={styles.optionsIcon} /> */}
        </TouchableOpacity>
        <Options isOpen={isPopupOpen} onClose={closePopup} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          ref={searchRef}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search"
          style={styles.searchInput}
        />
      </View>

      {/* Conversation List */}
      <ScrollView style={styles.listContainer}>
        {filteredConversations && (
          <View>
            <Text style={styles.sectionHeader}>Chats</Text>
            {filteredConversations.length > 0 &&
              filteredConversations.map((conv, index) => (
                <TouchableOpacity key={index} onPress={() => openMessage(conv.id, conv.name)}>
                  <Conversation
                    title={conv.name || ""}
                    lastMessage={conv.messages[0]?.content ?? "Click to start conversation"}
                  />
                </TouchableOpacity>
              ))}
          </View>
        )}

        {users && (
          <View>
            <Text style={styles.sectionHeader}>Contacts</Text>
            {users.length > 0 ? (
              users.map((user, index) => (
                <TouchableOpacity key={index} onPress={() => newConversation(user.id)}>
                  <Conversation title={user.name || ""} lastMessage="Click to start conversation" />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noResults}>No results found</Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ConversationList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral600,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  optionsIcon: {
    width: 30,
    height: 30,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    backgroundColor: colors.neutral800,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.primary,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sectionHeader: {
    textAlign: "center",
    color: colors.neutral400,
    marginVertical: 8,
    fontSize: 14,
  },
  noResults: {
    textAlign: "center",
    color: colors.neutral400,
    marginVertical: 8,
    fontSize: 14,
  },
});

