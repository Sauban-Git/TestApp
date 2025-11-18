
import { MaterialIcons } from "@expo/vector-icons"
import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, BackHandler, TouchableOpacity } from "react-native";
import Conversation from "@/components/conversation";
import axios from "@/utils/axios";
import type { ConversationApi, ConversationsListApi, UserInfoApi } from "@/types/types";
import { useConversationsListStore } from "@/stores/conversationListStore";
import { useSelectConversationStore } from "@/stores/selectConversationStore";
import { colors } from "@/constants/theme";
import { useUserInfoStore } from "@/stores/userInfoStore";
import { router, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Options } from "@/components/options";
import { useSocket } from "@/hooks/useSocket";

const ConversationList = () => {
  const [users, setUsers] = useState<UserInfoApi[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const setConversationsList = useConversationsListStore((state) => state.setConversationsList);
  const conversationList = useConversationsListStore((state) => state.conversationsList);
  const setSelectConversation = useSelectConversationStore((state) => state.setConversationStore);
  const userInfo = useUserInfoStore((state) => state.user);


  const searchRef = useRef<TextInput>(null);

  const filteredConversations = conversationList?.filter(
    (conv) =>
      conv.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.messages[0]?.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchConversationList = async () => {
    const token = await AsyncStorage.getItem("token")
    if (!token) return router.replace("/(auth)/login")
    try {

      const response = await axios.get<{ conversation: ConversationsListApi }>("/conversation/", {
        headers: {
          Authorization: token
        }
      });
      const updatedConversations = response.data.conversation.map((conv) => {
        if (!conv.name) {
          conv.name = conv.participants?.find(p => p.id !== userInfo?.id)?.name ?? "Unknown";
        }
        return conv;
      });

      setConversationsList(updatedConversations);

      const res = await axios.get<{ users: UserInfoApi[] }>("/user/");
      setUsers(res.data.users);
    }
    catch {
      Alert.alert("Network Error!")
      return
    }
  };

  const openMessage = (conversation: ConversationApi) => {
    setSelectConversation(conversation);
    router.replace('/(tabs)/messageList')
  };

  const newConversation = async (id: string, name: string) => {
    console.log("Creating new Conv:  ")
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
        console.log("New conversation with id: ", res.data.conversation.id)
        setSelectConversation(res.data.conversation)
        router.replace('/(tabs)/messageList')
      }
    } catch (error) {
      console.log("Error while creating conversation:", error);
    }
  };

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const toggleOptions = () => setIsOptionsOpen(prev => !prev);
  const closeOptions = () => setIsOptionsOpen(false);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {

      if (router.canGoBack()) {
        router.back();
        return true; // prevent default
      }

      BackHandler.exitApp();
      return true;
    });

    return () => sub.remove();
  }, []);

  useEffect(() => {
    fetchConversationList();
  }, []);

  return (<>

    <Stack.Screen options={{
      title: userInfo?.name, headerRight: () => (
        <TouchableOpacity onPress={toggleOptions} style={{ marginRight: 16 }}>
          <MaterialIcons name="more-vert" size={28} color="#000" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: colors.neutral900, // same as StatusBar
      },
      headerTintColor: '#fff', // color of title & icons
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }} />

    <Options isOpen={isOptionsOpen} onClose={closeOptions} />

    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}> */}
      {/*   <Text style={styles.username}>{userInfo?.name}</Text> */}
      {/*   <TouchableOpacity onPress={togglePopup}> */}
      {/* <Image source={require("@/assets/images/options.png")} style={styles.optionsIcon} /> */}
      {/*     <MyButton title="Signout" onPress={logOut} /> */}
      {/*   </TouchableOpacity> */}
      {/*   <Options isOpen={isPopupOpen} onClose={closePopup} /> */}
      {/* </View> */}

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
              filteredConversations.map((conv, index) => {
                const otherParticipant = conv.participants.find(p => p.id !== userInfo?.id);

                return <Conversation
                  participantId={otherParticipant?.id}
                  onPress={() => {
                    openMessage(conv)
                  }}
                  key={index}
                  title={conv.name || ""}
                  lastMessage={conv.messages[0]?.content ?? "Click to start conversation"}
                />
              })}
          </View>
        )}

        {users && (
          <View>
            <Text style={styles.sectionHeader}>Contacts</Text>
            {users.length > 0 ? (
              users.map((user, index) => (
                <Conversation key={index} title={user.name || ""} lastMessage="Click to start conversation" onPress={() => newConversation(user.id, user.name)} />
              ))
            ) : (
              <Text style={styles.noResults}>No results found</Text>
            )}
          </View>
        )}
      </ScrollView>
    </View></>
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
    color: "white",
  },
  searchInput: {
    backgroundColor: colors.neutral400,
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

