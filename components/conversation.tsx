
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "@/constants/theme"; // optional, for color consistency
import { useOnlineUserList } from "@/stores/onlineUsersStore";
import { useEffect, useState } from "react";

type ConversationProps = {
  title: string;
  lastMessage: string;
  time?: string;
  imageUrl?: string;
  onPress?: () => void
  participantId?: string
};

const Conversation = ({
  title,
  lastMessage,
  time,
  onPress,
  participantId,
  imageUrl = "https://via.placeholder.com/50",
}: ConversationProps) => {

  const onlineUserList = useOnlineUserList((state) => state.onlineUserList)
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    if (participantId && onlineUserList) {
      setIsOnline(onlineUserList.includes(participantId));
    }
  }, [participantId, onlineUserList]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
    >
      <View style={{ position: "relative" }}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        {isOnline && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.textContainer}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {time && (
            <Text style={styles.time} numberOfLines={1}>
              {time}
            </Text>
          )}
        </View>
        <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">
          {lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: colors.neutral800,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.neutral900,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
    justifyContent: "center",
    minWidth: 0,
  },
  onlineDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    backgroundColor: "#22c55e",
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.neutral800,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
    flexShrink: 1,
  },
  time: {
    fontSize: 12,
    color: "#aaa",
    marginLeft: 8,
  },
  lastMessage: {
    color: "#aaa",
    marginTop: 2,
  },
});
