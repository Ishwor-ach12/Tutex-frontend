import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronDownIcon, ChevronUpIcon, CircleCheck, Delete, Dot, Minus } from "lucide-react-native";
import React, { useState, useRef, useEffect } from "react";
import {
  Alert, Dimensions, Image, Modal, SafeAreaView, StatusBar, StyleSheet,
  Text, TouchableOpacity, View, Platform, Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CORRECT_PIN = "0000";
const PIN_LENGTH = 4;
const { width, height } = Dimensions.get("window");

const WALKTHROUGH_STEPS = [
  {
    id: 1,
    title: "Verify Transaction Details",
    description: "Double-check the recipient name and amount before proceeding. Make sure everything is correct.",
    highlightSection: "transactionDetails",
    tooltipPosition: "25%",
    requiresAction: false,
  },
  {
    id: 2,
    title: "UPI PIN Entry",
    description: "Your UPI PIN is a secure password for authorizing payments. Never share your UPI PIN with anyone, even friends or officials. Bank officials will never ask for your PIN.",
    highlightSection: "pinSection",
    tooltipPosition: "30%",
    requiresAction: false,
  },
  {
    id: 3,
    title: "PIN Security",
    description: "Enter your PIN carefully as you have limited attempts. As you enter, the dashes will change to dots representing an entered digit.",
    highlightSection: "pinDots",
    tooltipPosition: "50%",
    requiresAction: false,
  },
  {
    id: 4,
    title: "Payment Authorization",
    description: "This is an encrypted keyboard that you have to use to enter your secret PIN.",
    highlightSection: "keypad",
    tooltipPosition: "37%",
    requiresAction: true,
    actionText: "Enter PIN 0000 to proceed",
    validationFn: (pin) => pin === CORRECT_PIN,
  },
  {
    id: 5,
    title: "Complete Payment",
    description: "Once you have entered the PIN, click on the check mark to send money.",
    highlightSection: "checkButton",
    tooltipPosition: "37%",
    requiresAction: true,
    actionText: "Click on the check mark to continue",
  },
];

const KeypadButton = ({ value, onPress, isAction, isCheckButton, isHighlighted }) => (
  <TouchableOpacity
    style={[
      styles.keypadButton,
      isCheckButton && styles.checkButton,
      isAction && !isCheckButton && styles.actionButton,
    ]}
    onPress={() => onPress(value)}
  >
    {value === "backspace" ? (
      <Delete size={32} color="#000" />
    ) : value === "check" ? (
      isHighlighted ? (
        <View style={styles.highlightedCheckButton}>
          <CircleCheck size={32} color="#000" />
        </View>
      ) : (
        <CircleCheck size={32} color="#000" />
      )
    ) : (
      <Text style={styles.keypadText}>{value}</Text>
    )}
  </TouchableOpacity>
);

const Keypad = ({ onKeyPress, currentStep }) => {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "backspace", "0", "check"];
  const isCheckHighlighted = currentStep === 4;

  return (
    <View style={styles.keypadContainer}>
      {keys.map((key) => {
        const isAction = ["backspace", "check"].includes(key);
        const isCheckButton = key === "check";
        const press = () => {
          if (key === "backspace") onKeyPress("DEL");
          else if (isCheckButton) onKeyPress("CHECK");
          else onKeyPress(key);
        };
        return (
          <KeypadButton
            key={key}
            value={key}
            onPress={press}
            isAction={isAction}
            isCheckButton={isCheckButton}
            isHighlighted={isCheckButton && isCheckHighlighted}
          />
        );
      })}
    </View>
  );
};

export default function PaymentPinScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const amount = Array.isArray(params.amount) ? params.amount[0] : params.amount || "0";
  const recipientName = Array.isArray(params.name) ? params.name[0] : params.name || "Receiver";
  const nickname = Array.isArray(params.nickname) ? params.nickname[0] : params.nickname || "";
  const bankName = Array.isArray(params.bankName) ? params.bankName[0] : params.bankName || "Bank";
  const bankIcon = Array.isArray(params.bankIcon) ? params.bankIcon[0] : params.bankIcon || "🏦";
  const bankColor = Array.isArray(params.bankColor) ? params.bankColor[0] : params.bankColor || "#F5F5F5";
  const accountNumber = Array.isArray(params.accountNumber) ? params.accountNumber[0] : params.accountNumber || "";
  const last4 = Array.isArray(params.last4) ? params.last4[0] : params.last4 || accountNumber.slice(-4);
  const ifsc = Array.isArray(params.ifsc) ? params.ifsc[0] : params.ifsc || "";

  const refId = "ABC123a1b2abc123a1234a500c4SJ78Bajbae30e01bcfdxa";
  const refUrl = "https://phonepe.com";

  const [pin, setPin] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const currentWalkthrough = WALKTHROUGH_STEPS[currentStep];

  const checkScale = useRef(new Animated.Value(1)).current;
  const fadeOverlay = useRef(new Animated.Value(0)).current;
  const loaderSpin = useRef(new Animated.Value(0)).current;
  const sendingOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showTutorial && currentStep === 3 && pin === CORRECT_PIN) {
      setCurrentStep(4);
    }
  }, [pin]);

  const playSuccessAnimation = (callback) => {
    setIsProcessing(true);
    Animated.timing(fadeOverlay, { toValue: 0.35, duration: 250, useNativeDriver: true }).start();
    Animated.sequence([
      Animated.timing(checkScale, { toValue: 1.3, duration: 180, useNativeDriver: true }),
      Animated.timing(checkScale, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
    Animated.loop(Animated.timing(loaderSpin, { toValue: 1, duration: 900, useNativeDriver: true })).start();
    Animated.timing(sendingOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    setTimeout(() => callback(), 900);
  };

  const handleKeyPress = (key) => {
    if (isProcessing) return;
    setPinError(false);

    if (key === "DEL") {
      setPin((p) => p.slice(0, -1));
      return;
    }

    if (key === "CHECK") {
      if (pin.length !== PIN_LENGTH) {
        Alert.alert("Incomplete PIN", "Please enter all digits.");
        return;
      }
      if (pin === CORRECT_PIN) {
        if (showTutorial) setShowTutorial(false);
        playSuccessAnimation(() => {
          router.push({
            pathname: "./paymentSuccess",
            params: { amount, recipientName, nickname, bankName, bankIcon, bankColor, accountNumber, last4, ifsc, refId, refUrl },
          });
        });
      } else {
        setPin("");
        setPinError(true);
        Alert.alert("Incorrect PIN", "Please try again.");
      }
      return;
    }

    if (pin.length < PIN_LENGTH) setPin((p) => p + key);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleNext = () => {
    if (currentStep < WALKTHROUGH_STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const isHighlighted = (section) => showTutorial && currentWalkthrough.highlightSection === section;
  const isDimmed = (section) => showTutorial && currentWalkthrough.highlightSection !== section;

  const renderPinInput = () => (
    <View style={styles.pinInputContainer}>
      {Array.from({ length: PIN_LENGTH }).map((_, i) => (
        <View key={i} style={styles.pinDigitWrapper}>
          {i < pin.length ? <Dot size={56} /> : <Minus size={56} />}
        </View>
      ))}
    </View>
  );

  const renderTooltip = () => {
    if (!showTutorial) return null;
    return (
      <View style={[styles.tooltipContainer, { top: currentWalkthrough.tooltipPosition }]}>
        <Text style={styles.tooltipTitle}>{currentWalkthrough.title}</Text>
        <Text style={styles.tooltipDescription}>{currentWalkthrough.description}</Text>
        <View style={styles.stepIndicator}>
          {WALKTHROUGH_STEPS.map((_, index) => (
            <View key={index} style={[styles.stepDot, index === currentStep && styles.stepDotActive]} />
          ))}
        </View>
        {!currentWalkthrough.requiresAction ? (
          <View style={styles.tooltipButtons}>
            <TouchableOpacity style={[styles.prevButton, currentStep === 0 && styles.buttonDisabled]} onPress={handlePrev} disabled={currentStep === 0}>
              <Text style={[styles.prevButtonText, currentStep === 0 && styles.buttonTextDisabled]}>Prev</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
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
          </View>
        )}
      </View>
    );
  };

  const TransactionDetailsModal = () => (
    <Modal transparent animationType="none" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
      <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.bankAndUpiContainer}>
              <View>
                <Text style={styles.modalBankName}>{bankName}</Text>
                <Text style={styles.modalAccountNum}>XXXX{last4}</Text>
              </View>
              <Image source={require("@/assets/images/phonepeTutorial/upi_logo.png")} style={styles.upiLogoPlaceholder} />
            </View>
            <View style={styles.modalSeparator} />
            <View style={styles.modalRowContainer}>
              <View>
                <Text style={styles.modalLabel}>To:</Text>
                <Text style={styles.modalLabel}>Sending:</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.modalRecipientText}>{recipientName}</Text>
                <View style={styles.modalAmountContainer}>
                  <Text style={styles.modalAmountText}>₹ {amount}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <ChevronUpIcon size={24} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.modalBody}>
            <View style={styles.modalDetailRow}><Text style={styles.modalDetailLabel}>PAYING TO</Text><Text style={styles.modalDetailValue}>{recipientName}</Text></View>
            <View style={styles.modalDetailRow}><Text style={styles.modalDetailLabel}>ACCOUNT</Text><Text style={styles.modalDetailValue}>XXXX{last4}</Text></View>
            <View style={styles.modalDetailRow}><Text style={styles.modalDetailLabel}>IFSC</Text><Text style={styles.modalDetailValue}>{ifsc}</Text></View>
            <View style={styles.modalDetailRow}><Text style={styles.modalDetailLabel}>AMOUNT</Text><Text style={styles.modalDetailValue}>₹ {amount}</Text></View>
            <View style={styles.modalDetailRow}><Text style={styles.modalDetailLabel}>REF ID</Text><Text style={styles.modalDetailValue}>{refId}</Text></View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {showTutorial && <View style={styles.overlay} pointerEvents="box-none" />}
      {renderTooltip()}

      <View style={styles.container}>
        <View style={[styles.header, isDimmed("transactionDetails") && isDimmed("pinSection") && styles.dimmedContent]}>
          <View style={styles.bankAndUpiContainer}>
            <View>
              <Text style={styles.bankName}>{bankName}</Text>
              <Text style={styles.accountNum}>XXXX{last4}</Text>
            </View>
            <Image source={require("@/assets/images/phonepeTutorial/upi_logo.png")} style={styles.upiLogoPlaceholder} />
          </View>
          <View style={styles.separator} />
          <View style={[styles.recipientAndAmountContainer, isHighlighted("transactionDetails") && styles.highlightedInPlace]}>
            <View>
              <Text style={styles.recipientLabel}>To:</Text>
              <Text style={styles.recipientLabel}>Sending:</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.recipientNameText}>{recipientName.length > 20 ? recipientName.substring(0, 20) + "..." : recipientName}</Text>
              <View style={styles.amountContainer}>
                <Text style={styles.amountText}>₹ {amount}</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.dropdownButton} disabled={showTutorial}>
                  <ChevronDownIcon size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.pinEntrySection, isHighlighted("pinSection") && styles.highlightedInPlace, isHighlighted("pinDots") && styles.highlightedInPlace, isDimmed("pinSection") && isDimmed("pinDots") && styles.dimmedContent]}>
          <Text style={styles.pinEntryText}>ENTER {PIN_LENGTH}-DIGIT UPI PIN</Text>
          {renderPinInput()}
        </View>

        <View style={[styles.warningBanner, showTutorial && styles.dimmedContent]}>
          <View style={styles.warningIcon}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>!</Text>
          </View>
          <Text style={styles.warningText}>
            You are transferring money from <Text style={{ fontWeight: "bold" }}>{bankName}</Text> to <Text style={{ fontWeight: "bold" }}>{recipientName}</Text>
          </Text>
        </View>

        <View style={styles.spacer} />

        <View style={[isHighlighted("keypad") && styles.highlightedKeypad, isHighlighted("checkButton") && styles.highlightedKeypad, isDimmed("keypad") && isDimmed("checkButton") && styles.dimmedContent]}>
          <Keypad onKeyPress={handleKeyPress} currentStep={currentStep} />
        </View>
      </View>

      <TransactionDetailsModal />

      {isProcessing && (
        <Animated.View style={[styles.processingOverlay, { opacity: fadeOverlay }]}>
          <Animated.View style={[styles.loader, { transform: [{ rotate: loaderSpin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }] }]} />
          <Animated.Text style={[styles.sendingText, { opacity: sendingOpacity }]}>Sending…</Animated.Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  container: { flex: 1, backgroundColor: "#fff" },
  header: { paddingHorizontal: 16, paddingTop: 16, backgroundColor: "#fff" },
  bankAndUpiContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  bankName: { fontSize: 14, color: "#000" },
  accountNum: { fontSize: 12, color: "#888" },
  upiLogoPlaceholder: { width: 50, height: 18, resizeMode: "contain" },
  separator: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  recipientAndAmountContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 20, paddingTop: 10, paddingHorizontal: 8, borderRadius: 8 },
  recipientLabel: { fontSize: 14, color: "#888", lineHeight: 20 },
  recipientNameText: { fontSize: 14, fontWeight: "500", color: "#000", maxWidth: 200, textAlign: "right" },
  amountContainer: { flexDirection: "row", alignItems: "center" },
  amountText: { fontSize: 18, fontWeight: "600", color: "#000" },
  dropdownButton: { paddingLeft: 6 },
  pinEntrySection: { alignItems: "center", paddingVertical: 30, marginHorizontal: 16, borderRadius: 12 },
  pinEntryText: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 20 },
  pinInputContainer: { flexDirection: "row", justifyContent: "space-between", width: "55%" },
  pinDigitWrapper: { width: "22%", alignItems: "center" },
  warningBanner: { flexDirection: "row", backgroundColor: "#feda9fff", padding: 15, marginHorizontal: 32, borderRadius: 16 },
  warningIcon: { width: 28, height: 28, borderRadius: 50, backgroundColor: "#d4740e", justifyContent: "center", alignItems: "center", marginRight: 10 },
  warningText: { fontSize: 12, color: "#333", flex: 1 },
  spacer: { flex: 1 },
  keypadContainer: { flexDirection: "row", flexWrap: "wrap", width, paddingBottom: 20, backgroundColor: "#eef0f5" },
  keypadButton: { width: width / 3, height: width / 5, justifyContent: "center", alignItems: "center" },
  checkButton: { margin: 10, width: width / 3 - 20, height: width / 5 - 20, justifyContent: "center", alignItems: "center" },
  keypadText: { fontSize: 28, color: "#000" },
  highlightedCheckButton: { backgroundColor: "#fff", padding: 8, borderRadius: 8, zIndex: 9999 },
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-start" },
  modalContent: { width: "100%", height: "65%", backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 10 },
  modalHeader: { paddingBottom: 10 },
  modalBankName: { fontSize: 14, color: "#000" },
  modalAccountNum: { fontSize: 12, color: "#888" },
  modalSeparator: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  modalRowContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 20 },
  modalLabel: { fontSize: 14, color: "#888", lineHeight: 20 },
  modalRecipientText: { fontSize: 14, fontWeight: "500", color: "#000" },
  modalAmountContainer: { flexDirection: "row", alignItems: "center" },
  modalAmountText: { fontSize: 18, fontWeight: "600", color: "#000" },
  modalBody: { paddingTop: 10, paddingHorizontal: 5 },
  modalDetailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  modalDetailLabel: { fontSize: 12, color: "#888", width: "20%" },
  modalDetailValue: { fontSize: 12, color: "#000", textAlign: "right", width: "80%" },
  // Processing overlay
  processingOverlay: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  loader: { width: 60, height: 60, borderWidth: 6, borderColor: "#6ccf7a", borderTopColor: "transparent", borderRadius: 30, marginBottom: 16 },
  sendingText: { fontSize: 16, color: "#fff", fontWeight: "600" },
  // Tutorial styles
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", zIndex: 100 },
  dimmedContent: { opacity: 0.3 },
  highlightedInPlace: { zIndex: 101, backgroundColor: "#fff", shadowColor: "#fff", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 20, elevation: 50 },
  highlightedKeypad: { zIndex: 101, backgroundColor: "#eef0f5" },
  tooltipContainer: { position: "absolute", left: "5%", right: "5%", backgroundColor: "#fff", borderRadius: 16, padding: 20, zIndex: 102, elevation: 60 },
  tooltipTitle: { fontSize: 20, fontWeight: "bold", color: "#000", marginBottom: 10 },
  tooltipDescription: { fontSize: 15, color: "#555", lineHeight: 22, marginBottom: 16 },
  stepIndicator: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 16, gap: 8 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ddd" },
  stepDotActive: { backgroundColor: "#5f259f", width: 24 },
  tooltipButtons: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  prevButton: { flex: 1, backgroundColor: "#f0f0f0", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  prevButtonText: { color: "#333", fontSize: 15, fontWeight: "600" },
  nextButton: { flex: 1, backgroundColor: "#5f259f", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  nextButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  buttonDisabled: { backgroundColor: "#e0e0e0" },
  buttonTextDisabled: { color: "#999" },
  tooltipActionContainer: { alignItems: "center" },
  actionText: { textAlign: "center", padding: 8, fontSize: 16, color: "#9c27b0", fontWeight: "bold" },
  prevButtonSmall: { marginTop: 12, paddingVertical: 8, paddingHorizontal: 16 },
  prevButtonSmallText: { color: "#666", fontSize: 14 },
});