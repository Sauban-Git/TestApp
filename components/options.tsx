
import { colors } from "@/constants/theme";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface OptionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Options: React.FC<OptionsProps> = ({ isOpen, onClose }) => {


  const logOut = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.popup}>
        <TouchableOpacity style={styles.option} onPress={() => { }}>
          <Text style={styles.optionText}>New Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => { }}>
          <Text style={styles.optionText}>Archived</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => { }}>
          <Text style={styles.optionText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={logOut}>
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: colors.neutral100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral400,
    shadowColor: "#000",
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
    color: colors.neutral700,
    fontSize: 16,
  },
});
