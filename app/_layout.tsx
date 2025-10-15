import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkUserState = async () => {
      const lang = await AsyncStorage.getItem("selectedLanguage");
      const signedup = await AsyncStorage.getItem("hasSignedup");
      const profile = await AsyncStorage.getItem("hasProfile");
      const token = await AsyncStorage.getItem("authToken");

      if (!signedup || !lang) setInitialRoute("(onboarding)");
      else if (!profile) setInitialRoute("(auth)");
      // if (!profile) setInitialRoute("(auth)");
      else if (token) setInitialRoute("(main)");
      else setInitialRoute("(auth)");
    };

    checkUserState();
  }, []);

  if (!initialRoute) return null; // still loading async storage

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
