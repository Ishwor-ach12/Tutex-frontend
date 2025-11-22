import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import i18n from "../../i18n"; // adjust path if needed

// Languages you support
const LANGUAGE_OPTIONS = [
  { name: "English", code: "en" },
  { name: "हिन्दी", code: "hi" },
];

export default function LanguagePreferences() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  // Load previously selected language from AsyncStorage
  useEffect(() => {
    const loadLanguage = async () => {
      const savedLng = await AsyncStorage.getItem("user-language");
      if (savedLng) setSelected(savedLng);
    };
    loadLanguage();
  }, []);

  const handleLanguageChange = async (code: string) => {
    try {
      setSelected(code);

      // Update i18n global state
      await i18n.changeLanguage(code);

      // Save selection (your detector uses this key)
      await AsyncStorage.setItem("user-language", code);

      // Go back to previous page OR to profile
      router.back(); // or router.replace("/(main)/(tabs)/profile");
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{"Select Language"}</Text>

      {LANGUAGE_OPTIONS.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.button,
            selected === lang.code && styles.buttonSelected,
          ]}
          onPress={() => handleLanguageChange(lang.code)}
        >
          <Text
            style={[
              styles.text,
              selected === lang.code && styles.textSelected,
            ]}
          >
            {lang.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, alignItems: "center", backgroundColor: "white" },
  title: { fontSize: 25, fontWeight: "bold", marginBottom: 40, color: "black" },
  button: {
    width: "80%",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#eee",
    borderRadius: 12,
    alignItems: "center",
  },
  buttonSelected: {
    backgroundColor: "#0d6efd",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  textSelected: {
    color: "white",
    fontWeight: "bold",
  },
});
