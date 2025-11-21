import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { TextInput, Menu } from "react-native-paper";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";

const EditProfileScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [name, setName] = useState<string>((params.name as string) || "");
  const [dob, setDob] = useState<Date>(
    params.dob ? new Date(params.dob as string) : new Date()
  );
  const [gender, setGender] = useState<string>((params.gender as string) || "");
  const [email] = useState<string>((params.email as string) || "");
  const [userId] = useState<number>(Number(params.userId));

  const [loading, setLoading] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // Validation
  const validateForm = () => {
    if (name.trim().length === 0) {
      alert("Name cannot be empty.");
      return false;
    }
    if (!gender) {
      alert("Please select gender.");
      return false;
    }
    if (dob > new Date()) {
      alert("Date of birth cannot be in the future.");
      return false;
    }
    return true;
  };

  // Save Profile
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        alert("User not authenticated. Please log in again.");
        return;
      }

      const payload = {
        userId,
        name,
        dob: {
          year: dob.getFullYear(),
          month: dob.getMonth() + 1,
          day: dob.getDate(),
        },
        gender,
        profileUrl: null,
      };

      console.log("Payload:", payload);
      console.log("Token:", token);

      const response = await axios.patch(
        "https://tutex-vq6j.onrender.com/user/update",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updated = response.data.body;
      console.log("Updated from backend:", updated);

      // Merge updated fields with the previous saved profile
      const existingString = await AsyncStorage.getItem("userProfile");
      const existing = existingString ? JSON.parse(existingString) : {};

      const mergedProfile = {
        ...existing,
        ...updated,
      };

      await AsyncStorage.setItem("userProfile", JSON.stringify(mergedProfile));

      alert("Profile updated successfully!");
      router.back();
    } catch (error: any) {
      console.log("Update error:", error.response?.data || error.message);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Account Handler
  const handleDeleteAccount = async () => {
    try {
      const confirm = window.confirm
        ? window.confirm("Are you sure you want to delete your account?")
        : true;

      if (!confirm) return;

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        alert("User not authenticated. Please log in again.");
        return;
      }

      setLoading(true);

      const response = await axios.delete(
        "https://tutex-vq6j.onrender.com/user/delete",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Delete response:", response.data);

      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userProfile");

      alert("Account deleted successfully!");
      router.replace("/(auth)/Login");
    } catch (error: any) {
      console.log("Delete error:", error.response?.data || error.message);
      alert("Failed to delete account. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Date Picker Handler
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Photo */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.profileImage}
        />
      </View>

      {/* Full Name */}
      <TextInput
        label="Full Name"
        mode="outlined"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      {/* Date of Birth */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          label="Date of Birth"
          mode="outlined"
          value={dob.toLocaleDateString()}
          editable={false}
          style={styles.input}
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}

      {/* Gender Dropdown */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <TextInput
              label="Gender"
              mode="outlined"
              value={gender}
              editable={false}
              style={styles.input}
            />
          </TouchableOpacity>
        }
      >
        <Menu.Item
          onPress={() => {
            setGender("M");
            setMenuVisible(false);
          }}
          title="Male"
        />
        <Menu.Item
          onPress={() => {
            setGender("F");
            setMenuVisible(false);
          }}
          title="Female"
        />
        <Menu.Item
          onPress={() => {
            setGender("O");
            setMenuVisible(false);
          }}
          title="Other"
        />
      </Menu>

      {/* Buttons */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>{loading ? "Saving..." : "Save"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Delete Account */}
      <TouchableOpacity style={styles.deleteOption} onPress={handleDeleteAccount}>
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  profileContainer: { alignItems: "center", marginBottom: 20 },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e0e0",
  },

  input: { marginBottom: 15 },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },

  button: {
    width: "48%",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },

  saveButton: { backgroundColor: "#2196F3" },
  cancelButton: { backgroundColor: "#E0E0E0" },

  saveText: { color: "white", fontWeight: "600" },
  cancelText: { color: "black", fontWeight: "600" },

  deleteOption: { paddingVertical: 10 },
  deleteText: { color: "red", fontSize: 18, fontWeight: "500" },
});
