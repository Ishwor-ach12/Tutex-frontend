import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Signup() {
  type SignupForm = {
    name: string;
    email: string;
    password: string;
    dob: Date;
    gender: string;
  };

  const router = useRouter();

  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    dob: new Date(),
    gender: "Male",
  });

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSignup = async (): Promise<void> => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:9004/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          dateOfBirth: form.dob.toISOString().split("T")[0],
          gender: form.gender,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        Alert.alert("Signup Failed", errText);
        return;
      }

      await AsyncStorage.setItem("userSignedUp", "true");
      Alert.alert("Success", "Signup successful!");
      router.replace("/(auth)/Login");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Cannot connect to backend");
    }
  };

  const handleLogin = () => {
    router.replace("/(auth)/Login");
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Blue Section */}
        <View style={styles.topSection}>
          <TouchableOpacity
            onPress={() => {
              router.replace("/(tutorials)/SignupTutorial");
            }}
            style={styles.helpButton}
          >
            <Ionicons
              name="help-circle-outline"
              size={50}
              color={styles.helpButton.color}
            />
          </TouchableOpacity>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>Tutex</Text>
        </View>

        {/* Bottom White Section */}
        <View style={styles.bottomSection}>
          <View style={styles.cloudContainer}>
            {[...Array(40)].map((_, index) => {
              const isLight = Math.random() < 0.85; // True ~50% of the time, False ~50% of the time
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
            {[...Array(40)].map((_, index) => {
              // Determine the style randomly
              const isLight = Math.random() < 0.75; // True ~50% of the time, False ~50% of the time
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
            {[...Array(12)].map((_, index) => (
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
          <Text style={styles.title}>Sign Up</Text>

          {/* Name */}
          <Text style={styles.label}>Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#888"
              style={styles.input}
              value={form.name}
              onChangeText={(val) => setForm({ ...form, name: val })}
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#888"
              style={styles.input}
              keyboardType="email-address"
              value={form.email}
              onChangeText={(val) => setForm({ ...form, email: val })}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#888"
              style={styles.input}
              secureTextEntry={!showPassword}
              value={form.password}
              onChangeText={(val) => setForm({ ...form, password: val })}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Date of Birth */}
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={[styles.input, { color: "black" }]}>
              {form.dob.toDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={form.dob}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_: any, selectedDate?: Date) => {
                setShowDatePicker(false);
                if (selectedDate) setForm({ ...form, dob: selectedDate });
              }}
            />
          )}

          {/* Gender */}
          <Text style={styles.label}>Gender</Text>
          <View style={[styles.inputContainer, { paddingRight: 10 }]}>
            <Ionicons name="male-female-outline" size={20} color="#666" />
            <Picker
              selectedValue={form.gender}
              style={styles.picker}
              onValueChange={(val) => setForm({ ...form, gender: val })}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity onPress={handleSignup} style={styles.signupBtn}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
          <View style={styles.loginButton}>
            <Text style={{ color: "black", fontSize: 18 }}>
              Already have an account?{" "}
            </Text>
            <Text style={styles.loginText} onPress={handleLogin}>
              Login
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  topSection: {
    height: 350,
    backgroundColor: "#0d6efd",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 100, height: 100, justifyContent: "flex-start" },

  logoText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },

  helpButton: {
    color: "#fff",
    marginLeft: "auto",
    marginRight: 13,
  },

  bottomSection: {
    flex: 1,
    backgroundColor: "white",
    padding: 25,
    paddingBottom: 40,
    paddingTop: 0,
    marginTop: -60,
    borderTopLeftRadius: "4%",
    borderTopRightRadius: "4%",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginTop: 0,
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
    marginBottom: 15,
  },

  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "black",
  },

  picker: {
    flex: 1,
    color: "black",
  },

  signupBtn: {
    backgroundColor: "#0d6efd",
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  signupText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 12,
    fontSize: 80,
  },
  loginText: {
    color: "#0d6efd",
    fontSize: 18,
    marginLeft: 6,
  },
  cloudContainer: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 24,
    marginTop: -24,
    marginHorizontal: -12,
  },
  cloudContainer2: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 24,
    // marginTop: -32,
    marginHorizontal: -12,
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
});
