import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useRef } from 'react';
import {
  KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet,
  Text, TextInput, TouchableOpacity, View, Dimensions
} from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Fixed values for tutorial
const TUTORIAL_ACCOUNT_NUMBER = "12345678901234";
const TUTORIAL_IFSC = "DLXB0000258";

const WALKTHROUGH_STEPS = [
  {
    id: 1,
    title: "Selected Bank",
    description: "This shows the bank you selected. You can tap the edit icon to change the bank if needed.",
    highlightSection: "bankCard",
    tooltipPosition: 280,
    requiresAction: false,
  },
  {
    id: 2,
    title: "Enter Account Number",
    description: `Enter the recipient's bank account number. For this tutorial, enter: ${TUTORIAL_ACCOUNT_NUMBER}`,
    highlightSection: "accountNumber",
    tooltipPosition: 340,
    requiresAction: true,
    actionText: `Enter ${TUTORIAL_ACCOUNT_NUMBER} and click Next`,
    validationFn: (data) => data.accountNumber === TUTORIAL_ACCOUNT_NUMBER,
  },
  {
    id: 3,
    title: "Enter IFSC Code",
    description: `Enter the 11-character IFSC code of the recipient's bank branch. For this tutorial, enter: ${TUTORIAL_IFSC}`,
    highlightSection: "ifsc",
    tooltipPosition: 420,
    requiresAction: true,
    actionText: `Enter ${TUTORIAL_IFSC} and click Next`,
    validationFn: (data) => data.ifsc === TUTORIAL_IFSC,
  },
  {
    id: 4,
    title: "Verify Account Details",
    description: "Now click the NEXT button to verify the account holder's name. This ensures you're sending money to the right person.",
    highlightSection: "nextButton",
    tooltipPosition: 300,
    requiresAction: true,
    actionText: "Click NEXT to verify account details",
  },
  {
    id: 5,
    title: "Verified Account Holder",
    description: "The account holder's name has been verified. Always confirm this matches the person you intend to send money to.",
    highlightSection: "verifiedName",
    tooltipPosition: 340,
    requiresAction: false,
  },
  {
    id: 6,
    title: "Add Nickname (Optional)",
    description: "You can add a nickname for this account to easily identify it later. This is optional but helpful for frequent transfers.",
    highlightSection: "nickname",
    tooltipPosition: 420,
    requiresAction: false,
  },
  {
    id: 7,
    title: "Proceed to Payment",
    description: "All set! Click 'PROCEED TO PAY' to continue to the payment screen where you'll enter the amount to transfer.",
    highlightSection: "proceedButton",
    tooltipPosition: 300,
    requiresAction: true,
    actionText: "Click PROCEED TO PAY to continue",
  },
];

export default function AddBankAccount() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const accountRef = useRef(null);
  const ifscRef = useRef(null);

  const selectedBank = {
    name: params.bankName || 'Dhanlaxmi Bank',
    icon: params.bankIcon || '🏛️',
    color: params.bankColor || '#F5F5F7'
  };

  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [branchInfo, setBranchInfo] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [nickname, setNickname] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const currentWalkthrough = WALKTHROUGH_STEPS[currentStep];

  const canProceed = currentWalkthrough.validationFn 
    ? currentWalkthrough.validationFn({ accountNumber, ifsc }) 
    : true;

  const handleIfscChange = (text) => {
    const upperText = text.toUpperCase();
    setIfsc(upperText);
    if (upperText.length === 11) {
      setTimeout(() => {
        setBranchInfo(`${selectedBank.name}, AMRITA INSTITUTE OF TECHNOLOGY KORAMANGALA`);
      }, 500);
    } else {
      setBranchInfo('');
    }
  };

  const handleAccountChange = (text) => {
    setAccountNumber(text);
  };

  const handleIfscInput = (text) => {
    handleIfscChange(text);
  };

  const handleVerify = () => {
    if (accountNumber.length > 0 && ifsc.length === 11) {
      setTimeout(() => {
        setAccountHolderName('Aadi');
        setIsVerified(true);
        if (showTutorial) {
          setCurrentStep(4); // Move to verified name step
        }
      }, 1000);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      // Handle special cases when going back
      if (currentStep === 4) {
        // Going back from verified state
        setIsVerified(false);
        setAccountHolderName('');
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentWalkthrough.requiresAction && !canProceed) return;
    
    if (currentStep < WALKTHROUGH_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleProceedToPay = () => {
    setShowTutorial(false);
    router.push({ 
      pathname: "./enterAmount", 
      params: { 
        bankName: selectedBank.name, 
        bankIcon: selectedBank.icon, 
        bankColor: selectedBank.color, 
        accountNumber, 
        ifsc, 
        accountHolderName, 
        nickname 
      } 
    });
  };

  const isNextEnabled = accountNumber.length > 0 && ifsc.length === 11;
  const isProceedEnabled = isVerified && accountHolderName.length > 0;

  const renderHighlightedElement = () => {
    if (!showTutorial) return null;

    if (currentWalkthrough.highlightSection === "bankCard") {
      return (
        <View style={[styles.highlightedContainer, { top: 100, left: 20, right: 20 }]}>
          <View style={styles.selectedBankCard}>
            <View style={[styles.bankIconSmall, { backgroundColor: selectedBank.color }]}>
              <Text style={styles.bankIconEmoji}>{selectedBank.icon}</Text>
            </View>
            <View style={styles.bankInfo}>
              <Text style={styles.selectedBankLabel}>Selected bank</Text>
              <Text style={styles.selectedBankName}>{selectedBank.name}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (currentWalkthrough.highlightSection === "accountNumber") {
      return (
        <View style={[styles.highlightedContainer, { top: 200, left: 20, right: 20 }]}>
          <View style={styles.highlightedInput}>
            <Text style={styles.inputLabel}>Account number</Text>
            <TextInput
              ref={accountRef}
              value={accountNumber}
              onChangeText={handleAccountChange}
              keyboardType="number-pad"
              maxLength={14}
              style={[styles.input, accountNumber.length > 0 && styles.inputFilled]}
              autoFocus={true}
              placeholder={TUTORIAL_ACCOUNT_NUMBER}
              placeholderTextColor="#ccc"
            />
          </View>
        </View>
      );
    }

    if (currentWalkthrough.highlightSection === "ifsc") {
      return (
        <View style={[styles.highlightedContainer, { top: 200, left: 20, right: 20 }]}>
          <View style={styles.highlightedInput}>
            <Text style={styles.inputLabel}>IFSC</Text>
            <TextInput
              ref={ifscRef}
              value={ifsc}
              onChangeText={handleIfscInput}
              autoCapitalize="characters"
              maxLength={11}
              style={[styles.input, ifsc.length > 0 && styles.inputFilled]}
              autoFocus={true}
              placeholder={TUTORIAL_IFSC}
              placeholderTextColor="#ccc"
            />
            {branchInfo.length > 0 && <Text style={styles.branchInfo}>{branchInfo}</Text>}
          </View>
        </View>
      );
    }

    if (currentWalkthrough.highlightSection === "nextButton") {
      return (
        <View style={[styles.highlightedContainer, { bottom: insets.bottom || 16, left: 0, right: 0, borderRadius: 0 }]}>
          <TouchableOpacity
            style={[styles.nextButton, isNextEnabled && styles.nextButtonEnabled]}
            onPress={handleVerify}
            disabled={!isNextEnabled}
          >
            <Text style={[styles.nextButtonText, isNextEnabled && styles.nextButtonTextEnabled]}>NEXT</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (currentWalkthrough.highlightSection === "verifiedName") {
      return (
        <View style={[styles.highlightedContainer, { top: 200, left: 20, right: 20 }]}>
          <View style={styles.highlightedInput}>
            <View style={styles.verifiedHeader}>
              <Text style={styles.verifiedLabel}>Verified Account Holder Name</Text>
              <View style={styles.verifiedBadge}><Text style={styles.verifiedCheck}>✓</Text></View>
            </View>
            <Text style={styles.accountHolderText}>{accountHolderName}</Text>
          </View>
        </View>
      );
    }

    if (currentWalkthrough.highlightSection === "nickname") {
      return (
        <View style={[styles.highlightedContainer, { top: 290, left: 20, right: 20 }]}>
          <View style={styles.highlightedInput}>
            <Text style={styles.nicknameLabel}>Nickname (optional)</Text>
            <TextInput 
              value={nickname} 
              onChangeText={setNickname} 
              style={[styles.input, styles.nicknameInput]} 
              placeholder="e.g., Friend's Account"
              placeholderTextColor="#ccc"
            />
          </View>
        </View>
      );
    }

    if (currentWalkthrough.highlightSection === "proceedButton") {
      return (
        <View style={[styles.highlightedContainer, { bottom: insets.bottom || 16, left: 0, right: 0, borderRadius: 0 }]}>
          <TouchableOpacity
            style={[styles.proceedButton, !isProceedEnabled && styles.proceedButtonDisabled]}
            onPress={handleProceedToPay}
            disabled={!isProceedEnabled}
          >
            <Text style={styles.proceedButtonText}>PROCEED TO PAY</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

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
            {(currentStep === 1 || currentStep === 2) && canProceed && (
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={true} />
      <View style={{ height: insets.top, backgroundColor: "#fff" }} />

      {showTutorial && (
        <>
          <View style={styles.overlay} pointerEvents="box-none" />
          {renderHighlightedElement()}
          {renderTooltip()}
        </>
      )}

      {/* Header */}
      <View style={[styles.header, showTutorial && styles.dimmedContent]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} disabled={showTutorial}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Bank Account</Text>
        <TouchableOpacity style={styles.helpButton} disabled={showTutorial}>
          <View style={styles.helpIconContainer}>
            <Text style={styles.helpIcon}>?</Text>
          </View>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} scrollEnabled={!showTutorial}>

          {/* Selected Bank Card */}
          <View style={[styles.selectedBankCard, showTutorial && currentWalkthrough.highlightSection !== "bankCard" && styles.dimmedContent]}>
            <View style={[styles.bankIconSmall, { backgroundColor: selectedBank.color }]}>
              <Text style={styles.bankIconEmoji}>{selectedBank.icon}</Text>
            </View>
            <View style={styles.bankInfo}>
              <Text style={styles.selectedBankLabel}>Selected bank</Text>
              <Text style={styles.selectedBankName}>{selectedBank.name}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => router.back()} disabled={showTutorial}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>

          {/* Account Number */}
          <View style={[styles.inputContainer, showTutorial && currentWalkthrough.highlightSection !== "accountNumber" && styles.dimmedContent]}>
            <Text style={styles.inputLabel}>Account number</Text>
            <TextInput
              value={accountNumber}
              onChangeText={handleAccountChange}
              keyboardType="number-pad"
              maxLength={14}
              style={[styles.input, accountNumber.length > 0 && styles.inputFilled]}
              editable={!showTutorial || currentWalkthrough.highlightSection === "accountNumber"}
            />
          </View>

          {/* IFSC */}
          <View style={[styles.inputContainer, showTutorial && currentWalkthrough.highlightSection !== "ifsc" && styles.dimmedContent]}>
            <Text style={styles.inputLabel}>IFSC</Text>
            <TextInput
              value={ifsc}
              onChangeText={handleIfscInput}
              autoCapitalize="characters"
              maxLength={11}
              style={[styles.input, ifsc.length > 0 && styles.inputFilled]}
              editable={!showTutorial || currentWalkthrough.highlightSection === "ifsc"}
            />
            {branchInfo.length > 0 && <Text style={styles.branchInfo}>{branchInfo}</Text>}
          </View>

          {/* Verified Section */}
          {isVerified && (
            <>
              <View style={[styles.verifiedSection, showTutorial && currentWalkthrough.highlightSection !== "verifiedName" && styles.dimmedContent]}>
                <View style={styles.verifiedHeader}>
                  <Text style={styles.verifiedLabel}>Verified Account Holder Name</Text>
                  <View style={styles.verifiedBadge}><Text style={styles.verifiedCheck}>✓</Text></View>
                </View>
                <Text style={styles.accountHolderText}>{accountHolderName}</Text>
              </View>
              <View style={[styles.inputContainer, showTutorial && currentWalkthrough.highlightSection !== "nickname" && styles.dimmedContent]}>
                <Text style={styles.nicknameLabel}>Nickname (optional)</Text>
                <TextInput 
                  value={nickname} 
                  onChangeText={setNickname} 
                  style={[styles.input, styles.nicknameInput]} 
                  editable={!showTutorial || currentWalkthrough.highlightSection === "nickname"}
                />
              </View>
            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Button */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom || 16 }, showTutorial && !["nextButton", "proceedButton"].includes(currentWalkthrough.highlightSection) && styles.dimmedContent]}>
        {!isVerified ? (
          <TouchableOpacity
            style={[styles.nextButton, isNextEnabled && styles.nextButtonEnabled]}
            onPress={handleVerify}
            disabled={!isNextEnabled || (showTutorial && currentWalkthrough.highlightSection !== "nextButton")}
          >
            <Text style={[styles.nextButtonText, isNextEnabled && styles.nextButtonTextEnabled]}>NEXT</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.proceedButton, !isProceedEnabled && styles.proceedButtonDisabled]}
            onPress={handleProceedToPay}
            disabled={!isProceedEnabled || (showTutorial && currentWalkthrough.highlightSection !== "proceedButton")}
          >
            <Text style={styles.proceedButtonText}>PROCEED TO PAY</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#fff', justifyContent: 'space-between' },
  backButton: { padding: 8 },
  backIcon: { fontSize: 28, color: "#000", fontWeight: "300" },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '600', color: '#000' },
  helpButton: { padding: 8 },
  helpIconContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#F5F5F5", justifyContent: "center", alignItems: "center" },
  helpIcon: { fontSize: 18, color: "#000", fontWeight: "600" },
  content: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  selectedBankCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 24 },
  bankIconSmall: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  bankIconEmoji: { fontSize: 24 },
  bankInfo: { flex: 1 },
  selectedBankLabel: { fontSize: 13, color: '#999', marginBottom: 2 },
  selectedBankName: { fontSize: 16, fontWeight: '500', color: '#000' },
  editButton: { padding: 8 },
  editIcon: { fontSize: 20 },
  inputContainer: { marginBottom: 24 },
  inputLabel: { fontSize: 14, color: '#999', marginBottom: 8 },
  input: { borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingVertical: 12, fontSize: 16, color: '#000' },
  inputFilled: { borderBottomColor: '#5f259f', borderBottomWidth: 2 },
  branchInfo: { marginTop: 8, fontSize: 14, color: '#000' },
  verifiedSection: { marginBottom: 24 },
  verifiedHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  verifiedLabel: { fontSize: 14, color: '#999' },
  verifiedBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  verifiedCheck: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  accountHolderText: { fontSize: 16, fontWeight: '500', color: '#000' },
  nicknameLabel: { fontSize: 14, color: '#5f259f', marginBottom: 8 },
  nicknameInput: { borderBottomColor: '#5f259f' },
  bottomContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff' },
  nextButton: { backgroundColor: '#E0E0E0', paddingVertical: 16, alignItems: 'center' },
  nextButtonText: { fontSize: 16, fontWeight: '600', color: '#999' },
  nextButtonEnabled: { backgroundColor: '#5f259f' },
  nextButtonTextEnabled: { color: '#fff' },
  proceedButton: { backgroundColor: '#5f259f', paddingVertical: 16, alignItems: 'center' },
  proceedButtonDisabled: { backgroundColor: '#E0E0E0' },
  proceedButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  // Tutorial styles
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", zIndex: 100 },
  dimmedContent: { opacity: 0.3 },
  highlightedContainer: { position: "absolute", zIndex: 101, backgroundColor: "#fff", borderRadius: 12, shadowColor: "#fff", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 30, elevation: 50 },
  highlightedInput: { backgroundColor: "#fff", padding: 16, borderRadius: 12 },
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