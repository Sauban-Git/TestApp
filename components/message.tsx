import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/theme"; // optional
import { useColors } from "@/hooks/useColors";

export type Status = "read" | "delivered" | "sent";

type MessageProps = {
  sender: boolean;
  status?: Status;
  time: string;
  content: string;
};

const Message = ({ sender, status, time, content }: MessageProps) => {
  const c = useColors()
  const containerStyle = sender ? styles.senderContainer : styles.receiverContainer;
  const messageStyle = sender ? [styles.senderMessage, { backgroundColor: c.senderMessage }] : [styles.receiverMessage, { backgroundColor: c.recieverMessage }];

  return (
    <View style={containerStyle}>
      <View style={messageStyle}>
        <Text style={[styles.content, { color: c.text }]}>{content}</Text>
        <View style={styles.meta}>
          <Text style={[styles.time, { color: c.timeText }]}>{time}</Text>
          {sender && status && <Text style={[styles.status, { color: c.statusText }]}> {status}</Text>}
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
    borderRadius: 20,
    padding: 10,
    maxWidth: "75%",
  },
  receiverMessage: {
    borderRadius: 20,
    padding: 10,
    maxWidth: "75%",
  },
  content: {
    fontSize: 16,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  time: {
    fontSize: 12,
  },
  status: {
    fontSize: 12,
    marginLeft: 4,
  },
});
