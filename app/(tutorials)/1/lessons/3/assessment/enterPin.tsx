import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronDownIcon, ChevronUpIcon, CircleCheck, Delete, Dot, Minus } from "lucide-react-native";
import React, { useState, useRef } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Animated,
} from "react-native";

interface KeypadButtonProps {
  value: string;
  onPress: (value: string) => void;
  isAction: boolean;
  isCheckButton: boolean;
}

interface KeypadProps {
  onKeyPress: (key: string) => void;
  pin: string;
}

const CORRECT_PIN: string = "0000";
const PIN_LENGTH: number = 4;
const { width } = Dimensions.get("window");

// ---------------------------
// Keypad Button Component
// ---------------------------
const KeypadButton: React.FC<KeypadButtonProps> = ({
  value,
  onPress,
  isAction,
  isCheckButton,
}) => (
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
      <CircleCheck size={32} color="#000000ff" />
    ) : (
      <Text style={styles.keypadText}>{value}</Text>
    )}
  </TouchableOpacity>
);

// ---------------------------
// Keypad Layout Component
// ---------------------------
const Keypad: React.FC<KeypadProps> = ({ onKeyPress }) => {
  const keys: string[] = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "backspace", "0", "check",
  ];

  return (
    <View style={styles.keypadContainer}>
      {keys.map((key) => {
        const isAction = ["backspace", "check"].includes(key);
        const isCheckButton = key === "check";
        const isBackspace = key === "backspace";

        const press = () => {
          if (isBackspace) onKeyPress("DEL");
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
          />
        );
      })}
    </View>
  );
};

// ====================================================================
// MAIN SCREEN
// ====================================================================
export default function PaymentPinScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // 🔥 RECEIVED PARAMS FROM EnterAmount
  const amount = Array.isArray(params.amount) ? params.amount[0] : params.amount || "0";

  const recipientName = Array.isArray(params.name) ? params.name[0] : params.name || "Receiver";
  const nickname = Array.isArray(params.nickname) ? params.nickname[0] : params.nickname || "";

  const bankName = Array.isArray(params.bankName) ? params.bankName[0] : params.bankName || "Bank";
  const bankIcon = Array.isArray(params.bankIcon) ? params.bankIcon[0] : params.bankIcon || "🏦";
  const bankColor = Array.isArray(params.bankColor) ? params.bankColor[0] : params.bankColor || "#F5F5F5";

  const accountNumber = Array.isArray(params.accountNumber)
    ? params.accountNumber[0]
    : params.accountNumber || "";

  const last4 = Array.isArray(params.last4)
    ? params.last4[0]
    : params.last4 || accountNumber.slice(-4);

  const ifsc = Array.isArray(params.ifsc) ? params.ifsc[0] : params.ifsc || "";


  // Reference ID for final success page
  const refId = "ABC123a1b2abc123a1234a500c4SJ78Bajbae30e01bcfdxa";
  const refUrl = "https://phonepe.com";

  const [pin, setPin] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [pinError, setPinError] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Animation Values
  const checkScale = useRef(new Animated.Value(1)).current;
  const fadeOverlay = useRef(new Animated.Value(0)).current;
  const loaderSpin = useRef(new Animated.Value(0)).current;
  const sendingOpacity = useRef(new Animated.Value(0)).current;

  // ---------------------------
  // PhonePe Animation
  // ---------------------------
  const playSuccessAnimation = (callback: () => void) => {
    setIsProcessing(true);

    Animated.timing(fadeOverlay, {
      toValue: 0.35,
      duration: 250,
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.timing(checkScale, { toValue: 1.3, duration: 180, useNativeDriver: true }),
      Animated.timing(checkScale, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.timing(loaderSpin, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      })
    ).start();

    Animated.timing(sendingOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => callback(), 900);
  };

  // ---------------------------
  // Keypad Press Handler
  // ---------------------------
  const handleKeyPress = (key: string): void => {
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
        playSuccessAnimation(() => {
          router.push({
            pathname: "./paymentSuccess",
            params: {
              amount,
              recipientName,
              nickname,
              bankName,
              bankIcon,
              bankColor,
              accountNumber,
              last4,
              ifsc,
              refId,
              refUrl,
            },
          });
        });
      } else {
        setPin("");
        setPinError(true);
        Alert.alert("Incorrect PIN", "Please try again.");
      }
      return;
    }

    if (pin.length < PIN_LENGTH) {
      setPin((p) => p + key);
    }
  };

  // ---------------------------
  // PIN Dots Rendering
  // ---------------------------
  const renderPinInput = () => (
    <View style={styles.pinInputContainer}>
      {Array.from({ length: PIN_LENGTH }).map((_, i) => {
        const isEntered = i < pin.length;
        return (
          <View key={i} style={styles.pinDigitWrapper}>
            {isEntered ? <Dot size={56} /> : <Minus size={56} />}
          </View>
        );
      })}
    </View>
  );

  // ---------------------------
  // Modal Component 
  // ---------------------------
  const TransactionDetailsModal = () => (
    <Modal
      transparent
      animationType="none"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>

          <View style={styles.modalHeader}>
            <View style={styles.bankAndUpiContainer}>
              <View>
                <Text style={styles.modalBankName}>{bankName}</Text>
                <Text style={styles.modalAccountNum}>XXXX{last4}</Text>
              </View>

              <Image
                source={require("@/assets/images/phonepeTutorial/upi_logo.png")}
                style={styles.upiLogoPlaceholder}
              />
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
            <View style={styles.modalDetailRow}>
              <Text style={styles.modalDetailLabel}>PAYING TO</Text>
              <Text style={styles.modalDetailValue}>{recipientName}</Text>
            </View>

            <View style={styles.modalDetailRow}>
              <Text style={styles.modalDetailLabel}>ACCOUNT</Text>
              <Text style={styles.modalDetailValue}>XXXX{last4}</Text>
            </View>

            <View style={styles.modalDetailRow}>
              <Text style={styles.modalDetailLabel}>IFSC</Text>
              <Text style={styles.modalDetailValue}>{ifsc}</Text>
            </View>

            <View style={styles.modalDetailRow}>
              <Text style={styles.modalDetailLabel}>AMOUNT</Text>
              <Text style={styles.modalDetailValue}>₹ {amount}</Text>
            </View>

            <View style={styles.modalDetailRow}>
              <Text style={styles.modalDetailLabel}>REF ID</Text>
              <Text style={styles.modalDetailValue}>{refId}</Text>
            </View>

            <View style={styles.modalDetailRow}>
              <Text style={styles.modalDetailLabel}>REF URL</Text>
              <Text style={styles.modalDetailValue}>{refUrl}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // ---------------------------
  // Main Render
  // ---------------------------
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.bankAndUpiContainer}>
            <View>
              <Text style={styles.bankName}>{bankName}</Text>
              <Text style={styles.accountNum}>XXXX{last4}</Text>
            </View>

            <Image
              source={require("@/assets/images/phonepeTutorial/upi_logo.png")}
              style={styles.upiLogoPlaceholder}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.recipientAndAmountContainer}>
            <View>
              <Text style={styles.recipientLabel}>To:</Text>
              <Text style={styles.recipientLabel}>Sending:</Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.recipientNameText}>
                {recipientName.length > 20
                  ? recipientName.substring(0, 20) + "..."
                  : recipientName}
              </Text>

              <View style={styles.amountContainer}>
                <Text style={styles.amountText}>₹ {amount}</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={styles.dropdownButton}
                >
                  <ChevronDownIcon size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.pinEntrySection}>
          <Text style={styles.pinEntryText}>ENTER {PIN_LENGTH}-DIGIT UPI PIN</Text>
          {renderPinInput()}
        </View>

        <View style={styles.warningBanner}>
          <View style={styles.warningIcon}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>!</Text>
          </View>

          <Text style={styles.warningText}>
            You are transferring money from{" "}
            <Text style={{ fontWeight: "bold" }}>{bankName}</Text> to{" "}
            <Text style={{ fontWeight: "bold" }}>{recipientName}</Text>
          </Text>
        </View>

        <View style={styles.spacer} />

        <Keypad onKeyPress={handleKeyPress} pin={pin} />
      </View>

      <TransactionDetailsModal />

      {isProcessing && (
        <Animated.View style={[styles.processingOverlay, { opacity: fadeOverlay }]}>
          <Animated.View
            style={[
              styles.loader,
              {
                transform: [
                  {
                    rotate: loaderSpin.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          />

          <Animated.Text style={[styles.sendingText, { opacity: sendingOpacity }]}>
            Sending…
          </Animated.Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

// ====================================================================
// STYLES 
// ====================================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1, backgroundColor: "#fff" },

  header: { paddingHorizontal: 16, paddingTop: 16, backgroundColor: "#fff" },

  bankAndUpiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bankName: { fontSize: 14, color: "#000" },
  accountNum: { fontSize: 12, color: "#888" },

  upiLogoPlaceholder: {
    width: 50,
    height: 18,
    resizeMode: "contain",
  },

  separator: { height: 1, backgroundColor: "#eee", marginVertical: 10 },

  recipientAndAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },

  recipientLabel: { fontSize: 14, color: "#888", lineHeight: 20 },

  recipientNameText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    maxWidth: 200,
    textAlign: "right",
  },

  amountContainer: { flexDirection: "row", alignItems: "center" },
  amountText: { fontSize: 18, fontWeight: "600", color: "#000" },
  dropdownButton: { paddingLeft: 6 },

  pinEntrySection: { alignItems: "center", paddingVertical: 30 },
  pinEntryText: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 20 },

  pinInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "55%",
  },

  pinDigitWrapper: { width: "22%", alignItems: "center" },

  warningBanner: {
    flexDirection: "row",
    backgroundColor: "#feda9fff",
    padding: 15,
    marginHorizontal: 32,
    borderRadius: 16,
  },

  warningIcon: {
    width: 28,
    height: 28,
    borderRadius: 50,
    backgroundColor: "#d4740e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  warningText: { fontSize: 12, color: "#333", flex: 1 },

  spacer: { flex: 1 },

  keypadContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width,
    paddingBottom: 20,
    backgroundColor: "#eef0f5",
  },

  keypadButton: {
    width: width / 3,
    height: width / 5,
    justifyContent: "center",
    alignItems: "center",
  },

  checkButton: {
    margin: 10,
    width: width / 3 - 20,
    height: width / 5 - 20,
    justifyContent: "center",
    alignItems: "center",
  },

  keypadText: { fontSize: 28, color: "#000" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-start",
  },

  modalContent: {
    width: "100%",
    height: "65%",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  modalHeader: { paddingBottom: 10 },
  modalSeparator: { height: 1, backgroundColor: "#eee", marginVertical: 10 },

  modalRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },

  modalLabel: { fontSize: 14, color: "#888", lineHeight: 20 },
  modalRecipientText: { fontSize: 14, fontWeight: "500", color: "#000" },

  modalAmountContainer: { flexDirection: "row", alignItems: "center" },
  modalAmountText: { fontSize: 18, fontWeight: "600", color: "#000" },

  modalBody: { paddingTop: 10, paddingHorizontal: 5 },

  modalDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  modalDetailLabel: { fontSize: 12, color: "#888", width: "20%" },
  modalDetailValue: { fontSize: 12, color: "#000", textAlign: "right", width: "80%" },

  processingOverlay: {
    position: "absolute",
    left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  loader: {
    width: 60,
    height: 60,
    borderWidth: 6,
    borderColor: "#6ccf7a",
    borderTopColor: "transparent",
    borderRadius: 30,
    marginBottom: 16,
  },

  sendingText: { fontSize: 16, color: "#fff", fontWeight: "600" },
});
