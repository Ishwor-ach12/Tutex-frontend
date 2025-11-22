import { Tabs } from "expo-router";
import { Image, Text, TextStyle, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTabBar from "../customComponents/CustomTabBar";
import {useTranslation} from "react-i18next";
// The edges prop is important to specify which edges to apply padding to

// Define the styles within the component file or import a StyleSheet object

/**
 * Custom Header Component
 */
function Header() {
  return (
    <View style={HeaderStyles.container as ViewStyle}>
      <Image
        source={require("../../assets/logo.png")}
        style={HeaderStyles.logo}
      />
      <View style={HeaderStyles.textContainer}>
        <Text style={HeaderStyles.title as TextStyle}>Tutex</Text>
        <Text style={HeaderStyles.subtitle as TextStyle}>
          Tutorial to Experience
        </Text>
      </View>
    </View>
  );
}

const HeaderStyles = {
  container: {
    height: 75,
    flexDirection: "row",
    alignItems: "flex-end", // Aligns content to the bottom of the 100px view
    paddingLeft: 12,
    backgroundColor: "#0d6efd",
  },
  logo: {
    width: 72,
    height: 72,
    marginRight: 10,
  },
  textContainer: {
    padding: 8,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
};

/**
 * Main Layout Component with Fixed Header and Tabs Navbar
 */
export default function MainLayout() {
  const {t} = useTranslation();
  return (
    <View style={{ flex: 1 }}>
      {/* Fixed Header */}
      <SafeAreaView style={{ backgroundColor: "#0d6efd" }} edges={["top"]}>
        <Header />
      </SafeAreaView>

      {/* Tabs Layout */}
      <Tabs
        // Move tabBar here, outside of screenOptions
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          // Remove the tabBar prop from here, as it's not valid for screenOptions
        }}
      >
        <Tabs.Screen name="(tabs)/home" options={{ title: `${t("static_text.bottom_home")}` }} />
        <Tabs.Screen name="(tabs)/search" options={{ title: `${t("static_text.bottom_search")}` }} />
        <Tabs.Screen name="(tabs)/analytics" options={{ title: `${t("static_text.bottom_analytics")}` }} />
        <Tabs.Screen name="(tabs)/profile" options={{ title: `${t("static_text.bottom_profile")}` }} />
        <Tabs.Screen 
          name="(main-routes)" 
          options={{ 
            title: "Ongoing Lesson",
            tabBarButton: () => null  // This prevents the tab from rendering
          }} 
        />
      </Tabs>
    </View>
  );
}
