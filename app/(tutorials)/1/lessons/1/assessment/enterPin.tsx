import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronDownIcon, ChevronUpIcon, CircleCheck, Delete, Dot, Minus } from "lucide-react-native";
import React, { useState } from "react";
// FIX: Using core React Native components
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface PaymentData {
  amount: string;
  recipientName: string;
  senderBankName: string;
  senderAccountLast4: string;
}

// 2. Interface for KeypadButton component props
interface KeypadButtonProps {
  value: string;
  onPress: (value: string) => void;
  isAction: boolean;
  isCheckButton: boolean;
}

// 3. Interface for Keypad component props
interface KeypadProps {
  onKeyPress: (key: string) => void;
  pin: string;
}

// 4. Interface for Icon placeholders
interface IconProps {
  size: number;
  color: string;
  style?: object;
}

const CORRECT_PIN: string = "0000"; // Sample correct PIN
const PIN_LENGTH: number = 4;
const { width } = Dimensions.get("window");

// --- Component for Keypad Button ---
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
    disabled={isAction && !isCheckButton && !value} // Disable empty action spots
  >
    {value === "backspace" ? (
      // Use CrossIcon placeholder
      <Delete size={32} color="#000" />
    ) : value === "check" ? (
      // Use CheckIcon placeholder
      <CircleCheck size={32} color="#000000ff" />
    ) : (
      <Text style={styles.keypadText}>{value}</Text>
    )}
  </TouchableOpacity>
);

// --- Component for Keypad Grid ---
const Keypad: React.FC<KeypadProps> = ({ onKeyPress }) => {
  const keys: string[] = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "backspace",
    "0",
    "check",
  ];

  return (
    <View style={styles.keypadContainer}>
      {keys.map((key) => {
        const isAction: boolean = ["backspace", "check"].includes(key);
        const isCheckButton: boolean = key === "check";
        const isBackspace: boolean = key === "backspace";

        const handlePress = (): void => {
          if (isBackspace) {
            onKeyPress("DEL");
          } else if (isCheckButton) {
            onKeyPress("CHECK");
          } else {
            onKeyPress(key);
          }
        };

        if (key === "backspace") {
          // Backspace button (using X icon)
          return (
            <KeypadButton
              key={key}
              value="backspace"
              onPress={handlePress}
              isAction={true}
              isCheckButton={false}
            />
          );
        }

        if (key === "check") {
          // Check button (using Check icon)
          return (
            <KeypadButton
              key={key}
              value="check"
              onPress={handlePress}
              isAction={true}
              isCheckButton={true}
            />
          );
        }

        return (
          <KeypadButton
            key={key}
            value={key}
            onPress={handlePress}
            isAction={false}
            isCheckButton={false}
          />
        );
      })}
    </View>
  );
};

// --- Main Screen Component ---
export default function PaymentPinScreen() {
    const router = useRouter();
  const { data } = useLocalSearchParams();
  const parsed = data ? JSON.parse(data as string) : {};
  const refId = "ABC123a1b2abc123a1234a500c4SJ78Bajbae30e01bcfdxa"
  const refUrl = "https://phonepe.com"
  const amount = parsed.amount
  const recipientName = parsed.recipientName

  // State definitions
  const [pin, setPin] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [pinError, setPinError] = useState<boolean>(false);

  const handleKeyPress = (key: string): void => {
    setPinError(false);

    if (key === "DEL") {
      setPin((p) => p.slice(0, -1));
    } else if (key === "CHECK") {
      if (pin.length === PIN_LENGTH) {
        if (pin === CORRECT_PIN) {
          router.push({
            pathname : "./paymentSuccess",
            params :{ amount, refId, recipientName}
          }
          );
        } else {
          setPinError(true);
          setPin("");
          Alert.alert("Incorrect PIN", "Please try again.", [{ text: "OK" }]);
        }
      } else {
        Alert.alert("Incomplete PIN", "Please enter all 4 digits.", [
          { text: "OK" },
        ]);
      }
    } else if (pin.length < PIN_LENGTH) {
      setPin((p) => p + key);
    }
  };

  // Render the PIN input display (dashes/dots)
  const renderPinInput = () => {
    const pinArray = Array.from({ length: PIN_LENGTH }, (_, i: number) => {
      const isEntered: boolean = i < pin.length;
      const content = isEntered ? (<Dot size={56}/>) : (<Minus size={56}/>); // Dot for entered, dash for empty

      return (
        <Text
          key={i}
          style={[
            styles.pinDigit,
            pinError && styles.pinError,
            { color: isEntered ? "#000" : "#888" },
          ]}
        >
          {content}
        </Text>
      );
    });

    return <View style={styles.pinInputContainer}>{pinArray}</View>;
  };

  // --- Modal Content (Transaction Details) ---
  const TransactionDetailsModal = () => (
    <Modal
      // Modal appears from top instantly with a fade
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity style={styles.modalOverlay} onPress={()=>setModalVisible(false)}>
        <View style={styles.modalContent}>
          {/* Header bar mimicking the top of the second image */}
          <View style={styles.modalHeader}>
            <View style={styles.bankAndUpiContainer}>
              <View>
                <Text style={styles.modalBankName}>{parsed.senderBankName}</Text>
                <Text style={styles.modalAccountNum}>
                  XXXX{parsed.senderAccountLast4}
                </Text>
              </View>
              {/* UPI Logo Placeholder */}
              <Image source={require("@/assets/images/phonepeTutorial/upi_logo.png")} style={styles.upiLogoPlaceholder}/>
            </View>
            <View style={styles.modalSeparator} />

            {/* Sending/To Section */}
            <View style={styles.modalRowContainer}>
              <View>
                <Text style={styles.modalLabel}>To:</Text>
                <Text style={styles.modalLabel}>Sending:</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.modalRecipientText}>{parsed.recipientName}</Text>
                <View style={styles.modalAmountContainer}>
                  <Text style={styles.modalAmountText}>₹ {parsed.amount}</Text>
                  {/* Collapse button (inside modal) uses ChevronUpIcon placeholder */}
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <ChevronUpIcon
                      size={24}
                      color="#000"
                      style={{ marginLeft: 5 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Transaction Details Body */}
          <View style={styles.modalBody}>
            <View style={styles.modalDetailRow}>
              <Text style={styles.modalDetailLabel}>PAYING TO</Text>
              <Text style={styles.modalDetailValue}>{parsed.recipientName}</Text>
            </View>
            <View style={styles.modalDetailRow}>
              <Text style={styles.modalDetailLabel}>AMOUNT</Text>
              <Text style={styles.modalDetailValue}>₹ {parsed.amount}</Text>
            </View>
            <View style={styles.modalDetailRow}>
              <Text style={styles.modalDetailLabel}>ACCOUNT</Text>
              <Text style={styles.modalDetailValue}>
                XXXXXXXXXX{parsed.senderAccountLast4}
              </Text>
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* --- Header Section (Top bar) --- */}
        <View style={styles.header}>
          <View style={styles.bankAndUpiContainer}>
            <View>
              <Text style={styles.bankName}>{parsed.senderBankName}</Text>
              <Text style={styles.accountNum}>XXXX{parsed.senderAccountLast4}</Text>
            </View>
            {/* UPI Logo Placeholder */}
                          <Image source={require("@/assets/images/phonepeTutorial/upi_logo.png")} style={styles.upiLogoPlaceholder}/>

          </View>
          <View style={styles.separator} />

          <View style={styles.recipientAndAmountContainer}>
            <View>
              <Text style={styles.recipientLabel}>To:</Text>
              <Text style={styles.recipientLabel}>Sending:</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.recipientNameText}>
                {parsed.recipientName.length > 20
                  ? parsed.recipientName.substring(0, 20) + "..."
                  : parsed.recipientName}
              </Text>
              {/* Dropdown next to amount */}
              <View style={styles.amountContainer}>
                <Text style={styles.amountText}>₹ {parsed.amount}</Text>
                {/* Dropdown button uses ChevronDownIcon placeholder */}
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

        {/* --- PIN Entry Section --- */}
        <View style={styles.pinEntrySection}>
          <Text style={styles.pinEntryText}>
            ENTER {PIN_LENGTH}-DIGIT UPI PIN
          </Text>
          {renderPinInput()}
        </View>

        {/* --- Warning Banner --- */}
        <View style={styles.warningBanner}>
            <View style={styles.warningIcon}>

          <Text style={{color: "#fff", fontSize: 18, fontWeight: "bold"}}>!</Text>
            </View>
          <Text style={styles.warningText}>
            You are transferring money from your{" "}
            <Text style={{ fontWeight: "bold" }}>{parsed.senderBankName}</Text> account
            to <Text style={{ fontWeight: "bold" }}>{parsed.recipientName}</Text>
          </Text>
        </View>

        <View style={styles.spacer} />

        {/* --- Keypad --- */}
        <Keypad onKeyPress={handleKeyPress} pin={pin} />
      </View>

      {/* --- Modal for Detailed Transaction View --- */}
      <TransactionDetailsModal />
    </SafeAreaView>
  );
}

// --- Stylesheet ---
// Since this is a React Native environment, StyleSheet.create is used as intended.
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 0,
  },
  // --- Header Styles ---
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  bankAndUpiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
  },
  bankName: {
    fontSize: 14,
    color: "#000",
  },
  accountNum: {
    fontSize: 12,
    color: "#888",
  },
  upiLogoPlaceholder: {
    width: 50,
    height: 18,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    objectFit: "contain"
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  recipientAndAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
  recipientLabel: {
    fontSize: 14,
    color: "#888",
    lineHeight: 20,
  },
  recipientNameText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    maxWidth: 200, // Constrain width for long names
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  dropdownButton: {
    paddingLeft: 4,
  },

  // --- PIN Entry Styles ---
  pinEntrySection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  pinEntryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 20,
  },
  pinInputContainer: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "space-between",
  },
  pinDigit: {
    fontSize: 40,
    fontWeight: "bold",
    width: "18%", // Spacing
    textAlign: "center",
  },
  pinError: {
    color: "red",
    // Optional: Add an animation style here if a library like Reanimated was used
  },

  // --- Warning Banner Styles ---
  warningBanner: {
    flexDirection: "row",
    backgroundColor: "#feda9fff", // Light yellow/orange tone
    padding: 15,
    marginHorizontal: 32,
    borderRadius: 16,
    alignItems: "flex-start",
  },
  warningIcon: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff", // Darker orange for the icon
    marginRight: 8,
    width: 28,
    height: 28,
    backgroundColor:"#d4740eff",
    borderRadius: "100%",
    alignItems: "center"
  },
  warningText: {
    fontSize: 12,
    color: "#333",
    flex: 1, // Take remaining space
  },

  spacer: {
    flex: 1, // Push keypad to the bottom
  },

  // --- Keypad Styles ---
  keypadContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: width, // Full width
    paddingBottom: 20,
    backgroundColor: "#eef0f5ff"
  },
  keypadButton: {
    width: width / 3, // Three buttons per row
    height: width / 5, // Make buttons relatively large
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    // Backspace button (X) is similar to a number button
  },
  checkButton: {
    margin: 10,
    width: width / 3 - 20,
    height: width / 5 - 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  keypadText: {
    fontSize: 28,
    fontWeight: "400",
    color: "#000",
  },

  // --- Modal Styles (Second Image) ---
  modalOverlay:{
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent overlay
    justifyContent: "flex-start", // Modal content starts from top
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: "65%",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  modalHeader: {
    paddingBottom: 10,
  },
  modalBankName: {
    fontSize: 14,
    color: "#000",
  },
  modalAccountNum: {
    fontSize: 12,
    color: "#888",
  },
  upiLogoPlaceholderModal: {
    width: 40,
    height: 18,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  modalSeparator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  modalRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    color: "#888",
    lineHeight: 20,
  },
  modalRecipientText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  modalAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalAmountText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  modalBody: {
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  modalDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  modalDetailLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
    width: "20%",
  },
  modalDetailValue: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
    width: "80%",
    textAlign: "right",
  },
});
