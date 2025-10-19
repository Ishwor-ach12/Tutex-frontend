// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// const LANGUAGES = ["English", "Hindi", "Spanish", "French"];

// export default function LanguageScreen() {
//   const [selected, setSelected] = useState<string | null>(null);
//   const router = useRouter();

//   const handleLanguageSelect = async (lang: string) => {
//     setSelected(lang);
//     await AsyncStorage.setItem("selectedLanguage", lang);
//     router.replace("/(auth)/Login");
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Select Your Language</Text>
//       {LANGUAGES.map((lang) => (
//         <TouchableOpacity
//           key={lang}
//           style={[
//             styles.button,
//             selected === lang && { backgroundColor: "#3b5998" },
//           ]}
//           onPress={() => handleLanguageSelect(lang)}
//         >
//           <Text
//             style={[
//               styles.text,
//               selected === lang && { color: "white", fontWeight: "bold" },
//             ]}
//           >
//             {lang}
//           </Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" },
//   title: { fontSize: 22, fontWeight: "bold", marginBottom: 60, color:"black" },
//   button: {
//     padding: 15,
//     marginVertical: 8,
//     width: "80%",
//     backgroundColor: "#eee",
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   text: { fontSize: 16, color: "#333" },
// });


import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// 💡 Import the i18n instance configured in your project
import i18n from "../i18n"; // Adjust the path as necessary

// 1. Map the displayed name to the required language code (ISO 639-1)
// These codes MUST match the keys used in your i18n.js resources object (e.g., 'en', 'hi', 'es', 'fr').
const LANGUAGE_OPTIONS: { name: string, code: string }[] = [
  { name: "English", code: "en" },
  { name: "हिन्दी", code: "hi" }, // Using native name for better UX
  { name: "Español", code: "es" },
  { name: "Français", code: "fr" },
];

export default function LanguageScreen() {
  // Store the code of the selected language
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  // 💡 Function to handle language selection and update i18n state
  const handleLanguageSelect = async (langCode: string) => {
    try {
      // 1. Update component state (for button highlighting)
      setSelected(langCode);

      // 2. Change the global i18n state
      // This triggers the global language update and saves the selection via the languageDetector (if configured)
      await i18n.changeLanguage(langCode); 

      // 3. Navigate to the next screen (LoginTutorial will now render in the selected language)
      router.replace("/(auth)/Login"); // Assuming you want to go to the tutorial
      
    } catch (error) {
      console.error("Failed to set language:", error);
      // Optional: Add a visual error message here
    }
  };

  return (
    <View style={styles.container}>
      {/* Note: This Title should ideally also be translated if the app supports a default language before this screen */}
      <Text style={styles.title}>Select Your Language</Text> 
      
      {LANGUAGE_OPTIONS.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.button,
            selected === lang.code && { backgroundColor: "#0d6efd" }, // Changed to the blue used in your LoginTutorial
          ]}
          onPress={() => handleLanguageSelect(lang.code)}
        >
          <Text
            style={[
              styles.text,
              selected === lang.code && { color: "white", fontWeight: "bold" },
            ]}
          >
            {/* Display the native language name */}
            {lang.name} 
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
