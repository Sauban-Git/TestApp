
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/theme"; // optional

export type Status = "read" | "delivered" | "sent";

type MessageProps = {
  sender: boolean;
  status?: Status;
  time: string;
  content: string;
};

const Message = ({ sender, status, time, content }: MessageProps) => {
  const containerStyle = sender ? styles.senderContainer : styles.receiverContainer;
  const messageStyle = sender ? styles.senderMessage : styles.receiverMessage;

  return (
    <View style={containerStyle}>
      <View style={messageStyle}>
        <Text style={styles.content}>{content}</Text>
        <View style={styles.meta}>
          <Text style={styles.time}>{time}</Text>
          {sender && status && <Text style={styles.status}> {status}</Text>}
        </View>
      </View>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  senderContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 8,
  },
  receiverContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 8,
  },
  senderMessage: {
    backgroundColor: colors.neutral900 || "#ccc",
    borderRadius: 20,
    padding: 10,
    maxWidth: "75%",
  },
  receiverMessage: {
    backgroundColor: colors.primary || "#90caf9",
    borderRadius: 20,
    padding: 10,
    maxWidth: "75%",
  },
  content: {
    fontSize: 16,
    color: "#000",
  },
  meta: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: "#555",
  },
  status: {
    fontSize: 12,
    color: "#555",
    marginLeft: 4,
  },
});
