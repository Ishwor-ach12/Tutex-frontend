// components/AIAgentIcon.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Easing, StyleSheet } from "react-native";

export type AgentState = "idle" | "listening" | "processing" | "speaking";

export function AIAgentIcon({ state,size }: { state: AgentState,size:number }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    pulse.stopAnimation();
    // spin.stopAnimation();

    if (state === "listening" || state === "speaking") {
      // Pulse animation for listening and speaking
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.2,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [state]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const renderIcon = () => {
    switch (state) {
      case "idle":
        return (
          <MaterialCommunityIcons
            name="robot"
            size={size}
            color="#aaa"
          />
        );

      case "listening":
        return (
          <Ionicons
            name="mic"
            size={size}
            color="#00b18aff"
          />
        );

      case "processing":
        return (
          <ActivityIndicator size={size} color="#00b18aff"/>
        );

      case "speaking":
        return (
          <MaterialCommunityIcons
            name="robot-happy"
            size={size}
            color="#00b18aff"
          />
        );

      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: pulse }],
          shadowColor:
            state === "speaking"
              ? "#00ffc8"
              : state === "listening"
              ? "#00bfff"
              : "transparent",
        },
      ]}
    >
      {renderIcon()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 50,
    padding: 10,
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
});