import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Dimensions,
  findNodeHandle,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { VoiceAgent } from "../customComponents/VoiceAgent";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");


export default function LoginTutorial() {
  const router = useRouter();

  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(0);
  const [tutorialActive, setTutorialActive] = useState(true);
  const [componentPositions, setComponentPositions] = useState({});

  const highlightAnim = useRef(new Animated.Value(1)).current;

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const loginRef = useRef(null);
  const signupRef = useRef(null);

  const tutorialSteps = [
    {
      key: "email",
      // The key used to look up the translated Title
      titleKey: "login_tutorial.email_title",
      // The key used to look up the translated Description
      descriptionKey: "login_tutorial.email_description",
      ref: emailRef,
    },
    {
      key: "password",
      titleKey: "login_tutorial.password_title",
      descriptionKey: "login_tutorial.password_description",
      ref: passwordRef,
    },
    {
      key: "login",
      titleKey: "login_tutorial.login_title",
      descriptionKey: "login_tutorial.login_description",
      ref: loginRef,
    },
    {
      key: "signup",
      titleKey: "login_tutorial.signup_title",
      descriptionKey: "login_tutorial.signup_description",
      ref: passwordRef,
    },
  ];
  const handleUIVoiceSync = (stepKey: string) => {
    const index = tutorialSteps.findIndex((data) => data.key == stepKey);
    if (index != -1) setCurrentStep(index);
  };
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
    if (currentStep == tutorialSteps.length - 1) {
      router.replace("/(auth)/Login");
    } else setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
    const spaceAbove = position.top - 150; // 150px for tooltip height + margin
    const spaceBelow = SCREEN_HEIGHT - (position.top + position.height) - 150;

    // Prefer positioning above if there's enough space, otherwise below
    if (spaceAbove > 100) {
      return {
        ...styles.tooltipAbove,
        bottom: SCREEN_HEIGHT - position.top + 20, // Position above the element
      };
    } else {
      return {
        ...styles.tooltipBelow,
        top: position.top + position.height + 20, // Position below the element
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
        left: position.centerX - 10, // Center the arrow above the component
      };
    } else {
      return {
        ...styles.tooltipArrowTop,
        left: position.centerX - 10, // Center the arrow below the component
      };
    }
  };

  return (
    <View
      style={[styles.container, tutorialActive && styles.tutorialBackground]}
    >
      {/* Top Section */}
      <View style={[styles.topSection, tutorialActive && styles.dimmedSection]}>
        <View style={styles.buttonSection}>
          <TouchableOpacity onPress={() => router.replace("/(auth)/Login")}>
            <Ionicons name="arrow-back-circle-outline" size={70} color="#fff" />
          </TouchableOpacity>
          <VoiceAgent tutorialName="LoginTutorial" uiHandlerFunction={handleUIVoiceSync} size={35}/>
        </View>

        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <Text style={styles.logoText}>Tutex</Text>
      </View>

      {/* Bottom Section */}
      <View
        style={[styles.bottomSection, tutorialActive && styles.dimmedSection]}
      >
        <Text style={[styles.title, tutorialActive && styles.dimmedText]}>
          Login
        </Text>

        {/* Email Input */}
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
              placeholder="Enter email"
              placeholderTextColor="#888"
              style={styles.input}
              editable={!tutorialActive}
            />
          </View>
        </Animated.View>

        {/* Password Input */}
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
              placeholder="Enter password"
              placeholderTextColor="#888"
              style={styles.input}
              secureTextEntry
              editable={!tutorialActive}
            />
            <Ionicons name="eye-off-outline" size={20} color="#666" />
          </View>
        </Animated.View>

        {/* Login Button */}
        <Animated.View
          style={[getComponentStyle("login"), getTransform("login")]}
          ref={loginRef}
        >
          <TouchableOpacity style={styles.loginBtn} disabled={tutorialActive}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Signup Link */}
        <Animated.View
          style={[
            styles.signupWrapper,
            getComponentStyle("signup"),
            getTransform("signup"),
          ]}
          ref={signupRef}
        >
          <View style={styles.loginButton}>
            <Text
              style={[styles.normalText, tutorialActive && styles.dimmedText]}
            >
              Don't have an account ?{" "}
            </Text>
            <Text
              style={[styles.signupText, tutorialActive && styles.dimmedText]}
            >
              Create account
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Tutorial Tooltip */}
      {tutorialActive && (
        <View style={[styles.tooltipContainer, getTooltipPosition()]}>
          {/* Tooltip Arrow */}
          <View style={styles.tooltip}>
            <Text style={styles.tooltipTitle}>
              {t(tutorialSteps[currentStep].titleKey)}
            </Text>
            <Text style={styles.tooltipDescription}>
              {t(tutorialSteps[currentStep].descriptionKey)}
            </Text>

            <View style={styles.tooltipButtons}>
              {currentStep > 0 && (
                <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                  <Text style={styles.backBtnText}>
                    {t("login_tutorial.btn_back")}
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
            </View>

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
  tutorialBackground: {
    opacity: 1,
  },
  dimmedSection: {
    opacity: 1,
  },
  dimmedText: {
    opacity: 1,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  topSection: {
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
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
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginVertical: 25,
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
    marginBottom: 18,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "black",
  },
  inputWrapper: {
    marginBottom: 20,
    borderRadius: 8,
    padding: 8,
  },
  signupWrapper: {
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
  loginBtn: {
    backgroundColor: "#0d6efd",
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  loginText: {
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
  signupText: {
    color: "#0d6efd",
    fontSize: 18,
    marginLeft: 6,
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