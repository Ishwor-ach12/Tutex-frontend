// accountNumberIFSC.tsx - PhonePe Account Number & IFSC Screen with Modular Tutorial

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { ArrowLeft, HelpCircle, Plus } from "lucide-react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");

const WALKTHROUGH_STEPS = [
  {
    id: 1,
    title: "Add a New Bank Account",
    description: "Click here to add a beneficiary's bank account details. You'll need their Account Number and IFSC code to proceed. Once saved, you can quickly transfer money to this account anytime without re-entering details.",
    highlightSection: "addBankButton",
    requiresAction: true,
    actionText: "Click on icon to add account",
  },
];

export default function AccountNumberIFSC() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const currentWalkthrough = WALKTHROUGH_STEPS[currentStep];

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < WALKTHROUGH_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleAddBankAccount = () => {
    setShowTutorial(false);
    router.push("./selectBank");
  };

  const renderHighlightedElement = () => {
    if (!showTutorial) return null;

    if (currentWalkthrough.highlightSection === "addBankButton") {
      return (
        <View style={[styles.highlightedButtonContainer, { bottom: insets.bottom + 32 }]}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddBankAccount}
            activeOpacity={0.9}
          >
            <Plus size={20} color="#fff" strokeWidth={2.5} />
            <Text style={styles.addButtonText}>Bank Account</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const renderTooltip = () => {
    if (!showTutorial) return null;

    return (
      <View style={styles.tooltipContainer}>
        <Text style={styles.tooltipTitle}>{currentWalkthrough.title}</Text>
        <Text style={styles.tooltipDescription}>{currentWalkthrough.description}</Text>

        {/* Step Indicator - only show if multiple steps */}
        {WALKTHROUGH_STEPS.length > 1 && (
          <View style={styles.stepIndicator}>
            {WALKTHROUGH_STEPS.map((_, index) => (
              <View
                key={index}
                style={[styles.stepDot, index === currentStep && styles.stepDotActive]}
              />
            ))}
          </View>
        )}

        {!currentWalkthrough.requiresAction ? (
          <View style={styles.tooltipButtons}>
            {currentStep > 0 ? (
              <TouchableOpacity style={styles.prevButton} onPress={handlePrev}>
                <Text style={styles.prevButtonText}>Prev</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.prevButton} />
            )}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentStep === WALKTHROUGH_STEPS.length - 1 ? "Try Now" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.tooltipButtons}>
            <TouchableOpacity style={styles.tryNowButton}>
              <Text style={styles.tryNowButtonText}>{currentWalkthrough.actionText}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={true} />
      <View style={[styles.statusBarSpacer, { height: insets.top }]} />

      {/* Tutorial Overlay */}
      {showTutorial && (
        <>
          <View style={styles.overlay} pointerEvents="box-none" />
          {renderHighlightedElement()}
          {renderTooltip()}
        </>
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={showTutorial}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpButton} disabled={showTutorial}>
          <HelpCircle size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!showTutorial}
      >
        <Text style={[styles.title, showTutorial && styles.dimmedContent]}>
          To Account Number & IFSC
        </Text>

        <View style={[styles.savedSection, showTutorial && styles.dimmedContent]}>
          <Text style={styles.savedTitle}>SAVED BANK ACCOUNTS</Text>
        </View>

        <View style={[styles.emptyState, showTutorial && styles.dimmedContent]}>
          <Text style={styles.emptyText}>No saved bank accounts yet</Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <View style={[styles.upiLogoContainer, showTutorial && styles.dimmedContent]}>
          <Text style={styles.poweredBy}>POWERED BY</Text>
          <Text style={styles.upiLogo}>UPI</Text>
        </View>

        {!showTutorial && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddBankAccount}>
            <Plus size={20} color="#fff" strokeWidth={2.5} />
            <Text style={styles.addButtonText}>Bank Account</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  statusBarSpacer: { backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 16, backgroundColor: "#fff" },
  backButton: { padding: 8 },
  helpButton: { padding: 8 },
  content: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#000", marginBottom: 32 },
  savedSection: { marginBottom: 16 },
  savedTitle: { fontSize: 13, fontWeight: "600", color: "#999", letterSpacing: 0.5 },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  emptyText: { fontSize: 16, color: "#999" },
  bottomBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#f0f0f0" },
  upiLogoContainer: { alignItems: "flex-start" },
  poweredBy: { fontSize: 9, color: "#999", letterSpacing: 1, marginBottom: 2 },
  upiLogo: { fontSize: 20, fontWeight: "bold", color: "#666", letterSpacing: 2 },
  addButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#5f259f", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 20, gap: 8 },
  addButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  // Tutorial styles
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 100 },
  dimmedContent: { opacity: 0.3 },
  highlightedButtonContainer: { position: "absolute", right: 20, zIndex: 101, backgroundColor: "#5f259f", borderRadius: 8, shadowColor: "#5f259f", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 30, elevation: 50 },
  tooltipContainer: { position: "absolute", bottom: 180, left: width * 0.05, right: width * 0.05, backgroundColor: "#fff", borderRadius: 16, padding: 20, zIndex: 102, elevation: 60, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  tooltipTitle: { fontSize: 20, fontWeight: "bold", color: "#000", marginBottom: 10, marginTop: 8 },
  tooltipDescription: { fontSize: 15, color: "#555", lineHeight: 22, marginBottom: 16 },
  stepIndicator: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 16, gap: 8 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ddd" },
  stepDotActive: { backgroundColor: "#5f259f", width: 24 },
  tooltipButtons: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  prevButton: { flex: 1, backgroundColor: "#f0f0f0", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  prevButtonText: { color: "#333", fontSize: 15, fontWeight: "600" },
  nextButton: { flex: 1, backgroundColor: "#5f259f", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  nextButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  tryNowButton: { flex: 1, backgroundColor: "#5f259f", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  tryNowButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});