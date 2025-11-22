import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as Speak from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Animated,
  Dimensions,
  findNodeHandle,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { AgentState } from "../customComponents/AIAgentIcon";
import { langMap, VoiceAgent } from "../customComponents/VoiceAgent";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function SignupTutorial() {
  type SignupForm = {
    name: string;
    email: string;
    password: string;
    dob: Date;
    gender: string;
  };

  const router = useRouter();
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(0);
  const currentStepRef = useRef<number>(currentStep);
  const [tutorialActive, setTutorialActive] = useState(true);
  const [componentPositions, setComponentPositions] = useState({});

  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    dob: new Date(),
    gender: "Male",
  });

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const highlightAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dobRef = useRef(null);
  const genderRef = useRef(null);
  const signupRef = useRef(null);
  const loginRef = useRef(null);
  const isFocused = useIsFocused();
  const [aiOn, setAiOn] = useState(false);
  const languageRef = useRef<string|null>(null);

  const tutorialSteps = [
    {
      key: "name",
      titleKey: "signup_tutorial.name_title",
      descriptionKey: "signup_tutorial.name_description",
      ref: nameRef,
    },
    {
      key: "email",
      titleKey: "signup_tutorial.email_title",
      descriptionKey: "signup_tutorial.email_description",
      ref: emailRef,
    },
    {
      key: "password",
      titleKey: "signup_tutorial.password_title",
      descriptionKey: "signup_tutorial.password_description",
      ref: passwordRef,
    },
    {
      key: "dob",
      titleKey: "signup_tutorial.dob_title",
      descriptionKey: "signup_tutorial.dob_description",
      ref: dobRef,
    },
    {
      key: "gender",
      titleKey: "signup_tutorial.gender_title",
      descriptionKey: "signup_tutorial.gender_description",
      ref: genderRef,
    },
    {
      key: "signup",
      titleKey: "signup_tutorial.signup_title",
      descriptionKey: "signup_tutorial.signup_description",
      ref: signupRef,
    },
    {
      key: "login",
      titleKey: "signup_tutorial.login_title",
      descriptionKey: "signup_tutorial.login_description",
      ref: loginRef,
    },
  ];

  useEffect(() => {
    if (tutorialActive) {
      // Pulsing animation for highlighted component
      Animated.loop(
        Animated.sequence([
          Animated.timing(highlightAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(highlightAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [tutorialActive, currentStep]);

  useEffect(() => {
    measureComponents();
  }, [currentStep, tutorialActive]);

  useEffect(() => {
    restartTutorial();
  }, []);

  useEffect(()=>{
    currentStepRef.current = currentStep;
  },[currentStep])

  // Scroll to component when step changes
  useEffect(() => {
    if (tutorialActive && componentPositions[tutorialSteps[currentStep]?.key]) {
      scrollToComponent();
    }
  }, [currentStep, tutorialActive, componentPositions]);

  const scrollToComponent = () => {
    const currentStepData = tutorialSteps[currentStep];
    const position = componentPositions[currentStepData?.key];

    if (!position || !scrollViewRef.current) return;

    // Calculate scroll position to center the component
    // Account for the top section height (350) and some padding
    const topSectionHeight = 350;
    const tooltipHeight = 250; // Approximate tooltip height
    const extraPadding = 100;

    // Calculate target scroll position
    let scrollY =
      position.top - topSectionHeight - tooltipHeight - extraPadding;

    // Ensure we don't scroll to negative values
    scrollY = Math.max(0, scrollY);

    // Smooth scroll to the component
    scrollViewRef.current.scrollTo({
      y: scrollY,
      animated: true,
    });
  };

  const measureComponents = () => {
    setTimeout(() => {
      tutorialSteps.forEach((step) => {
        const handle = findNodeHandle(step.ref.current);
        if (handle) {
          UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
            setComponentPositions((prev) => ({
              ...prev,
              [step.key]: {
                top: pageY,
                left: pageX,
                width,
                height,
                centerX: pageX + width / 2,
              },
            }));
          });
        }
      });
    }, 100);
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace("/(auth)/Signup");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const restartTutorial = () => {
    setCurrentStep(0);
    setTutorialActive(true);
    // Scroll to top when restarting
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const getComponentStyle = (stepKey) => {
    if (
      !tutorialActive ||
      currentStep !== tutorialSteps.findIndex((step) => step.key === stepKey)
    ) {
      return styles.normalComponent;
    }

    return styles.highlightedComponent;
  };

  const getTransform = (stepKey) => {
    if (
      !tutorialActive ||
      currentStep !== tutorialSteps.findIndex((step) => step.key === stepKey)
    ) {
      return {};
    }

    return {
      transform: [{ scale: highlightAnim }],
    };
  };

  const getTooltipPosition = () => {
    const currentStepData = tutorialSteps[currentStep];
    const position = componentPositions[currentStepData?.key];

    if (!position) return styles.tooltipBottom;

    // Check if there's enough space above the component
    const spaceAbove = position.top - 150;
    const spaceBelow = SCREEN_HEIGHT - (position.top + position.height) - 150;

    // Prefer positioning above if there's enough space, otherwise below
    if (spaceAbove > 100) {
      return {
        ...styles.tooltipAbove,
        bottom: SCREEN_HEIGHT - position.top + 20,
      };
    } else {
      return {
        ...styles.tooltipBelow,
        top: position.top + position.height + 20,
      };
    }
  };

  const getTooltipArrowPosition = () => {
    const currentStepData = tutorialSteps[currentStep];
    const position = componentPositions[currentStepData?.key];

    if (!position) return {};

    const spaceAbove = position.top - 150;

    if (spaceAbove > 100) {
      return {
        ...styles.tooltipArrowBottom,
        left: position.centerX - 10,
      };
    } else {
      return {
        ...styles.tooltipArrowTop,
        left: position.centerX - 10,
      };
    }
  };

  const speakInstruction = async(step:number)=>{
    if(languageRef.current == null){
      languageRef.current = (await AsyncStorage.getItem(
        "user-language"
      )) as string;
    }
    Speak.speak(t(tutorialSteps[step].descriptionKey), {
      language: langMap[languageRef.current][0],
      rate: 0.9
    });
  }

  useEffect(()=>{
        currentStepRef.current = currentStep;
        Speak.stop();
        speakInstruction(currentStep);
    },[currentStep]);

  return (
    <View
      style={[styles.container, tutorialActive && styles.tutorialBackground]}
    >
      <View style={[styles.buttonSection,{
              position: "absolute",
              top: 40,
              zIndex: 500,
            }]}>
            <TouchableOpacity onPress={() => router.replace("/(auth)/Signup")}>
              <Ionicons
                name="arrow-back-circle-outline"
                size={70}
                color="#fff"
              />
            </TouchableOpacity>
            {isFocused && <VoiceAgent
              tutorialName="SignupTutorial"
              uiHandlerFunction={(num: string) => {
                const step = parseInt(num);
                if (!isNaN(step)) {
                  setCurrentStep(step);
                }
              }}
              size={35}
              currentStepRef={currentStepRef}
              onStateChange={(state:AgentState) => {if(state === "idle") setAiOn(false); else setAiOn(true)}}
            />}
          </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={!tutorialActive}
      >
        {/* Top Blue Section */}
        <View
          style={[styles.topSection, tutorialActive && styles.dimmedSection]}
        >

          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>Tutex</Text>
        </View>

        {/* Bottom White Section */}
        <View
          style={[styles.bottomSection, tutorialActive && styles.dimmedSection]}
        >
          <Text style={[styles.title, tutorialActive && styles.dimmedText]}>
            Sign Up
          </Text>

          {/* Name */}
          <Animated.View
            style={[
              styles.inputWrapper,
              getComponentStyle("name"),
              getTransform("name"),
            ]}
            ref={nameRef}
          >
            <Text style={[styles.label, tutorialActive && styles.dimmedText]}>
              Name
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <TextInput
                placeholder="Enter your name"
                placeholderTextColor="#888"
                style={styles.input}
                value={form.name}
                onChangeText={(val) => setForm({ ...form, name: val })}
                editable={!tutorialActive}
              />
            </View>
          </Animated.View>

          {/* Email */}
          <Animated.View
            style={[
              styles.inputWrapper,
              getComponentStyle("email"),
              getTransform("email"),
            ]}
            ref={emailRef}
          >
            <Text style={[styles.label, tutorialActive && styles.dimmedText]}>
              Email
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#888"
                style={styles.input}
                keyboardType="email-address"
                value={form.email}
                onChangeText={(val) => setForm({ ...form, email: val })}
                editable={!tutorialActive}
              />
            </View>
          </Animated.View>

          {/* Password */}
          <Animated.View
            style={[
              styles.inputWrapper,
              getComponentStyle("password"),
              getTransform("password"),
            ]}
            ref={passwordRef}
          >
            <Text style={[styles.label, tutorialActive && styles.dimmedText]}>
              Password
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#888"
                style={styles.input}
                secureTextEntry={!showPassword}
                value={form.password}
                onChangeText={(val) => setForm({ ...form, password: val })}
                editable={!tutorialActive}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={tutorialActive}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Date of Birth */}
          <Animated.View
            style={[
              styles.inputWrapper,
              getComponentStyle("dob"),
              getTransform("dob"),
            ]}
            ref={dobRef}
          >
            <Text style={[styles.label, tutorialActive && styles.dimmedText]}>
              Date of Birth
            </Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowDatePicker(true)}
              disabled={tutorialActive}
            >
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={[styles.input, { color: "black" }]}>
                {form.dob.toDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={form.dob}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_: any, selectedDate?: Date) => {
                  setShowDatePicker(false);
                  if (selectedDate) setForm({ ...form, dob: selectedDate });
                }}
              />
            )}
          </Animated.View>

          {/* Gender */}
          <Animated.View
            style={[
              styles.inputWrapper,
              getComponentStyle("gender"),
              getTransform("gender"),
            ]}
            ref={genderRef}
          >
            <Text style={[styles.label, tutorialActive && styles.dimmedText]}>
              Gender
            </Text>
            <View style={[styles.inputContainer, { paddingRight: 10 }]}>
              <Ionicons name="male-female-outline" size={20} color="#666" />
              <Picker
                selectedValue={form.gender}
                style={styles.picker}
                onValueChange={(val) => setForm({ ...form, gender: val })}
                enabled={!tutorialActive}
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
          </Animated.View>

          {/* Sign Up Button */}
          <Animated.View
            style={[getComponentStyle("signup"), getTransform("signup")]}
            ref={signupRef}
          >
            <TouchableOpacity
              onPress={() => {}}
              style={styles.signupBtn}
              disabled={tutorialActive}
            >
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Login Link */}
          <Animated.View
            style={[
              styles.loginWrapper,
              getComponentStyle("login"),
              getTransform("login"),
            ]}
            ref={loginRef}
          >
            <View style={styles.loginButton}>
              <Text
                style={[styles.normalText, tutorialActive && styles.dimmedText]}
              >
                Already have an account?{" "}
              </Text>
              <Text
                style={[
                  styles.loginLinkText,
                  tutorialActive && styles.dimmedText,
                ]}
              >
                Login
              </Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Tutorial Tooltip */}
      {tutorialActive && (
        <View style={[styles.tooltipContainer, getTooltipPosition()]}>
          {/* Tooltip Arrow */}
          <View style={[styles.tooltipArrow, getTooltipArrowPosition()]} />

          <View style={styles.tooltip}>
            <Text style={styles.tooltipTitle}>
              {t(tutorialSteps[currentStep].titleKey)}
            </Text>
            <Text style={styles.tooltipDescription}>
              {t(tutorialSteps[currentStep].descriptionKey)}
            </Text>

            {!aiOn && <View style={styles.tooltipButtons}>
              {currentStep > 0 && (
                <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                  <Text style={styles.backBtnText}>
                    {t("signup_tutorial.btn_back")}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                <Text style={styles.nextBtnText}>
                  {currentStep === tutorialSteps.length - 1
                    ? t("login_tutorial.btn_finish")
                    : t("login_tutorial.btn_next")}
                </Text>
              </TouchableOpacity>
            </View>}

            <View style={styles.stepIndicator}>
              {tutorialSteps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.stepDot,
                    index === currentStep && styles.activeStepDot,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d6efd",
  },
  scrollContent: {
    flexGrow: 1,
  },
  tutorialBackground: {
    backgroundColor: "rgba(13, 110, 253, 0.7)",
  },
  dimmedSection: {
    opacity: 1,
  },
  dimmedText: {
    opacity: 1,
  },
  topSection: {
    height: 350,
    backgroundColor: "#0d6efd",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  buttonSection: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    position: "absolute",
    top: 50,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#E1D9D1",
    padding: 25,
    paddingBottom: 40,
    paddingTop: 0,
    marginTop: -60,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginTop: 0,
    marginBottom: 20,
  },
  label: {
    color: "black",
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#0d6efd",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "black",
  },
  picker: {
    flex: 1,
    color: "black",
  },
  inputWrapper: {
    marginBottom: 20,
    borderRadius: 8,
    padding: 8,
  },
  loginWrapper: {
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  normalComponent: {
    backgroundColor: "transparent",
  },
  highlightedComponent: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signupBtn: {
    backgroundColor: "#0d6efd",
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  signupText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: {
    flexDirection: "row",
    marginVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  normalText: {
    color: "black",
    fontSize: 18,
  },
  loginLinkText: {
    color: "#0d6efd",
    fontSize: 18,
    marginLeft: 6,
  },
  cloudContainer: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 24,
    marginTop: -24,
    marginHorizontal: -12,
  },
  darkCloud: {
    borderRadius: 80,
    height: 44,
    width: 80,
    backgroundColor: "#ffffffff",
  },
  lightCloud: {
    borderRadius: 80,
    backgroundColor: "#ffffffb5",
    shadowColor: "#c8c8c8ff",
  },
  // Dynamic Tooltip Styles
  tooltipContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 100,
  },
  tooltipAbove: {
    position: "absolute",
  },
  tooltipBelow: {
    position: "absolute",
  },
  tooltipBottom: {
    position: "absolute",
    bottom: 20,
  },
  tooltipArrow: {
    position: "absolute",
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
  },
  tooltipArrowTop: {
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "white",
    top: -10,
  },
  tooltipArrowBottom: {
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "white",
    bottom: -10,
  },
  tooltip: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 8,
  },
  tooltipDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    lineHeight: 22,
  },
  tooltipButtons: {
    flexDirection: "row",
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0d6efd",
  },
  backBtnText: {
    color: "#0d6efd",
    fontSize: 16,
    fontWeight: "600",
  },
  nextBtn: {
    backgroundColor: "#0d6efd",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginLeft: "auto",
  },
  nextBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeStepDot: {
    backgroundColor: "#0d6efd",
    width: 20,
  },
});
