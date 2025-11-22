
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

type TypingIndicatorProps = {
  isSomeoneTyping: boolean;
  usersTyping?: string[]; // array of user names or ids
};

export default function TypingIndicator({ isSomeoneTyping, usersTyping = [] }: TypingIndicatorProps) {
  const dots = [0, 1, 2];

  if (!isSomeoneTyping) return null;

  // Generate the text to display based on how many users are typing
  let typingText = '';
  if (usersTyping.length === 1) typingText = `${usersTyping[0]} is typing...`;
  else if (usersTyping.length === 2) typingText = `${usersTyping[0]} & ${usersTyping[1]} are typing...`;
  else if (usersTyping.length > 2) typingText = `${usersTyping[0]}, ${usersTyping[1]} & others are typing...`;

  return (
    <View style={styles.container}>
      {typingText.length > 0 && <Text style={styles.text}>{typingText}</Text>}
      <View style={styles.bubble}>
        <View style={styles.row}>
          {dots.map((i) => (
            <BouncingDot key={i} delay={i * 200} />
          ))}
        </View>
      </View>
    </View>
  );
}

function BouncingDot({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withDelay(delay, withTiming(-4, { duration: 300 })),
        withTiming(0, { duration: 300 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  text: {
    marginBottom: 4,
    fontStyle: 'italic',
    color: '#333',
  },
  bubble: {
    backgroundColor: '#e5e5e5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#000',
    borderRadius: 50,
  },
});

