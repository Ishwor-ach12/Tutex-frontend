import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  HelpCircle,
  Image as ImageIcon,
  PlusCircle,
  RefreshCcw,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

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
    {
      id: 1,
      amount: 300,
      type: "paid",
      date: "September 12, 2025",
      time: "4:56 PM",
    },
    {
      id: 2,
      amount: 5,
      type: "paid",
      date: "September 12, 2025",
      time: "9:35 AM",
    },
    {
      id: 3,
      amount: 15,
      type: "paid",
      date: "October 20, 2025",
      time: "11:25 AM",
    },
    {
      id: 4,
      amount: 20,
      type: "received",
      date: "October 22, 2025",
      time: "8:14 PM",
    },
  ],
};

const { width, height } = Dimensions.get("window");

const WALKTHROUGH_STEPS = [
  {
    id: 1,
    title: "Verify Recipient",
    description:
      "Before sending money, always confirm that you're on the correct chat. Check the name and mobile number shown in the header to ensure you're paying the right person.",
    top: "20%",
    requiresAction: false,
  },
  {
    id: 2,
    title: "Payments You Sent",
    description:
      "These purple cards represent the payments you have sent to this person. Each card shows the amount, status, and time of the payment.",
    top: "45%",
    requiresAction: false,
  },
  {
    id: 3,
    title: "Payments You Received",
    description:
      "Black cards represent money you have received from this person. This helps you track your overall transaction history clearly.",
    top: "28%",
    requiresAction: false,
  },
  {
    id: 4,
    title: "Enter Amount",
    description:
      "Use this text box at the bottom to type any amount or send a message. When you enter a valid amount, the Pay button will appear.",
    top: "28%",
    requiresAction: false,
  },
  {
    id: 5,
    title: "Enter ₹120",
    description:
      "Type the amount 120 in the input box to proceed with the walkthrough.",
    top: "28%",
    requiresAction: true,
    actionText: "Enter amount 120 to continue",
  },
  {
    id: 6,
    title: "Complete Payment",
    description:
      "Tap the Pay button to continue to the final payment confirmation screen.",
    top: "28%",
    requiresAction: true,
    actionText: "Press the Pay button to continue",
  },
];

export default function EnterAmount() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const name = Array.isArray(params.name) ? params.name[0] : params.name || "";
  const phone = Array.isArray(params.phone)
    ? params.phone[0]
    : params.phone || "";

  const [message, setMessage] = useState("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [transactions, setTransactions] = useState<HistoryItem[]>(
    paymentHistoryData[phone] || []
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const buttonScale = useRef(new Animated.Value(0.95)).current;
  const buttonOpacity = useRef(new Animated.Value(0.3)).current;
  const footerHeight = useRef(new Animated.Value(72)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const inputContainerRef = useRef(null);
  const paidAmountRef = useRef(null);
  const recAmountRef = useRef(null);
  const payButtonRef = useRef(null);
  const headerRef = useRef(null);

  const [highlightBox, setHighlightBox] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
  });

  useEffect(() => {
    const measureElement = (ref) => {
      setTimeout(() => {
        if (ref.current != null) {
          ref.current.measureInWindow((x, y, w, h) => {
            setHighlightBox({
              x,
              y,
              width: w,
              height: h,
              visible: true,
            });
          });
        }
      }, 50);
    };

    if (currentStep === 0) {
      measureElement(headerRef);
    } else if (currentStep === 1) {
      measureElement(paidAmountRef);
    } else if (currentStep === 2) {
      measureElement(recAmountRef);
    } else if (currentStep === 3 || currentStep === 4) {
      measureElement(inputContainerRef);
    } else if (currentStep === 5) {
      setTimeout(() => {
        if (payButtonRef.current != null) {
          payButtonRef.current.measureInWindow((x, y, w, h) => {
            setHighlightBox({
              x,
              y,
              width: w,
              height: h,
              visible: true,
            });
          });
        }
      }, 50);
    } else {
      setHighlightBox((prev) => ({ ...prev, visible: false }));
    }
  }, [currentStep, validAmount]);

  // Auto-advance when user enters 120 in step 4
  useEffect(() => {
    if (currentStep === 4 && message === "120") {
      setTimeout(() => {
        setCurrentStep(5);
      }, 100);
    }
  }, [message, currentStep]);

  const hasHistory = transactions.length > 0;

  // Check if message is a valid amount
  const isValidAmount = () => {
    return message === "120";
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

  const handleNextStep = () => {
    if (currentStep < WALKTHROUGH_STEPS.length) {
      // For step 4 (Enter Amount), check if user entered 120
      if (currentStep === 4) {
        if (message === "120") {
          setCurrentStep(currentStep + 1);
        }
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle payment or message send
  const handleSend = () => {
    if (!hasMessage || isProcessing) return;

    // Check if in walkthrough step 5 and need to advance
    // if (currentStep === 5 && validAmount) {
    //   setCurrentStep(currentStep + 1);
    //   return;
    // }

    setIsProcessing(true);

    if (validAmount) {
      // Handle payment - Navigate to enterPin with payment details
      // router.push({
      //   pathname: "./enterPin",
      //   params: {
      //     amount: parseInt(message),
      //     recipientName: name,
      //     senderBankName: "Sender's Bank Name",
      //     senderAccountLast4: phone.slice(-4), // ✅ correct JS slicing
      //   },
      // });

      router.push({
      pathname: "./enterPin",
      params: {
        data: JSON.stringify({
          amount: parseInt(message),
          recipientName: name,
          senderBankName: "Sender's Bank Name",
          senderAccountLast4: phone.slice(-4),
        }),
      },
    });

      // Reset processing state after navigation
      setIsProcessing(false);
    } else {
      // Handle text message
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
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
          <View
            style={{
              position: "absolute",
              width: width,
              height: height + 100,
              backgroundColor: "#0000008f",
              zIndex: 1000,
            }}
          />

          {/* Highlighted Elements */}
          {currentStep === 0 && highlightBox.visible && (
            <View
              style={[
                styles.headerCenter,
                {
                  position: "absolute",
                  left: "48%",
                  top: highlightBox.y,
                  width: highlightBox.width,
                  height: highlightBox.height,
                  zIndex: 9999,
                  elevation: 100,
                  backgroundColor: "#fff",
                  paddingRight: 16,
                  borderRadius: 5,
                  marginTop: 33,
                },
              ]}
            >
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

          {currentStep === 1 && highlightBox.visible && (
            <View
              style={[
                styles.transactionCard,
                paymentHistoryData["9876543210"][0].type === "paid"
                  ? styles.txPaid
                  : styles.txReceived,
                {
                  position: "absolute",
                  left: highlightBox.x,
                  top: highlightBox.y,
                  width: highlightBox.width,
                  height: highlightBox.height,
                  zIndex: 9999,
                  elevation: 100,
                  borderRadius: 10,
                  marginTop: 33,
                  transform: "translateX(-80%)",
                },
              ]}
            >
              <View style={styles.transactionContent}>
                <Text style={styles.txAmount}>₹300</Text>
                <View style={styles.statusContainer}>
                  <Text style={styles.statusCheck}>✓</Text>
                  <Text style={styles.statusText}>
                    {paymentHistoryData["9876543210"][0].type === "paid"
                      ? "PAID"
                      : "RECEIVED"}
                  </Text>
                </View>
              </View>
              <View style={styles.txArrow}>
                <Text style={styles.arrowIcon}>→</Text>
              </View>
              <Text style={styles.txTime}>
                {paymentHistoryData["9876543210"][0].time}
              </Text>
            </View>
          )}

          {currentStep === 2 && highlightBox.visible && (
            <View
              style={[
                styles.transactionCard,
                paymentHistoryData["9876543210"][3].type === "paid"
                  ? styles.txPaid
                  : styles.txReceived,
                {
                  position: "absolute",
                  left: highlightBox.x,
                  top: highlightBox.y,
                  width: highlightBox.width,
                  height: highlightBox.height,
                  zIndex: 9999,
                  elevation: 100,
                  borderRadius: 10,
                  backgroundColor: "#000",
                  marginTop: 33,
                },
              ]}
            >
              <View style={styles.transactionContent}>
                <Text style={styles.txAmount}>₹20</Text>
                <View style={styles.statusContainer}>
                  <Text style={styles.statusCheck}>✓</Text>
                  <Text style={styles.statusText}>
                    {paymentHistoryData["9876543210"][3].type === "paid"
                      ? "PAID"
                      : "RECEIVED"}
                  </Text>
                </View>
              </View>
              <View style={styles.txArrow}>
                <Text style={styles.arrowIcon}>→</Text>
              </View>
              <Text style={styles.txTime}>
                {paymentHistoryData["9876543210"][3].time}
              </Text>
            </View>
          )}

          {currentStep === 3 && highlightBox.visible && (
            <View
              style={{
                position: "absolute",
                left: highlightBox.x,
                top: highlightBox.y,
                width: highlightBox.width,
                height: highlightBox.height,
                zIndex: 9999,
                elevation: 100,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#e3e3e3ff",
                borderRadius: 24,
                paddingHorizontal: 16,
                marginTop: 33,
              }}
            >
              {validAmount && <Text style={styles.rupeePrefix}>₹ </Text>}
              <TextInput
                style={[
                  styles.messageInput,
                  validAmount && styles.messageInputWithPrefix,
                  { flex: 1 },
                ]}
                placeholder="Enter amount or chat"
                placeholderTextColor="#3d3d3dff"
                value={message}
                onChangeText={setMessage}
                blurOnSubmit={false}
                editable={false}
              />
            </View>
          )}

          {currentStep === 4 && highlightBox.visible && (
            <View
              style={{
                position: "absolute",
                left: highlightBox.x,
                top: highlightBox.y,
                width: highlightBox.width,
                height: highlightBox.height,
                zIndex: 9999,
                elevation: 100,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#e3e3e3ff",
                borderRadius: 24,
                paddingHorizontal: 16,
                marginTop: 33,
              }}
            >
              {validAmount && <Text style={styles.rupeePrefix}>₹ </Text>}
              <TextInput
                style={[
                  styles.messageInput,
                  validAmount && styles.messageInputWithPrefix,
                  { flex: 1 },
                ]}
                placeholder="Enter amount or chat"
                placeholderTextColor="#3d3d3dff"
                value={message}
                onChangeText={setMessage}
                autoFocus={currentStep === 4}
                blurOnSubmit={false}
              />
            </View>
          )}

          {currentStep === 5 && highlightBox.visible && validAmount && (
            <TouchableOpacity
              style={[
                styles.payButton,
                {
                  position: "absolute",
                  left: highlightBox.x,
                  top: highlightBox.y,
                  width: highlightBox.width,
                  height: highlightBox.height,
                  zIndex: 9999,
                  elevation: 100,
                  marginTop: 33,
                },
              ]}
              onPress={handleSend}
              disabled={isProcessing}
            >
              <Text style={styles.payButtonText}>
                {isProcessing ? "..." : "PAY"}
              </Text>
            </TouchableOpacity>
          )}

          {currentStep < 6 && (
            <View
              style={{
                position: "absolute",
                backgroundColor: "#fff",
                width: width / 1.2,
                padding: 24,
                zIndex: 9999,
                top: WALKTHROUGH_STEPS[currentStep].top,
                left: "50%",
                transform: [{ translateX: -(width / 1.2 / 2) }],
                elevation: 1000,
                borderRadius: 10,
              }}
            >
              <Text style={styles.tooltipTitle}>
                {WALKTHROUGH_STEPS[currentStep].title}
              </Text>
              <Text style={styles.tooltipDescription}>
                {WALKTHROUGH_STEPS[currentStep].description}
              </Text>
              {!WALKTHROUGH_STEPS[currentStep].requiresAction ? (
                <View style={styles.tooltipButtons}>
                  {currentStep > 0 ? (
                    <TouchableOpacity onPress={handlePreviousStep}>
                      <Text style={styles.prevButton}>Prev</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity>
                      <Text></Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={handleNextStep}>
                    <Text style={styles.nextButton}>Next</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text
                  style={{
                    textAlign: "center",
                    padding: 8,
                    fontSize: 16,
                    color: "#9c27b0",
                    fontWeight: "bold",
                  }}
                >
                  {WALKTHROUGH_STEPS[currentStep].actionText}
                </Text>
              )}
            </View>
          )}

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconBtn}
            >
              <ArrowLeft color="#000000ff" size={24} />
            </TouchableOpacity>

            {hasHistory && (
              <View ref={headerRef} style={styles.headerCenter}>
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
                <RefreshCcw color="#000000ff" size={22} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <HelpCircle color="#000000ff" size={24} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
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
                      const isPayment = "amount" in item;

                      if (isPayment) {
                        const tx = item as Payment;
                        return (
                          <View key={item.id} style={styles.transactionWrapper}>
                            <View
                              {...(tx.type === "paid" && tx.id === 1
                                ? { ref: paidAmountRef }
                                : tx.type === "received" && tx.id === 4
                                ? { ref: recAmountRef }
                                : {})}
                              style={[
                                styles.transactionCard,
                                tx.type === "paid"
                                  ? styles.txPaid
                                  : styles.txReceived,
                              ]}
                            >
                              <View style={styles.transactionContent}>
                                <Text style={styles.txAmount}>
                                  ₹{tx.amount}
                                </Text>
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
                              (tx.type === "paid" &&
                                index === groupedHistory[date].length - 1)) && (
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
                                msg.type === "sent"
                                  ? styles.chatSent
                                  : styles.chatReceived,
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
              <View style={styles.inputContainer} ref={inputContainerRef}>
                {validAmount && <Text style={styles.rupeePrefix}>₹ </Text>}
                <TextInput
                  ref={inputRef}
                  style={[
                    styles.messageInput,
                    validAmount && styles.messageInputWithPrefix,
                  ]}
                  placeholder="Enter amount or chat"
                  placeholderTextColor="#3d3d3dff"
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
                    <ImageIcon color="#000000ff" size={22} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerIcon}>
                    <PlusCircle color="#000000ff" size={22} />
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
                    ref={payButtonRef}
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
  container: { flex: 1, backgroundColor: "#f1f1f1ff" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 48,
    paddingHorizontal: 12,
    paddingBottom: 12,
    alignItems: "center",
    backgroundColor: "#ffffffff",
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
  headerName: { fontSize: 16, fontWeight: "600", color: "#000000ff" },
  headerPhone: { fontSize: 12, color: "#616161ff" },

  // New User Card
  newUserContainer: {
    paddingTop: 20,
  },
  newUserCard: {
    backgroundColor: "#ffffffff",
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
    marginTop: 0,
    paddingHorizontal: 16,
  },
  dateHeader: {
    fontSize: 14,
    color: "#6d6d6dff",
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
    padding: 4,
    marginBottom: 8,
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
    right: 8,
    top: 8,
    width: 32,
    height: 32,
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
    justifyContent: "space-evenly",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f3f3f3ff",
  },
  quickButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#a7a7a7ff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  quickButtonText: {
    color: "#000000ff",
    fontSize: 14,
    fontWeight: "500",
  },

  // Animated Footer
  footer: {
    backgroundColor: "#ffffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#c4c4c4ff",
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
    color: "#000000ff",
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
    backgroundColor: "#e3e3e3ff",
    borderRadius: 24,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  rupeePrefix: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000ff",
    marginRight: 4,
  },
  messageInput: {
    flex: 1,
    color: "#000000ff",
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
    backgroundColor: "#000000ff",
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
    color: "#000000ff",
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
    color: "#f1f1f1ff",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  dropdownIcon: {
    color: "#ffffffff",
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
    color: "#000000ff",
    fontSize: 16,
    fontWeight: "bold",
  },
  tooltipTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  tooltipDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
  },
  tooltipButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  prevButton: {
    fontWeight: "bold",
    paddingVertical: 6,
    paddingHorizontal: 32,
    fontSize: 18,
    borderRadius: 5,
    color: "#5f259f",
    borderWidth: 2,
    borderColor: "#5f259f",
  },
  nextButton: {
    backgroundColor: "#5f259f",
    fontWeight: "bold",
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 32,
    fontSize: 18,
    borderRadius: 5,
  },
});
