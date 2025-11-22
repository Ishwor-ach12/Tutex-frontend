import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from "react-native";
import { ArrowLeft, HelpCircle, ChevronRight } from "lucide-react-native";

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 28;
const { width } = Dimensions.get("window");

const WALKTHROUGH_STEPS = [
  {
    id: 1,
    title: "Transfer to Your Own Bank Account",
    description: "Quickly move funds between your own linked bank accounts. This option is perfect for managing money across your different banks instantly and securely.",
    highlightSection: "selfBank",
    top: "52%",
    requiresAction: false,
  },
  {
    id: 2,
    title: "Send Money to Any Bank Account",
    description: "Transfer money to anyone in India using their Account Number & IFSC code. Now let's try sending money to a bank account by clicking this option.",
    highlightSection: "accountIFSC",
    top: "52%",
    requiresAction: true,
    actionText: "Click on 'To Account Number & IFSC' to continue",
  },
];

export default function SendMoney() {
  const router = useRouter();
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

  const handleHighlightedCardPress = () => {
    if (currentWalkthrough.highlightSection === "selfBank") {
      
    } else if (currentWalkthrough.highlightSection === "accountIFSC") {
      setShowTutorial(false);
      router.push("./addBenificiary");
    }
  };

  const renderHighlightedCard = () => {
    if (!showTutorial) return null;

    const isSelfBank = currentWalkthrough.highlightSection === "selfBank";
    const isAccountIFSC = currentWalkthrough.highlightSection === "accountIFSC";

    if (isSelfBank) {
      return (
        <View style={[styles.highlightedCardContainer, styles.highlightedSelfBank]}>
          <TouchableOpacity 
            style={styles.card}
            onPress={handleHighlightedCardPress}
            activeOpacity={0.9}
          >
            <View style={styles.cardIcon}>
              <View style={styles.iconCircle}>
                <View style={styles.personIcon}>
                  <View style={styles.personHead} />
                  <View style={styles.personBody} />
                  <View style={styles.personPlus}>
                    <Text style={styles.plusText}>+</Text>
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.cardTitle}>To Self Bank</Text>
            <Text style={styles.cardTitle}>Account</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isAccountIFSC) {
      return (
        <View style={[styles.highlightedCardContainer, styles.highlightedAccountIFSC]}>
          <TouchableOpacity 
            style={styles.card}
            onPress={handleHighlightedCardPress}
            activeOpacity={0.9}
          >
            <View style={styles.cardIcon}>
              <View style={styles.iconCircle}>
                <View style={styles.basketIcon}>
                  <View style={styles.basketTop} />
                  <View style={styles.basketBody}>
                    <View style={styles.basketStripe} />
                    <View style={styles.basketStripe} />
                    <View style={styles.basketStripe} />
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.cardTitle}>To Account</Text>
            <Text style={styles.cardTitle}>Number & IFSC</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const renderTooltip = () => {
    if (!showTutorial) return null;

    return (
      <View style={[styles.tooltipContainer, { top: currentWalkthrough.top }]}>
        <Text style={styles.tooltipTitle}>{currentWalkthrough.title}</Text>
        <Text style={styles.tooltipDescription}>{currentWalkthrough.description}</Text>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          {WALKTHROUGH_STEPS.map((_, index) => (
            <View
              key={index}
              style={[styles.stepDot, index === currentStep && styles.stepDotActive]}
            />
          ))}
        </View>

        {!currentWalkthrough.requiresAction ? (
          <View style={styles.tooltipButtons}>
            <TouchableOpacity
              style={[styles.prevButton, currentStep === 0 && styles.buttonDisabled]}
              onPress={handlePrev}
              disabled={currentStep === 0}
            >
              <Text style={[styles.prevButtonText, currentStep === 0 && styles.buttonTextDisabled]}>
                Prev
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.actionText}>{currentWalkthrough.actionText}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent={false} />
      <View style={styles.statusBar} />

      {/* Tutorial Overlay */}
      {showTutorial && (
        <>
          <View style={styles.overlay} pointerEvents="box-none" />
          {renderHighlightedCard()}
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
        <Text style={styles.title}>Send Money</Text>

        {/* Main Options Cards */}
        <View style={styles.mainCards}>
          <TouchableOpacity 
            style={[
              styles.card,
              showTutorial && currentWalkthrough.highlightSection !== "selfBank" && styles.dimmedCard
            ]}
            disabled={showTutorial}
          >
            <View style={styles.cardIcon}>
              <View style={styles.iconCircle}>
                <View style={styles.personIcon}>
                  <View style={styles.personHead} />
                  <View style={styles.personBody} />
                  <View style={styles.personPlus}>
                    <Text style={styles.plusText}>+</Text>
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.cardTitle}>To Self Bank</Text>
            <Text style={styles.cardTitle}>Account</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.card,
              showTutorial && currentWalkthrough.highlightSection !== "accountIFSC" && styles.dimmedCard
            ]}
            onPress={() => router.push("./addBenificiary")}
            disabled={showTutorial}
          >
            <View style={styles.cardIcon}>
              <View style={styles.iconCircle}>
                <View style={styles.basketIcon}>
                  <View style={styles.basketTop} />
                  <View style={styles.basketBody}>
                    <View style={styles.basketStripe} />
                    <View style={styles.basketStripe} />
                    <View style={styles.basketStripe} />
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.cardTitle}>To Account</Text>
            <Text style={styles.cardTitle}>Number & IFSC</Text>
          </TouchableOpacity>
        </View>

        {/* UPI Option */}
        <TouchableOpacity 
          style={[styles.upiOption, showTutorial && styles.dimmedSection]}
          disabled={showTutorial}
        >
          <View style={styles.upiLeft}>
            <View style={styles.upiIconCircle}>
              <Text style={styles.atSymbol}>@</Text>
            </View>
            <View style={styles.upiText}>
              <Text style={styles.upiTitle}>To UPI ID or Number</Text>
              <Text style={styles.upiSubtitle}>Transfer to any UPI app</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>

        {/* Suggested Section */}
        <View style={[styles.suggestedSection, showTutorial && styles.dimmedSection]}>
          <Text style={styles.suggestedTitle}>Suggested</Text>
          <View style={styles.suggestedList}>
            <View style={styles.suggestedItem}>
              <View style={styles.bankIconContainer}>
                <Image 
                  source={require('@/assets/images/phonepeTutorial/dhanlaxmi.png')}
                  style={styles.bankIcon}
                />
              </View>
              <Text style={styles.bankName}>Dhanlaxmi B...</Text>
              <View style={styles.bankDetails}>
                <Text style={styles.selfTag}>Self</Text>
                <Text style={styles.accountNumber}> | ••0441</Text>
              </View>
            </View>

            <View style={styles.suggestedItem}>
              <View style={[styles.bankIconContainer, styles.sbiIconContainer]}>
                <View style={styles.sbiIcon}>
                  <View style={styles.sbiCircle} />
                  <View style={styles.sbiKeyhole} />
                </View>
              </View>
              <Text style={styles.bankName}>State Bank ...</Text>
              <View style={styles.bankDetails}>
                <Text style={styles.selfTag}>Self</Text>
                <Text style={styles.accountNumber}> | ••9607</Text>
              </View>
            </View>
          </View>
        </View>

        {/* UPI Logo */}
        <View style={[styles.upiLogoContainer, showTutorial && styles.dimmedSection]}>
          <Text style={styles.poweredBy}>POWERED BY</Text>
          <Text style={styles.upiLogo}>UPI</Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  statusBar: { height: 0, backgroundColor: "#000" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 16 },
  backButton: { padding: 8 },
  helpButton: { padding: 8 },
  content: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: "#000", marginBottom: 24 },
  mainCards: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  card: { width: (width - 52) / 2, backgroundColor: "#f5f5f5", borderRadius: 16, padding: 20, alignItems: "flex-start", minHeight: 180 },
  cardIcon: { marginBottom: 16 },
  iconCircle: { width: 64, height: 64, backgroundColor: "#5f259f", borderRadius: 32, justifyContent: "center", alignItems: "center" },
  personIcon: { position: "relative", width: 32, height: 32 },
  personHead: { width: 14, height: 14, backgroundColor: "#fff", borderRadius: 7, position: "absolute", top: 2, left: 9 },
  personBody: { width: 24, height: 16, backgroundColor: "#fff", borderTopLeftRadius: 12, borderTopRightRadius: 12, position: "absolute", bottom: 0, left: 4 },
  personPlus: { position: "absolute", bottom: -2, right: -2, width: 16, height: 16, backgroundColor: "#fff", borderRadius: 8, justifyContent: "center", alignItems: "center" },
  plusText: { fontSize: 12, fontWeight: "bold", color: "#5f259f" },
  basketIcon: { width: 32, height: 32 },
  basketTop: { width: 32, height: 8, backgroundColor: "#fff", borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 2, borderColor: "#fff" },
  basketBody: { width: 32, height: 20, backgroundColor: "#fff", borderBottomLeftRadius: 12, borderBottomRightRadius: 12, paddingTop: 4, paddingHorizontal: 6 },
  basketStripe: { height: 2, backgroundColor: "#5f259f", marginVertical: 2, borderRadius: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#000", lineHeight: 22 },
  upiOption: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", paddingVertical: 20, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  upiLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  upiIconCircle: { width: 48, height: 48, backgroundColor: "#f5f5f5", borderRadius: 24, justifyContent: "center", alignItems: "center", marginRight: 16 },
  atSymbol: { fontSize: 24, fontWeight: "600", color: "#5f259f" },
  upiText: { flex: 1 },
  upiTitle: { fontSize: 16, fontWeight: "600", color: "#000", marginBottom: 2 },
  upiSubtitle: { fontSize: 14, color: "#666" },
  suggestedSection: { marginTop: 32 },
  suggestedTitle: { fontSize: 20, fontWeight: "bold", color: "#000", marginBottom: 20 },
  suggestedList: { flexDirection: "row", gap: 20 },
  suggestedItem: { alignItems: "center", width: 100 },
  bankIconContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#f5f5f5", justifyContent: "center", alignItems: "center", marginBottom: 8 },
  bankIcon: { width: 40, height: 40, resizeMode: "contain" },
  sbiIconContainer: { backgroundColor: "#1565c0" },
  sbiIcon: { width: 32, height: 32, position: "relative" },
  sbiCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 3, borderColor: "#fff" },
  sbiKeyhole: { position: "absolute", top: 12, left: 12, width: 8, height: 12, backgroundColor: "#fff", borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  bankName: { fontSize: 14, fontWeight: "500", color: "#000", marginBottom: 4 },
  bankDetails: { flexDirection: "row", alignItems: "center" },
  selfTag: { fontSize: 12, fontWeight: "600", color: "#00bfa5" },
  accountNumber: { fontSize: 12, color: "#666" },
  upiLogoContainer: { alignItems: "center", marginTop: 80, marginBottom: 20 },
  poweredBy: { fontSize: 10, color: "#999", letterSpacing: 1, marginBottom: 4 },
  upiLogo: { fontSize: 24, fontWeight: "bold", color: "#333", letterSpacing: 2 },
  bottomPadding: { height: 40 },
  // Tutorial styles
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 100 },
  dimmedCard: { opacity: 0.3 },
  dimmedSection: { opacity: 0.3 },
  highlightedCardContainer: { position: "absolute", zIndex: 101, backgroundColor: "#fff", borderRadius: 16, shadowColor: "#fff", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 30, elevation: 50 },
  highlightedSelfBank: { top: 140, left: 20 },
  highlightedAccountIFSC: { top: 140, right: 20 },
  tooltipContainer: { position: "absolute", left: width * 0.05, right: width * 0.05, backgroundColor: "#fff", borderRadius: 16, padding: 20, zIndex: 102, elevation: 60, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
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
  buttonDisabled: { backgroundColor: "#e0e0e0" },
  buttonTextDisabled: { color: "#999" },
  actionText: { textAlign: "center", padding: 8, fontSize: 16, color: "#9c27b0", fontWeight: "bold" },
});