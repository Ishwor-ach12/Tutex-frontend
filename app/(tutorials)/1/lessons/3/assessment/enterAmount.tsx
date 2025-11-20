import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  HelpCircle,
  Image as ImageIcon,
  PlusCircle,
  RefreshCw,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function EnterAmount() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // ----- RECEIVER DETAILS -----
  const bankName = params.bankName || "Bank";
  const bankIcon = params.bankIcon || "🏦";
  const bankColor = params.bankColor || "#F5F5F7";

  const accountNumber = params.accountNumber || "";
  const ifsc = params.ifsc || "";
  const accountHolderName = params.accountHolderName || "Receiver";
  const nickname = params.nickname || "";

  const last4 = accountNumber ? accountNumber.slice(-4) : "0000";
  const name = accountHolderName || "Receiver";

  // ----- STATES -----
  const [amount, setAmount] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // ----- ANIMATIONS -----
  const buttonScale = useRef(new Animated.Value(0.95)).current;
  const buttonOpacity = useRef(new Animated.Value(0.3)).current;
  const footerHeight = useRef(new Animated.Value(72)).current;

  // bubble fade animation
  const bubbleOpacity = useRef(new Animated.Value(0)).current;
  const bubbleTranslate = useRef(new Animated.Value(10)).current;

  const inputRef = useRef<TextInput>(null);

  const isValidAmount = () => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && /^\d+(\.\d{1,2})?$/.test(amount);
  };

  const validAmount = isValidAmount();
  const hasMessage = amount.trim().length > 0;

  // ----- KEYBOARD LISTENERS -----
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates?.height || 0);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // ----- BUBBLE ANIMATION -----
  useEffect(() => {
    if (!amount) {
      Animated.parallel([
        Animated.timing(bubbleOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bubbleTranslate, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(bubbleOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleTranslate, {
          toValue: -5,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [amount]);

  // ----- FOOTER ANIMATION -----
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

  // ----- PAY HANDLER -----
  const handlePay = () => {
    if (!validAmount) return;

    router.push({
      pathname: "./enterPin",
      params: {
        amount,
        name,
        nickname,
        bankName,
        bankIcon,
        bankColor,
        accountNumber,
        ifsc,
        last4,
      },
    });
  };

  const handleAmountChange = (text) => {
    const filtered = text.replace(/[^0-9.]/g, "");
    const parts = filtered.split(".");
    if (parts.length > 2) return;
    setAmount(filtered);
  };

  const getInitials = (fullName) => {
    const parts = fullName.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return fullName[0]?.toUpperCase() || "A";
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.container}>
        
        {/* HEADER */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
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
            <TouchableOpacity style={styles.iconBtn}>
              <RefreshCw size={20} color="#222" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <HelpCircle size={20} color="#222" />
            </TouchableOpacity>
          </View>
        </View>

       

        {/* FOOTER */}
        <Animated.View
          style={[styles.footer, { height: footerHeight, bottom: keyboardHeight }]}
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
            <View style={styles.inputContainer}>
              {validAmount && <Text style={styles.rupeePrefix}>₹</Text>}

              <TextInput
                ref={inputRef}
                style={[styles.input, validAmount && styles.bigInput]}
                placeholder="Enter amount or chat"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={amount}
                onChangeText={handleAmountChange}
              />
            </View>

            {!validAmount ? (
              <>
                <TouchableOpacity style={styles.footerIcon}>
                  <ImageIcon color="#000" size={22} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.footerIcon}>
                  <PlusCircle color="#000" size={22} />
                </TouchableOpacity>

                <Animated.View style={{ transform: [{ scale: buttonScale }], opacity: buttonOpacity }}>
                  <TouchableOpacity
                    style={[styles.sendBtn, hasMessage && styles.sendBtnActive]}
                    disabled={!hasMessage}
                  >
                    <Text style={styles.sendIcon}>▶</Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            ) : (
              <>
                <View style={styles.upiMethodContainer}>
                  <Text style={styles.upiMethodIcon}>💳</Text>
                  <Text style={styles.upiMethod}>{last4}</Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </View>

                <TouchableOpacity style={styles.payButton} onPress={handlePay}>
                  <Text style={styles.payButtonText}>PAY</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eaeaea",
  },

  iconBtn: { padding: 8 },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 6 },

  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2e276d",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  nameText: { fontSize: 16, fontWeight: "700", color: "#111" },
  subText: { fontSize: 13, color: "#666", marginTop: 2 },

  headerRight: { flexDirection: "row", alignItems: "center" },

  /* FIXED PERFECT POSITION  */
  content: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingLeft: 18,
    paddingTop: 30,
  },

  /* PHONEPE LOOK */
  sendBubble: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1.3,
    borderStyle: "dashed",
    borderColor: "#d5d5d5",
    backgroundColor: "#ffffff",
  },
  sendBubbleText: { color: "#444", fontSize: 14, fontWeight: "500" },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  transferInfoRow: { marginBottom: 8 },
  transferLabel: { fontSize: 12, color: "#666" },
  bankingRow: { flexDirection: "row", alignItems: "center" },
  bankingText: { color: "#333", fontSize: 14 },
  verifiedIcon: { color: "#1e8e3e", fontSize: 16, marginLeft: 4 },

  inputRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },

  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  rupeePrefix: { fontSize: 24, fontWeight: "bold", color: "#000", marginRight: 6 },

  input: { flex: 1, fontSize: 16, color: "#000", paddingVertical: 10 },
  bigInput: { fontSize: 24, fontWeight: "700" },

  footerIcon: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },

  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnActive: { backgroundColor: "#1e8e3e" },
  sendIcon: { color: "#fff", fontWeight: "700" },

  upiMethodContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  upiMethodIcon: { fontSize: 16 },
  upiMethod: { marginHorizontal: 4, fontSize: 14, fontWeight: "700", color: "#333" },
  dropdownIcon: { fontSize: 10, color: "#666" },

  payButton: {
    backgroundColor: "#1e8e3e",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
  },
  payButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
