import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";

import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleLogin = async () => {
    try {
      const response = await fetch("https://tutex-vq6j.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username:email, password }),
      });

      if (!response.ok) {
        const err = await response.text();
        Alert.alert("Login failed", err);
        return;
      }

      const data = await response.json();
      await AsyncStorage.setItem("authToken", data.body["auth_token"]);
      console.log("hi1")
      await AsyncStorage.setItem("userProfile", JSON.stringify(data.body["userProfile"]));
      console.log("hi2")
      Alert.alert("Success", "Login successful!");
      router.replace("/(main)/(tabs)/home")
      // redirect user here
    } catch (error) {
      Alert.alert("Error", "Cannot connect to server");
      console.log(error);
    }
  };
  const handleSignup = () => {
    router.replace("/(auth)/Signup");
  };

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={()=>{router.replace("../(tutorials)/LoginTutorial")}} style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={50} color={styles.helpButton.color}/>
        </TouchableOpacity>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <Text style={styles.logoText}>Tutex</Text>
      </View>

      {/* Cloud Separator */}

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.cloudContainer}>
          {[...Array(12)].map((_, index) => {
            // Determine the style randomly
            const isLight = Math.random() < 0.9; // True ~50% of the time, False ~50% of the time
            const cloudStyle = isLight ? styles.lightCloud : styles.darkCloud;
            const h = Math.random() * (80 - 48) + 48;

            return (
              <View
                key={index}
                style={[
                  cloudStyle, // Apply the randomly chosen style (light or dark)
                  {
                    marginHorizontal: Math.random() * -24,
                    marginVertical: Math.random() * -32,
                    height: h,
                    width: Math.random() * (120 - 80) + h * 1.2,
                  },
                ]}
              />
            );
          })}
        </View>
        <View style={styles.cloudContainer2}>
          {[...Array(9)].map((_, index) => {
            // Determine the style randomly
            const isLight = Math.random() < 0.9; // True ~50% of the time, False ~50% of the time
            const cloudStyle = isLight ? styles.lightCloud : styles.darkCloud;
            const h = Math.random() * (80 - 48) + 48;

            return (
              <View
                key={index}
                style={[
                  cloudStyle, // Apply the randomly chosen style (light or dark)
                  {
                    marginHorizontal: Math.random() * -24,
                    marginVertical: Math.random() * -32,
                    height: h,
                    width: Math.random() * (120 - 80) + h,
                  },
                ]}
              />
            );
          })}
        </View>
        <View style={styles.cloudContainer2}>
          {[...Array(8)].map((_, index) => (
            <View
              key={index} // Keys are important for list items in React
              style={[
                styles.darkCloud,
                {
                  marginHorizontal: Math.random() * -24,
                  marginVertical: Math.random() * -32,
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" />
          <TextInput
            placeholder="Enter email"
            placeholderTextColor="#888"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <TextInput
            placeholder="Enter password"
            placeholderTextColor="#888"
            style={styles.input}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.loginButton}>
          <Text style={{ color: "black", fontSize: 18 }}>
            Do not have an account?{" "}
          </Text>
          <Text style={styles.signupText} onPress={handleSignup}>
            Create Account
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d6efd",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logo: { width: 120, height: 120, marginBottom: 12 },

  topSection: {
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },

  cloudSvg: {
    position: "absolute",
    top: "22%",
  },
  cloudContainer: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 24,
    marginTop: -64,
    marginHorizontal: -32,
  },
  cloudContainer2: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 24,
    // marginTop: -32,
    marginHorizontal: -32,
  },
  darkCloud: {
    borderRadius: "80%",
    height: 44,
    width: 80,
    backgroundColor: "#ffffffff",
  },

  lightCloud: {
    borderRadius: "80%",
    // marginHorizontal: Math.random() * -12,
    backgroundColor: "#ffffffb5",
    shadowColor: "#c8c8c8ff",
  },

  bottomSection: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 25,
  },
  loginButton: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 12,
    fontSize: 80,
  },
  signupText: {
    color: "#0d6efd",
    fontSize: 18,
    marginLeft: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginVertical: 25,
  },

  label: {
    color: "black",
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#0d6efd",
    marginBottom: 18,
  },

  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "black",
  },

  loginBtn: {
    backgroundColor: "#0d6efd",
    marginTop: 25,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  helpButton:{
    color:"#fff",
    marginLeft:"auto",
    marginRight:13,
  }
});
