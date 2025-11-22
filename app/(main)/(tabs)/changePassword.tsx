import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
function ChangePasswordScreen() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("Please fill all fields");
      setOldPassword("");
      setNewPassword("");
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("authToken");

      const response = await fetch(
        "https://tutex-vq6j.onrender.com/user/password/change",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        alert(data.message || "Failed to change password");
        return;
      }

      setLoading(false);
      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      router.back();

    } catch (error) {
      setLoading(false);
      alert("Error occurred. Try again.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Change Password</Text>

      {/* OLD PASSWORD */}
      <Text style={styles.label}>Old Password</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter old password here"
          secureTextEntry={!showOld}
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TouchableOpacity onPress={() => setShowOld(!showOld)}>
          <Ionicons
            name={showOld ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="grey"
          />
        </TouchableOpacity>
      </View>

      {/* NEW PASSWORD */}
      <Text style={styles.label}>New Password</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter new password here"
          secureTextEntry={!showNew}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={() => setShowNew(!showNew)}>
          <Ionicons
            name={showNew ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="grey"
          />
        </TouchableOpacity>
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.changeBtn}
        onPress={handleChangePassword}
        disabled={loading}
      >
        <Text style={styles.changeBtnText}>
          {loading ? "Updating..." : "Change Password"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}


export default ChangePasswordScreen;
const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 18,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  changeBtn: {
    backgroundColor: "#2196F3",
    paddingVertical: 13,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  changeBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
