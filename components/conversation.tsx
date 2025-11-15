
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "@/constants/theme"; // optional, for color consistency
import { useRouter } from "expo-router";

type ConversationProps = {
  title: string;
  lastMessage: string;
  time?: string;
  imageUrl?: string;
};

const Conversation = ({
  title,
  lastMessage,
  time,
  imageUrl = "https://via.placeholder.com/50", // default image URL
}: ConversationProps) => {
  const router = useRouter()

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.replace('/(tabs)/messageList')}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />

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
    backgroundColor: colors.neutral800, // similar to hover:bg-gray-800
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
