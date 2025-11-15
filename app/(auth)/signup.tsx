
import MyButton from "@/components/button";
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import axios from "@/utils/axios" // make sure this works with React Native, may need axios polyfills

const Signup = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("/user/signup", {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
      });

      // Store token or user info here
      // e.g., AsyncStorage.setItem("token", response.data.token);

      Alert.alert("Success", "User signed up!");
      router.replace("/(auth)/login"); // navigate after signup
    } catch (error: any) {
      Alert.alert("Signup Failed", error.response?.data?.message || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={formData.confirmPassword}
        onChangeText={(text) => handleChange("confirmPassword", text)}
      />

      <MyButton title="Sign Up" onPress={handleSubmit} />

      <View style={styles.loginTextContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <Text
          style={styles.loginLink}
          onPress={() => router.replace("/(auth)/login")}
        >
          {" "}Login
        </Text>
      </View>
    </View>
  );
};

export default Signup;

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
  loginTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#fff",
  },
  loginLink: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
});

