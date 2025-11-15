
import MyButton from "@/components/button";
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import axios from "@/utils/axios"; // ensure axios works with React Native
import { type UserInfoApi } from "@/types/types";
import AsyncStorage from '@react-native-async-storage/async-storage'; // optional for token storage
import { useUserInfoStore } from "@/stores/userInfoStore";

const Login = () => {
  const router = useRouter();
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo)

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post<{ user: UserInfoApi, token: string }>("/user/signin", {
        phone: formData.phone,
        password: formData.password,
      });

      setUserInfo({
        name: response.data.user.name,
        id: response.data.user.id,
        phone: response.data.user.phone
      })


      // Store token or user info
      await AsyncStorage.setItem("token", response.data.token);

      Alert.alert("Success", "Logged in successfully!");
      router.replace("/(tabs)/conversationList"); // Navigate to main app screen

    } catch (error: any) {
      Alert.alert("Login Failed", error.response?.data?.message || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Phone"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(text) => handleChange("phone", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
      />

      <MyButton title="Sign In" onPress={handleSubmit} />

      <View style={styles.signupTextContainer}>
        <Text style={styles.signupText}>New here?</Text>
        <Text
          style={styles.signupLink}
          onPress={() => router.replace("/(auth)/signup")}
        >
          {" "}Signup
        </Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.neutral900,
  },
  title: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    marginTop: 10,
  },
  signupTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#fff",
  },
  signupLink: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
});

