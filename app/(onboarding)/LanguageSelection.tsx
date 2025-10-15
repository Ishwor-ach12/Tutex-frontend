import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const LANGUAGES = ["English", "Hindi", "Spanish", "French"];

export default function LanguageScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleLanguageSelect = async (lang: string) => {
    setSelected(lang);
    await AsyncStorage.setItem("selectedLanguage", lang);
    router.replace("/(auth)/Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Language</Text>
      {LANGUAGES.map((lang) => (
        <TouchableOpacity
          key={lang}
          style={[
            styles.button,
            selected === lang && { backgroundColor: "#3b5998" },
          ]}
          onPress={() => handleLanguageSelect(lang)}
        >
          <Text
            style={[
              styles.text,
              selected === lang && { color: "white", fontWeight: "bold" },
            ]}
          >
            {lang}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 60, color:"black" },
  button: {
    padding: 15,
    marginVertical: 8,
    width: "80%",
    backgroundColor: "#eee",
    borderRadius: 10,
    alignItems: "center",
  },
  text: { fontSize: 16, color: "#333" },
});
