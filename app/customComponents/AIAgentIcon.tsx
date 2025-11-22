// components/AIAgentIcon.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Easing, StyleSheet } from "react-native";

export type AgentState = "idle" | "listening" | "processing" | "speaking";

export function AIAgentIcon({
  state,
  size,
}: {
  state: AgentState;
  size: number;
}) {
  const pulse = useRef(new Animated.Value(1)).current;
  const shadowOpacity = useRef(new Animated.Value(0)).current;

  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    console.log("State changed to:", state);
    
    // Stop previous loop animation
    if (loopRef.current) {
      loopRef.current.stop();
      loopRef.current = null;
    }

    // Animate pulse back to 1
    Animated.timing(pulse, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Animate shadow opacity based on state
    if (state === "listening" || state === "speaking") {
      Animated.timing(shadowOpacity, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }).start();

      loopRef.current = Animated.loop(
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
      );

      loopRef.current.start();
    } else {
      // Fade out shadow for idle/processing
      Animated.timing(shadowOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [state]);

  // Get shadow color based on state - force re-render by using state directly
  const shadowColor =
    state === "speaking"
      ? "#00ffc8"
      : state === "listening"
      ? "#00bfff"
      : "#000000"; // Use black with 0 opacity instead of transparent

  return (
    <Animated.View
      key={state} // Force re-mount on state change - this ensures style updates
      style={[
        styles.container,
        {
          transform: [{ scale: pulse }],
          shadowColor: shadowColor,
          shadowOpacity: shadowOpacity,
        },
      ]}
    >
      {state === "idle" && (
        <MaterialCommunityIcons name="robot" size={size} color="#aaa" />
      )}
      {state === "listening" && (
        <Ionicons name="mic" size={size} color="#00b18aff" />
      )}
      {state === "processing" && (
        <ActivityIndicator size={size} color="#00b18aff" />
      )}
      {state === "speaking" && (
        <MaterialCommunityIcons
          name="robot-happy"
          size={size}
          color="#00b18aff"
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 50,
    padding: 10,
    shadowRadius: 15,
    elevation: 8,
  },
});