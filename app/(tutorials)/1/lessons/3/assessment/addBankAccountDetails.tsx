import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddBankAccount() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Selected bank from previous screen
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
  const [formStep, setFormStep] = useState(1);

  // IFSC validation
  const handleIfscChange = (text) => {
    setIfsc(text.toUpperCase());

    if (text.length === 11) {
      setTimeout(() => {
        setBranchInfo(`${selectedBank.name}, AMRITA INSTITUTE OF TECHNOLOGY KORAMANGALA`);
      }, 500);
    } else {
      setBranchInfo('');
    }
  };

  // Simulate verification
  const handleNext = () => {
    if (accountNumber.length > 0 && ifsc.length === 11) {
      setTimeout(() => {
        setAccountHolderName('Aadi');
        setIsVerified(true);
        setFormStep(3);
      }, 1000);
    }
  };

  const handleProceedToPay = () => {
    console.log('Proceeding to pay with:', {
      accountNumber,
      ifsc,
      accountHolderName,
      nickname
    });
  };

  const isNextEnabled = accountNumber.length > 0 && ifsc.length === 11;
  const isProceedEnabled = isVerified && accountHolderName.length > 0;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={true}
      />

      {/* Safe Area Top */}
      <View style={{ height: insets.top, backgroundColor: "#fff" }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add Bank Account</Text>

        <TouchableOpacity style={styles.helpButton}>
          <View style={styles.helpIconContainer}>
            <Text style={styles.helpIcon}>?</Text>
          </View>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          {/* Selected Bank Card */}
          <View style={styles.selectedBankCard}>
            <View style={[styles.bankIconSmall, { backgroundColor: selectedBank.color }]}>
              <Text style={styles.bankIconEmoji}>{selectedBank.icon}</Text>
            </View>

            <View style={styles.bankInfo}>
              <Text style={styles.selectedBankLabel}>Selected bank</Text>
              <Text style={styles.selectedBankName}>{selectedBank.name}</Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.back()}
            >
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>

          {/* Account Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Account number</Text>
            <TextInput
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="number-pad"
              maxLength={18}
              style={[
                styles.input,
                accountNumber.length > 0 && styles.inputFilled
              ]}
            />
          </View>

          {/* IFSC */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>IFSC</Text>
            <TextInput
              value={ifsc}
              onChangeText={handleIfscChange}
              autoCapitalize="characters"
              maxLength={11}
              style={[
                styles.input,
                ifsc.length > 0 && styles.inputFilled
              ]}
            />

            {branchInfo.length > 0 && (
              <Text style={styles.branchInfo}>{branchInfo}</Text>
            )}
          </View>

          {/* Verified Account Holder Name */}
          {isVerified && (
            <View style={styles.verifiedSection}>
              <View style={styles.verifiedHeader}>
                <Text style={styles.verifiedLabel}>Verified Account Holder Name</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedCheck}>✓</Text>
                </View>
              </View>

              <Text style={styles.accountHolderText}>{accountHolderName}</Text>
            </View>
          )}

          {/* Nickname */}
          {isVerified && (
            <View style={styles.inputContainer}>
              <Text style={styles.nicknameLabel}>Nickname (optional)</Text>
              <TextInput
                value={nickname}
                onChangeText={setNickname}
                style={[styles.input, styles.nicknameInput]}
              />
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Button */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom || 16 }]}>

        {/* NEXT Button */}
        {!isVerified ? (
          <TouchableOpacity
            style={[styles.nextButton, isNextEnabled && styles.nextButtonEnabled]}
            onPress={handleNext}
            disabled={!isNextEnabled}
          >
            <Text style={[styles.nextButtonText, isNextEnabled && styles.nextButtonTextEnabled]}>
              NEXT
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.proceedButton, !isProceedEnabled && styles.proceedButtonDisabled]}
            onPress={() => {
              if (isProceedEnabled) {
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

                handleProceedToPay();
              }
            }}
            disabled={!isProceedEnabled}
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },

  backButton: { padding: 8 },
  backIcon: { fontSize: 28, color: "#000", fontWeight: "300" },

  headerTitle: {
    flex: 1, fontSize: 18, fontWeight: '600', color: '#000',
  },

  helpButton: { padding: 8 },

  helpIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  helpIcon: { fontSize: 18, color: "#000", fontWeight: "600" },

  content: { flex: 1 },

  scrollContent: { padding: 20, paddingBottom: 100 },

  selectedBankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },

  bankIconSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  bankIconEmoji: { fontSize: 24 },

  bankInfo: { flex: 1 },

  selectedBankLabel: { fontSize: 13, color: '#999', marginBottom: 2 },
  selectedBankName: { fontSize: 16, fontWeight: '500', color: '#000' },

  editButton: { padding: 8 },
  editIcon: { fontSize: 20 },

  inputContainer: { marginBottom: 24 },

  inputLabel: { fontSize: 14, color: '#999', marginBottom: 8 },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },

  inputFilled: {
    borderBottomColor: '#5f259f',
    borderBottomWidth: 2,
  },

  branchInfo: {
    marginTop: 8,
    fontSize: 14,
    color: '#000',
  },

  verifiedSection: { marginBottom: 24 },

  verifiedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  verifiedLabel: { fontSize: 14, color: '#999' },

  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },

  verifiedCheck: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  accountHolderText: { fontSize: 16, fontWeight: '500', color: '#000' },

  nicknameLabel: { fontSize: 14, color: '#5f259f', marginBottom: 8 },
  nicknameInput: { borderBottomColor: '#5f259f' },

  bottomContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
  },

  nextButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 16,
    alignItems: 'center',
  },

  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },

  nextButtonEnabled: {
    backgroundColor: '#5f259f',
  },

  nextButtonTextEnabled: {
    color: '#fff',
  },

  proceedButton: {
    backgroundColor: '#5f259f',
    paddingVertical: 16,
    alignItems: 'center',
  },

  proceedButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },

  proceedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
