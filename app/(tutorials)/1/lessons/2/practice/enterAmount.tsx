import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, RefreshCcw, HelpCircle, Image as ImageIcon, PlusCircle } from "lucide-react-native";

interface Payment {
  id: number;
  amount: number;
  type: "paid" | "received";
  date: string;
  time: string;
}

interface ChatMessage {
  id: number;
  message: string;
  type: "sent" | "received";
  date: string;
  time: string;
}

type HistoryItem = Payment | ChatMessage;

const paymentHistoryData: Record<string, HistoryItem[]> = {
  "9876543210": [
    { id: 1, amount: 300, type: "paid", date: "September 12, 2025", time: "4:56 PM" },
    { id: 2, amount: 5, type: "paid", date: "September 12, 2025", time: "9:35 AM" },
    { id: 3, amount: 5, type: "paid", date: "September 12, 2025", time: "9:35 AM" },
    { id: 4, amount: 15, type: "paid", date: "October 20, 2025", time: "11:25 AM" },
    { id: 5, amount: 20, type: "received", date: "October 22, 2025", time: "8:14 PM" },
  ],
};

export default function EnterAmount() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const name = Array.isArray(params.name) ? params.name[0] : params.name || "";
  const phone = Array.isArray(params.phone) ? params.phone[0] : params.phone || "";

  const [message, setMessage] = useState("");
  const [transactions, setTransactions] = useState<HistoryItem[]>(paymentHistoryData[phone] || []);
  const [isProcessing, setIsProcessing] = useState(false);

  const buttonScale = useRef(new Animated.Value(0.95)).current;
  const buttonOpacity = useRef(new Animated.Value(0.3)).current;
  const footerHeight = useRef(new Animated.Value(72)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const hasHistory = transactions.length > 0;
  const [currentStep, setCurrentStep] = useState<number>(4)

  useEffect(()=>{
    if(message == "120") setCurrentStep(5);
  }, [message])
  // Check if message is a valid amount
  const isValidAmount = () => {
    const num = parseFloat(message);
    return !isNaN(num) && num > 0 && /^\d+(\.\d{1,2})?$/.test(message);
  };

  const validAmount = isValidAmount();
  const hasMessage = message.trim().length > 0;

  // Animate button and footer when valid amount is entered
  useEffect(() => {
    if (validAmount) {
      Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(footerHeight, {
          toValue: 140,
          friction: 8,
          tension: 40,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (hasMessage) {
      // For text messages, animate button but keep footer normal
      Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(footerHeight, {
          toValue: 72,
          friction: 8,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 0.95,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(footerHeight, {
          toValue: 72,
          friction: 8,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [validAmount, hasMessage]);

  // Handle payment or message send
  const handleSend = () => {
    if ((!hasMessage) || isProcessing) return;

    setIsProcessing(true);

    if (validAmount) {
      // Handle payment - Navigate to enterPin with payment details
      router.push({
        pathname: './enterPin',
        params: {
          amount: message,
          name: name,
          phone: phone,
        }
      });

      // Reset processing state after navigation
      setIsProcessing(false);
    } else {
      // Handle text message
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });

      const newMessage: ChatMessage = {
        id: transactions.length + 1,
        message: message,
        type: "sent",
        date: dateStr,
        time: timeStr,
      };

      setTimeout(() => {
        setTransactions([...transactions, newMessage]);
        setMessage("");
        setIsProcessing(false);

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 300);
    }
  };

  // Group transactions by date
  const groupedHistory: Record<string, HistoryItem[]> = {};
  transactions.forEach((item) => {
    if (!groupedHistory[item.date]) {
      groupedHistory[item.date] = [];
    }
    groupedHistory[item.date].push(item);
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>

            {hasHistory && (
              <View style={styles.headerCenter}>
                <View style={styles.headerAvatar}>
                  <Text style={styles.headerAvatarText}>
                    {name ? name.charAt(0).toUpperCase() : "👤"}
                  </Text>
                </View>
                <View>
                  <Text style={styles.headerName}>{name || "User"}</Text>
                  <Text style={styles.headerPhone}>+{phone}</Text>
                </View>
              </View>
            )}

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity style={styles.iconBtn}>
                <RefreshCcw color="#fff" size={22} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <HelpCircle color="#fff" size={24} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ paddingBottom: 180 }}
            showsVerticalScrollIndicator={false}
          >
            {/* New User Card (only if no history) */}
            {!hasHistory && (
              <View style={styles.newUserContainer}>
                <View style={styles.newUserCard}>
                  <View style={styles.newUserAvatar}>
                    <Text style={styles.newUserAvatarText}>👨🏻‍🦱</Text>
                    <View style={styles.upiMiniLogo}>
                      <Text style={styles.upiMiniText}>UPI</Text>
                    </View>
                  </View>
                  <Text style={styles.newUserName}>
                    {name || "Unknown User"}
                  </Text>
                  <Text style={styles.newUserPhone}>+{phone}</Text>

                  <View style={styles.divider} />

                  <Text style={styles.bankingLabel}>Banking name :</Text>
                  <View style={styles.bankingNameContainer}>
                    <Text style={styles.bankingName}>
                      {name ? name.toUpperCase() : "User"}
                    </Text>
                    <Text style={styles.verifiedCheck}>✓</Text>
                  </View>
                </View>

                <Text style={styles.encryptionText}>
                  Your messages are secured with 256-bit encryption
                </Text>
              </View>
            )}

            {/* Transaction History (existing user) */}
            {hasHistory && (
              <View style={styles.historyContainer}>
                {Object.keys(groupedHistory).map((date) => (
                  <View key={date}>
                    <Text style={styles.dateHeader}>{date}</Text>
                    {groupedHistory[date].map((item, index) => {
                      // Check if it's a payment or chat message
                      const isPayment = 'amount' in item;

                      if (isPayment) {
                        const tx = item as Payment;
                        return (
                          <View key={item.id} style={styles.transactionWrapper}>
                            <View
                              style={[
                                styles.transactionCard,
                                tx.type === "paid" ? styles.txPaid : styles.txReceived,
                              ]}
                            >
                              <View style={styles.transactionContent}>
                                <Text style={styles.txAmount}>₹{tx.amount}</Text>
                                <View style={styles.statusContainer}>
                                  <Text style={styles.statusCheck}>✓</Text>
                                  <Text style={styles.statusText}>
                                    {tx.type === "paid" ? "PAID" : "RECEIVED"}
                                  </Text>
                                </View>
                              </View>
                              <View style={styles.txArrow}>
                                <Text style={styles.arrowIcon}>→</Text>
                              </View>
                              <Text style={styles.txTime}>{tx.time}</Text>
                            </View>

                            {/* Avatar for received or last sent transaction */}
                            {(tx.type === "received" ||
                              (tx.type === "paid" && index === groupedHistory[date].length - 1)) && (
                                <View style={styles.txAvatar}>
                                  <Text style={styles.txAvatarText}>👨</Text>
                                </View>
                              )}
                          </View>
                        );
                      } else {
                        // Chat message
                        const msg = item as ChatMessage;
                        return (
                          <View key={item.id} style={styles.chatMessageWrapper}>
                            <View
                              style={[
                                styles.chatBubble,
                                msg.type === "sent" ? styles.chatSent : styles.chatReceived,
                              ]}
                            >
                              <Text style={styles.chatText}>{msg.message}</Text>
                              <Text style={styles.chatTime}>{msg.time}</Text>
                            </View>
                          </View>
                        );
                      }
                    })}
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Quick Action Buttons */}
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => {
                setMessage("Hi");
                inputRef.current?.focus();
              }}
            >
              <Text style={styles.quickButtonText}>Hi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => {
                setMessage("1");
                inputRef.current?.focus();
              }}
            >
              <Text style={styles.quickButtonText}>Send ₹1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => {
                setMessage("👋");
                inputRef.current?.focus();
              }}
            >
              <Text style={styles.quickButtonText}>👋</Text>
            </TouchableOpacity>
          </View>

          {/* Animated Footer */}
          <Animated.View style={[styles.footer, { height: footerHeight }]}>
            {/* Transfer Info (shows when valid amount) */}
            {validAmount && (
              <View style={styles.transferInfoRow}>
                <Text style={styles.transferLabel}>Transfer Money to</Text>
                <View style={styles.bankingRow}>
                  <Text style={styles.bankingText}>
                    Banking name: {name ? name.toUpperCase() : "User"}
                  </Text>
                  <Text style={styles.verifiedIcon}>✓</Text>
                </View>
              </View>
            )}

            {/* Input Row */}
            <View style={styles.inputRow}>
              {/* Input with Amount Prefix for valid amounts */}
              <View style={styles.inputContainer}>
                {validAmount && (
                  <Text style={styles.rupeePrefix}>₹ </Text>
                )}
                <TextInput
                  ref={inputRef}
                  style={[
                    styles.messageInput,
                    validAmount && styles.messageInputWithPrefix,
                  ]}
                  placeholder="Enter amount or chat"
                  placeholderTextColor="#666"
                  value={message}
                  onChangeText={setMessage}
                  autoFocus={false}
                  blurOnSubmit={false}
                />
              </View>

              {/* Icons and Action Button */}
              {!validAmount ? (
                <>
                  <TouchableOpacity style={styles.footerIcon}>
                    <ImageIcon color="#fff" size={22} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerIcon}>
                    <PlusCircle color="#fff" size={22} />
                  </TouchableOpacity>

                  {/* Send Button */}
                  <Animated.View
                    style={{
                      transform: [{ scale: buttonScale }],
                      opacity: buttonOpacity,
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.sendBtn,
                        hasMessage && styles.sendBtnActive,
                      ]}
                      onPress={handleSend}
                      disabled={!hasMessage || isProcessing}
                    >
                      <Text style={styles.sendIcon}>▶</Text>
                    </TouchableOpacity>
                  </Animated.View>
                </>
              ) : (
                <>
                  {/* UPI Method Selector */}
                  <View style={styles.upiMethodContainer}>
                    <Text style={styles.upiMethodIcon}>💳</Text>
                    <Text style={styles.upiMethod}>0441</Text>
                    <Text style={styles.dropdownIcon}>▼</Text>
                  </View>

                  {/* PAY Button */}
                  <TouchableOpacity
                    style={styles.payButton}
                    onPress={handleSend}
                    disabled={isProcessing}
                  >
                    <Text style={styles.payButtonText}>
                      {isProcessing ? "..." : "PAY"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,
  backgroundColor: "#000" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 48,
    paddingHorizontal: 12,
    paddingBottom: 12,
    alignItems: "center",
    backgroundColor: "#000",
  },
  iconBtn: { padding: 8 },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -80 }],
    top: 48,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerAvatarText: { fontSize: 20 },
  headerName: { fontSize: 16, fontWeight: "600", color: "#fff" },
  headerPhone: { fontSize: 12, color: "#999" },

  // New User Card
  newUserContainer: {
    paddingTop: 20,
  },
  newUserCard: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 40,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  newUserAvatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#d4b106",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  newUserAvatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  upiMiniLogo: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  upiMiniText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000",
  },
  newUserName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  newUserPhone: {
    fontSize: 14,
    color: "#999",
    marginBottom: 20,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#333",
    marginBottom: 16,
  },
  bankingLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  bankingNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bankingName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginRight: 6,
  },
  verifiedCheck: {
    fontSize: 18,
    color: "#4caf50",
  },
  encryptionText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginHorizontal: 40,
    marginTop: 20,
  },

  // Transaction History
  historyContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  dateHeader: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginVertical: 16,
  },
  transactionWrapper: {
    marginBottom: 12,
    position: "relative",
  },
  transactionCard: {
    borderRadius: 16,
    padding: 8,
    position: "relative",
  },
  txPaid: {
    backgroundColor: "#5f27cd",
    marginLeft: 80,

  },
  txReceived: {
    backgroundColor: "#2a2a2a",
    marginRight: 80,
  },
  transactionContent: {
    marginBottom: 4,
  },
  txAmount: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusCheck: {
    fontSize: 16,
    color: "#4caf50",
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: "#fff",
    letterSpacing: 0.5,
  },
  txArrow: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -15 }],
  },
  arrowIcon: {
    fontSize: 30,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.3)",
  },
  txTime: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.8,
    position: "absolute",
    right: 20,
    bottom: 16,
  },
  txAvatar: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
  },
  txAvatarText: {
    fontSize: 20,
  },

  // Chat Messages
  chatMessageWrapper: {
    marginBottom: 12,
  },
  chatBubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  chatSent: {
    backgroundColor: "#2a2a2a",
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  chatReceived: {
    backgroundColor: "#1a4d2e",
    alignSelf: "flex-start",
  },
  chatText: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 4,
  },
  chatTime: {
    color: "#999",
    fontSize: 11,
    alignSelf: "flex-end",
  },

  // Quick Actions
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#000",
  },
  quickButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  quickButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  // Animated Footer
  footer: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },

  // Transfer Info (appears above input)
  transferInfoRow: {
    marginBottom: 8,
  },
  transferLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  bankingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bankingText: {
    fontSize: 13,
    color: "#fff",
    marginRight: 4,
  },
  verifiedIcon: {
    fontSize: 14,
    color: "#4caf50",
  },

  // Input Row
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Input Container with Prefix
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 24,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  rupeePrefix: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 4,
  },
  messageInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 10,
  },
  messageInputWithPrefix: {
    fontSize: 24,
    fontWeight: "bold",
  },

  // Footer Icons
  footerIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },

  // Send Button (default state)
  sendBtn: {
    backgroundColor: "#333",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnActive: {
    backgroundColor: "#4caf50",
  },
  sendIcon: {
    color: "#fff",
    fontSize: 14,
  },

  // UPI Method Selector
  upiMethodContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  upiMethodIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  upiMethod: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  dropdownIcon: {
    color: "#999",
    fontSize: 10,
  },

  // PAY Button
  payButton: {
    backgroundColor: "#4caf50",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});