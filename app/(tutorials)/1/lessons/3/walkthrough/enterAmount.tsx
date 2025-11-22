import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft, HelpCircle, Image as ImageIcon, PlusCircle, RefreshCw,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated, Dimensions, Easing, Keyboard, Platform, SafeAreaView,
  StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const TUTORIAL_AMOUNT = "100";

const WALKTHROUGH_STEPS = [
  {
    id: 1,
    title: "Recipient Details",
    description: "This header shows who you're sending money to. Verify the recipient's name and bank details before proceeding.",
    highlightSection: "header",
    tooltipPosition: "below",
    requiresAction: false,
  },
  {
    id: 2,
    title: "Enter Amount",
    description: `Enter the amount you want to transfer. For this tutorial, enter: ₹${TUTORIAL_AMOUNT}`,
    highlightSection: "amountInput",
    tooltipPosition: "above",
    requiresAction: true,
    actionText: `Enter ${TUTORIAL_AMOUNT} and click Continue`,
    validationFn: (data) => data.amount === TUTORIAL_AMOUNT,
  },
  {
    id: 3,
    title: "Select Payment Method",
    description: "This shows which account will be used for the payment. You can tap to change the payment source if you have multiple accounts linked.",
    highlightSection: "paymentMethod",
    tooltipPosition: "above",
    requiresAction: false,
  },
  {
    id: 4,
    title: "Complete Payment",
    description: "Tap the PAY button to proceed. You'll be asked to enter your UPI PIN on the next screen to authorize the transaction.",
    highlightSection: "payButton",
    tooltipPosition: "above",
    requiresAction: true,
    actionText: "Tap PAY to continue",
  },
];

export default function EnterAmount() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const bankName = params.bankName || "Bank";
  const bankIcon = params.bankIcon || "🏦";
  const bankColor = params.bankColor || "#F5F5F7";
  const accountNumber = params.accountNumber || "";
  const ifsc = params.ifsc || "";
  const accountHolderName = params.accountHolderName || "Receiver";
  const nickname = params.nickname || "";

  const last4 = accountNumber ? accountNumber.slice(-4) : "0000";
  const name = accountHolderName || "Receiver";

  const [amount, setAmount] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const currentWalkthrough = WALKTHROUGH_STEPS[currentStep];
  const canProceed = currentWalkthrough.validationFn 
    ? currentWalkthrough.validationFn({ amount }) 
    : true;

  const buttonScale = useRef(new Animated.Value(0.95)).current;
  const buttonOpacity = useRef(new Animated.Value(0.3)).current;
  const footerHeight = useRef(new Animated.Value(72)).current;
  const bubbleOpacity = useRef(new Animated.Value(0)).current;
  const bubbleTranslate = useRef(new Animated.Value(10)).current;
  const inputRef = useRef(null);

  const isValidAmount = () => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && /^\d+(\.\d{1,2})?$/.test(amount);
  };

  const validAmount = isValidAmount();
  const hasMessage = amount.trim().length > 0;

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, (e) => setKeyboardHeight(e.endCoordinates?.height || 0));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  useEffect(() => {
    if (!amount) {
      Animated.parallel([
        Animated.timing(bubbleOpacity, { toValue: 1, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(bubbleTranslate, { toValue: 0, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(bubbleOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(bubbleTranslate, { toValue: -5, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [amount]);

  useEffect(() => {
    if (validAmount) {
      Animated.parallel([
        Animated.spring(buttonScale, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
        Animated.timing(buttonOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(footerHeight, { toValue: 140, friction: 8, tension: 40, useNativeDriver: false }),
      ]).start();
    } else if (hasMessage) {
      Animated.parallel([
        Animated.spring(buttonScale, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
        Animated.timing(buttonOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(footerHeight, { toValue: 72, friction: 8, useNativeDriver: false }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(buttonScale, { toValue: 0.95, friction: 4, useNativeDriver: true }),
        Animated.timing(buttonOpacity, { toValue: 0.3, duration: 200, useNativeDriver: true }),
        Animated.spring(footerHeight, { toValue: 72, friction: 8, useNativeDriver: false }),
      ]).start();
    }
  }, [validAmount, hasMessage]);

  const handlePay = () => {
    if (!validAmount) return;
    if (showTutorial) setShowTutorial(false);
    router.push({
      pathname: "./enterPin",
      params: { amount, name, nickname, bankName, bankIcon, bankColor, accountNumber, ifsc, last4 },
    });
  };

  const handleAmountChange = (text) => {
    const filtered = text.replace(/[^0-9.]/g, "");
    const parts = filtered.split(".");
    if (parts.length > 2) return;
    setAmount(filtered);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleNextStep = () => {
    if (currentWalkthrough.requiresAction && !canProceed) return;
    if (currentStep < WALKTHROUGH_STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const getInitials = (fullName) => {
    const parts = fullName.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return fullName[0]?.toUpperCase() || "A";
  };

  const isHighlighted = (section) => showTutorial && currentWalkthrough.highlightSection === section;
  const isDimmed = (section) => showTutorial && currentWalkthrough.highlightSection !== section;

  const getTooltipStyle = () => {
    const section = currentWalkthrough.highlightSection;
    if (section === "header") return { top: insets.top + 100 };
    if (section === "amountInput") return { bottom: 180 };
    if (section === "paymentMethod") return { bottom: 180 };
    if (section === "payButton") return { bottom: 180 };
    return { top: 300 };
  };

  const renderTooltip = () => {
    if (!showTutorial) return null;

    return (
      <View style={[styles.tooltipContainer, getTooltipStyle()]}>
        <Text style={styles.tooltipTitle}>{currentWalkthrough.title}</Text>
        <Text style={styles.tooltipDescription}>{currentWalkthrough.description}</Text>

        <View style={styles.stepIndicator}>
          {WALKTHROUGH_STEPS.map((_, index) => (
            <View key={index} style={[styles.stepDot, index === currentStep && styles.stepDotActive]} />
          ))}
        </View>

        {!currentWalkthrough.requiresAction ? (
          <View style={styles.tooltipButtons}>
            <TouchableOpacity
              style={[styles.prevButton, currentStep === 0 && styles.buttonDisabled]}
              onPress={handlePrev}
              disabled={currentStep === 0}
            >
              <Text style={[styles.prevButtonText, currentStep === 0 && styles.buttonTextDisabled]}>Prev</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextStepButton} onPress={handleNextStep}>
              <Text style={styles.nextStepButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.tooltipActionContainer}>
            <Text style={styles.actionText}>{currentWalkthrough.actionText}</Text>
            {currentStep > 0 && (
              <TouchableOpacity style={styles.prevButtonSmall} onPress={handlePrev}>
                <Text style={styles.prevButtonSmallText}>← Previous Step</Text>
              </TouchableOpacity>
            )}
            {currentStep === 1 && canProceed && (
              <TouchableOpacity style={styles.continueButton} onPress={handleNextStep}>
                <Text style={styles.continueButtonText}>Continue →</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {showTutorial && <View style={styles.overlay} pointerEvents="box-none" />}

      <View style={styles.container}>
        
        {/* HEADER */}
        <View style={[
          styles.header, 
          { paddingTop: insets.top + 8 },
          isDimmed("header") && styles.dimmedContent,
          isHighlighted("header") && styles.highlightedInPlace
        ]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} disabled={showTutorial}>
            <ArrowLeft size={22} color="#222" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{getInitials(name)}</Text>
            </View>
            <View>
              <Text style={styles.nameText}>{name}</Text>
              <Text style={styles.subText}>{bankName} - {last4}</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn} disabled={showTutorial}>
              <RefreshCw size={20} color="#222" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} disabled={showTutorial}>
              <HelpCircle size={20} color="#222" />
            </TouchableOpacity>
          </View>
        </View>

        {/* FOOTER */}
        <Animated.View
          style={[
            styles.footer, 
            { height: footerHeight, bottom: keyboardHeight },
            isDimmed("amountInput") && isDimmed("paymentMethod") && isDimmed("payButton") && styles.dimmedContent,
            (isHighlighted("amountInput") || isHighlighted("paymentMethod") || isHighlighted("payButton")) && styles.highlightedFooter
          ]}
        >
          {validAmount && (
            <View style={styles.transferInfoRow}>
              <Text style={styles.transferLabel}>Transfer Money to</Text>
              <View style={styles.bankingRow}>
                <Text style={styles.bankingText}>{name}</Text>
                <Text style={styles.verifiedIcon}>✓</Text>
              </View>
            </View>
          )}

          <View style={styles.inputRow}>
            <View style={[
              styles.inputContainer,
              isHighlighted("amountInput") && styles.highlightedElement
            ]}>
              {validAmount && <Text style={styles.rupeePrefix}>₹</Text>}

              <TextInput
                ref={inputRef}
                style={[styles.input, validAmount && styles.bigInput]}
                placeholder="Enter amount or chat"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={amount}
                onChangeText={handleAmountChange}
                editable={!showTutorial || isHighlighted("amountInput")}
                autoFocus={isHighlighted("amountInput")}
              />
            </View>

            {!validAmount ? (
              <>
                <TouchableOpacity style={[styles.footerIcon, showTutorial && styles.dimmedContent]} disabled={showTutorial}>
                  <ImageIcon color="#000" size={22} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.footerIcon, showTutorial && styles.dimmedContent]} disabled={showTutorial}>
                  <PlusCircle color="#000" size={22} />
                </TouchableOpacity>

                <Animated.View style={[{ transform: [{ scale: buttonScale }], opacity: buttonOpacity }, showTutorial && styles.dimmedContent]}>
                  <TouchableOpacity
                    style={[styles.sendBtn, hasMessage && styles.sendBtnActive]}
                    disabled={!hasMessage || showTutorial}
                  >
                    <Text style={styles.sendIcon}>▶</Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            ) : (
              <>
                <View style={[
                  styles.upiMethodContainer,
                  isHighlighted("paymentMethod") && styles.highlightedElement,
                  isDimmed("paymentMethod") && !isHighlighted("amountInput") && !isHighlighted("payButton") && styles.dimmedElement
                ]}>
                  <Text style={styles.upiMethodIcon}>💳</Text>
                  <Text style={styles.upiMethod}>{last4}</Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </View>

                <TouchableOpacity 
                  style={[
                    styles.payButton,
                    isHighlighted("payButton") && styles.highlightedElement,
                    isDimmed("payButton") && !isHighlighted("amountInput") && !isHighlighted("paymentMethod") && styles.dimmedElement
                  ]} 
                  onPress={handlePay}
                  disabled={showTutorial && !isHighlighted("payButton")}
                >
                  <Text style={styles.payButtonText}>PAY</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
      </View>

      {renderTooltip()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, borderBottomWidth: 0.5, borderBottomColor: "#eaeaea", backgroundColor: "#fff" },
  iconBtn: { padding: 8 },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 6 },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#2e276d", justifyContent: "center", alignItems: "center", marginRight: 12 },
  avatarText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  nameText: { fontSize: 16, fontWeight: "700", color: "#111" },
  subText: { fontSize: 13, color: "#666", marginTop: 2 },
  headerRight: { flexDirection: "row", alignItems: "center" },
  footer: { position: "absolute", left: 0, right: 0, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#eee", paddingHorizontal: 14, paddingVertical: 10 },
  transferInfoRow: { marginBottom: 8 },
  transferLabel: { fontSize: 12, color: "#666" },
  bankingRow: { flexDirection: "row", alignItems: "center" },
  bankingText: { color: "#333", fontSize: 14 },
  verifiedIcon: { color: "#1e8e3e", fontSize: 16, marginLeft: 4 },
  inputRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  inputContainer: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#f2f2f2", paddingHorizontal: 16, borderRadius: 20, marginRight: 8 },
  rupeePrefix: { fontSize: 24, fontWeight: "bold", color: "#000", marginRight: 6 },
  input: { flex: 1, fontSize: 16, color: "#000", paddingVertical: 10 },
  bigInput: { fontSize: 24, fontWeight: "700" },
  footerIcon: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#ccc", justifyContent: "center", alignItems: "center" },
  sendBtnActive: { backgroundColor: "#1e8e3e" },
  sendIcon: { color: "#fff", fontWeight: "700" },
  upiMethodContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#f2f2f2", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  upiMethodIcon: { fontSize: 16 },
  upiMethod: { marginHorizontal: 4, fontSize: 14, fontWeight: "700", color: "#333" },
  dropdownIcon: { fontSize: 10, color: "#666" },
  payButton: { backgroundColor: "#1e8e3e", paddingHorizontal: 24, paddingVertical: 10, borderRadius: 24 },
  payButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  // Tutorial styles
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", zIndex: 100 },
  dimmedContent: { opacity: 0.3 },
  dimmedElement: { opacity: 0.3 },
  highlightedInPlace: { zIndex: 101, backgroundColor: "#fff", shadowColor: "#fff", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 20, elevation: 50 },
  highlightedFooter: { zIndex: 101, backgroundColor: "#fff", shadowColor: "#fff", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 20, elevation: 50 },
  highlightedElement: { shadowColor: "#fff", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 15, elevation: 10, borderWidth: 2, borderColor: "#5f259f" },
  tooltipContainer: { position: "absolute", left: "5%", right: "5%", backgroundColor: "#fff", borderRadius: 16, padding: 20, zIndex: 102, elevation: 60, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  tooltipTitle: { fontSize: 20, fontWeight: "bold", color: "#000", marginBottom: 10, marginTop: 8 },
  tooltipDescription: { fontSize: 15, color: "#555", lineHeight: 22, marginBottom: 16 },
  stepIndicator: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 16, gap: 8 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ddd" },
  stepDotActive: { backgroundColor: "#5f259f", width: 24 },
  tooltipButtons: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  prevButton: { flex: 1, backgroundColor: "#f0f0f0", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  prevButtonText: { color: "#333", fontSize: 15, fontWeight: "600" },
  nextStepButton: { flex: 1, backgroundColor: "#5f259f", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  nextStepButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  buttonDisabled: { backgroundColor: "#e0e0e0" },
  buttonTextDisabled: { color: "#999" },
  tooltipActionContainer: { alignItems: "center" },
  actionText: { textAlign: "center", padding: 8, fontSize: 16, color: "#9c27b0", fontWeight: "bold" },
  prevButtonSmall: { marginTop: 12, paddingVertical: 8, paddingHorizontal: 16 },
  prevButtonSmallText: { color: "#666", fontSize: 14 },
  continueButton: { marginTop: 8, backgroundColor: "#5f259f", paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  continueButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});