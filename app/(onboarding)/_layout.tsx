import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />                {/* Splash */}
      <Stack.Screen name="LanguageSelection" />
      <Stack.Screen name="SignupTutorial" />
    </Stack>
  );
}
