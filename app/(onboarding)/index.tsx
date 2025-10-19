import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import "../i18n.ts";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(onboarding)/LanguageSelection");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#236FFE", "#347bffff", "#30A0FE"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Tutex</Text>
        <Text style={styles.subtitle}>Tutorial to Experience</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { alignItems: "center" },
  logo: { width: 160, height: 160, marginBottom: 12 },
  title: { fontSize: 28, color: "#fff", fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 20, color: "#fff", fontWeight: "bold" },

});
