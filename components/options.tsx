
import { colors } from "@/constants/theme";
import { useColors } from "@/hooks/useColors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface OptionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Options: React.FC<OptionsProps> = ({ isOpen, onClose }) => {
  const c = useColors()
  const router = useRouter()
  const logOut = async () => {
    await AsyncStorage.removeItem("token")
    await AsyncStorage.removeItem("userInfo")
    router.replace('/(auth)/login')
  };

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={[styles.popup, { backgroundColor: c.background }]}>
        <TouchableOpacity style={styles.option} onPress={() => { }}>
          <Text style={[styles.optionText, { color: c.text }]}>New Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => { }}>
          <Text style={[styles.optionText, { color: c.text }]}>Archived</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => { }}>
          <Text style={[styles.optionText, { color: c.text }]}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={logOut}>
          <Text style={[styles.optionText, { color: c.text }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "transparent",
  },
  popup: {
    position: "absolute",
    top: 60, // adjust as needed
    right: 16,
    width: 180,
    borderRadius: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
  },
});
