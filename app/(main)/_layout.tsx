import { Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

function Header() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        backgroundColor: "#f8f9fa",
        borderBottomWidth: 1,
        borderColor: "#ddd",
      }}
    >
      <Image
        source={require("../../assets/logo.png")}
        style={{ width: 30, height: 30, marginRight: 10 }}
      />
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>MyApp</Text>
    </View>
  );
}

export default function MainLayout() {
  return (
    <>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#3b5998",
        }}
      >
        <Tabs.Screen name="home" options={{ title: "Home" }} />
        <Tabs.Screen name="analytics" options={{ title: "Analytics" }} />
        <Tabs.Screen name="search" options={{ title: "Search" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
    </>
  );
}
