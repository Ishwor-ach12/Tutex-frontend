// Enter Amount Page - React Native with Expo Router
// File: app/enterAmount.tsx

import { VoiceAgent } from "@/app/customComponents/VoiceAgent";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  ChevronRight,
  HelpCircle,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");



const WALKTHROUGH_STEPS = [
  {
    id: 1,
    title: "qr_tutorial.enter_amount1_title",
    description:
      "qr_tutorial.enter_amount1_description",
    top: "30%",
    requiresAction: false,
  },
  {
    id: 2,
    title: "qr_tutorial.enter_amount2_title",
    description:
      "qr_tutorial.enter_amount2_description",
    top: "38%",
    requiresAction: true,
    actionText: "qr_tutorial.enter_amount2_actionText"
  },
  {
    id: 3,
    title: "qr_tutorial.enter_amount3_title",
    description:
      "qr_tutorial.enter_amount3_description",
    top: "60%",
    requiresAction: true,
    actionText: "qr_tutorial.enter_amount3_actionText"
  },
  {
    id: 4,
    title: "qr_tutorial.enter_amount4_title",
    description:
      "qr_tutorial.enter_amount4_description",
    top: "15%",
    requiresAction: false,
  },
  {
    id: 5,
    title: "qr_tutorial.enter_amount5_title",
    description:
      "qr_tutorial.enter_amount5_description",
    top: "15%",
    requiresAction: true,
    actionText:"qr_tutorial.enter_amount5_actionText"
  },
];

export default function EnterAmount() {
  const {t} = useTranslation();
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const recipientName = "Recipient Name";
  const senderBankName = "Bank Name";
  const senderAccountLast4 = "1234";
  const [currentStep, setCurrentStep] = useState<number>(0);
  const currentStepRef = useRef<number>(currentStep);
  const isFocused = useIsFocused();
  const amountRef = useRef<TextInput>(null);

  const handleProceedToPay = () => {
    if (amount && parseFloat(amount) > 0) {
      setCurrentStep(currentStep + 1);
      setShowModal(true);
    }
  };

  const handlePay = () => {
    if (currentStep == 3) return;
    // Handle final payment
    console.log("Payment processed:", amount);
    setShowModal(false);
    // Navigate to success page or home
    router.push({
      pathname: "./enterPin",
      params: {
        data: JSON.stringify({
          amount,
          recipientName,
          senderBankName,
          senderAccountLast4,
        }),
      },
    });
  };

  useEffect(() => {
    if (amount == "120") {
      amountRef.current?.blur();
      setCurrentStep(currentStep + 1);
    }
  }, [amount]);

  const handleNextStep = () => {
    if (currentStep < WALKTHROUGH_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
    if (currentStep == 3) {
      setShowModal(false);
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(()=>{
      currentStepRef.current = currentStep;
  },[currentStep]);

  return (
    <View style={styles.container}>
      {isFocused && <View
          style={{
            position: "absolute",
            top: 50,
            right: 20,
            zIndex: 500,
          }}
        >
          <VoiceAgent
            tutorialName="UPI_MB_3"
            size={35}
            uiHandlerFunction={(num: string) => {
              const step = parseInt(num);
              if (!isNaN(step)) {
  
                setCurrentStep(Math.min(currentStep,step));
              }
            }}
            introduce={false}
            currentStepRef={currentStepRef}
          />
        </View>}
      {currentStep < 3 && (
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

            {t(WALKTHROUGH_STEPS[currentStep].title)}
          </Text>
          <Text style={styles.tooltipDescription}>
            {t(WALKTHROUGH_STEPS[currentStep].description)}
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
              {t(WALKTHROUGH_STEPS[currentStep].actionText)}
            </Text>
          )}
        </View>
      )}
      {showModal && (
        <View
          style={{
            backgroundColor: "#2e2e2e64",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 10,
          }}
        ></View>
      )}
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Pay</Text>

        <TouchableOpacity style={styles.helpButton}>
          <HelpCircle size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View
        style={[
          {
            position: "absolute",
            width: width,
            height: height + 100,
            backgroundColor: "#0000009d",
            zIndex: 10,
          },
        ]}
      />
      {/* Content */}
      <View style={styles.content}>
        {/* Recipient Card */}

        <View
          style={[
            styles.recipientHeader,
            currentStep == 0 && styles.highlightedItem,
          ]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>•</Text>
          </View>
          <View style={[styles.recipientInfo]}>
            <Text style={styles.recipientName}>Recipient name</Text>
            <View style={styles.bankingNameContainer}>
              <Text style={styles.bankingLabel}>Banking name: </Text>
              <Text style={styles.bankingName}>Recipient name</Text>
              <CheckCircle
                size={16}
                color="#00c853"
                style={styles.verifiedIcon}
              />
            </View>
          </View>
        </View>

        {/* Amount Input */}
        <View
          style={[
            styles.amountInputContainer,
            currentStep == 1 && styles.highlightedItem,
          ]}
        >
          <Text style={styles.rupeeSymbol}>₹</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="Enter amount"
            placeholderTextColor="#999"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            ref={amountRef}
          />
        </View>

        {/* Message Input */}
        <TextInput
          style={styles.messageInput}
          placeholder="Add a message (optional)"
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
          multiline
        />
      </View>

      {/* Proceed Button */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity
          style={[
            styles.proceedButton,
            (!amount || parseFloat(amount) <= 0) &&
              styles.proceedButtonDisabled,
            currentStep == 2 && styles.highlightedItem,
          ]}
          onPress={handleProceedToPay}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          <Text style={styles.proceedButtonText}>Proceed To Pay</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* Payment Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Text style={styles.modalHeaderTitle}>Total payable</Text>
              </View>
              <View style={styles.modalHeaderRight}>
                <Text style={styles.modalHeaderAmount}>₹{amount}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    if (currentStep != 3 && currentStep != 4)
                      setShowModal(false);
                  }}
                >
                  <X size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Payment Methods */}
            <View style={styles.paymentMethodsContainer}>
              {/* Recommended Section */}
              <Text style={styles.sectionTitle}>Recommended</Text>

              {/* Bank Account Option */}
              <TouchableOpacity style={styles.paymentOption}>
                <View style={styles.paymentOptionLeft}>
                  <View style={styles.bankIcon}>
                    <Building2 size={24} color="#5f259f" />
                  </View>
                  <View style={styles.bankInfo}>
                    <Text style={styles.bankName}>Dhanlaxmi Bank</Text>
                    <View style={styles.accountNumberRow}>
                      <Text style={styles.accountDots}>•• </Text>
                      <Text style={styles.accountNumber}>0666 </Text>
                      <Text style={styles.upiText}>UPI</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.paymentOptionRight}>
                  <Text style={styles.paymentAmount}>₹{amount}</Text>
                  <View style={styles.selectedCheck}>
                    <CheckCircle size={20} color="#00c853" />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Add Payment Methods */}
              <Text style={styles.sectionTitle}>Add payment methods</Text>

              <TouchableOpacity style={styles.addMethodOption}>
                <View style={styles.addMethodLeft}>
                  <View style={styles.addMethodIcon}>
                    <Building2 size={24} color="#666" />
                  </View>
                  <Text style={styles.addMethodText}>Add bank accounts</Text>
                </View>
                <ChevronRight size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Pay Button */}
            <TouchableOpacity style={styles.payButton} onPress={handlePay}>
              <Text style={styles.payButtonText}>Pay ₹{amount}</Text>
            </TouchableOpacity>
          </View>
          {(currentStep === 3 || currentStep === 4) && (
            <View
              style={{
                position: "absolute",
                backgroundColor: "#fff",
                width: width / 1.2,
                padding: 24,
                top: WALKTHROUGH_STEPS[currentStep].top,
                left: "50%",
                transform: [{ translateX: -(width / 1.2 / 2) }],
                elevation: 1000,
                borderRadius: 10,
              }}
            >
              <Text style={styles.tooltipTitle}>
                {t(WALKTHROUGH_STEPS[currentStep].title)}
              </Text>
              <Text style={styles.tooltipDescription}>
                {t(WALKTHROUGH_STEPS[currentStep].description)}
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
              {t(WALKTHROUGH_STEPS[currentStep].actionText || "")}
                </Text>
              )}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  helpButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingTop: 20,
    margin: 20,
  },
  recipientCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipientHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    backgroundColor: "#fbfbfbff",
    padding: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#607d8b",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    color: "#fff",
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  bankingNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  bankingLabel: {
    fontSize: 13,
    color: "#666",
  },
  bankingName: {
    fontSize: 13,
    color: "#666",
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#9c27b0",
    borderRadius: 8,
    paddingLeft: 16,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  rupeeSymbol: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    padding: 0,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#000",
    minHeight: 50,
  },
  proceedButton: {
    backgroundColor: "#9c27b0",
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  proceedButtonDisabled: {
    backgroundColor: "#d0d0d0",
  },
  proceedButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    minHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalHeaderLeft: {
    flex: 1,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  modalHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalHeaderAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentMethodsContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    marginTop: 8,
  },
  paymentOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  paymentOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bankIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  accountNumberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountDots: {
    fontSize: 14,
    color: "#666",
    letterSpacing: 2,
  },
  accountNumber: {
    fontSize: 14,
    color: "#666",
  },
  upiText: {
    fontSize: 11,
    color: "#666",
    backgroundColor: "#e8e8e8",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  paymentOptionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  selectedCheck: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  addMethodOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  addMethodLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  addMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addMethodText: {
    fontSize: 16,
    color: "#000",
  },
  payButton: {
    backgroundColor: "#9c27b0",
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
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
  highlightedItem: {
    zIndex: 11,
    elevation: 30,
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 50,
  },
});
