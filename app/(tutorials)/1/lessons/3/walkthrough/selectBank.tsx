import React, { useState } from 'react';
import { 
  View, Text, TextInput, ScrollView, TouchableOpacity, StatusBar,
  StyleSheet, Modal, Platform, Dimensions
} from 'react-native';
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {useTranslation} from "react-i18next";

const { width } = Dimensions.get("window");

const bankData = {
  popular: [
    { id: 1, name: 'State Bank of India', icon: '🏦', color: '#E8EAF6' },
    { id: 2, name: 'Punjab National Bank', icon: '🏛️', color: '#FFF3E0' },
    { id: 3, name: 'Bank Of Baroda', icon: '🏦', color: '#FFE5E5' },
    { id: 4, name: 'Union Bank Of India', icon: '🏦', color: '#E1F5FE' },
    { id: 5, name: 'Canara Bank', icon: '🏦', color: '#FFF9C4' },
    { id: 6, name: 'Airtel Payments Bank Limited', icon: '🏦', color: '#FFEBEE' },
    { id: 7, name: 'Bank Of India', icon: '🏦', color: '#E3F2FD' },
    { id: 8, name: 'Central Bank Of India', icon: '🏦', color: '#FCE4EC' },
    { id: 9, name: 'HDFC Bank', icon: '🏦', color: '#FFEBEE' },
  ],
  all: [
    { id: 10, name: 'The Rayat Sevak Co-Op Bank LimitedSatara', icon: '🏛️' },
    { id: 11, name: 'ACE Cooperative Bank Ltd', icon: '🏛️' },
    { id: 12, name: 'ICICI Bank', icon: '🏛️' },
    { id: 13, name: 'Axis Bank', icon: '🏛️' },
    { id: 14, name: 'Kotak Mahindra Bank', icon: '🏛️' },
    { id: 15, name: 'Yes Bank', icon: '🏛️' },
    { id: 16, name: 'IDFC First Bank', icon: '🏛️' },
    { id: 17, name: 'IndusInd Bank', icon: '🏛️' },
    { id: 18, name: 'Federal Bank', icon: '🏛️' },
    { id: 19, name: 'South Indian Bank', icon: '🏛️' },
    { id: 20, name: 'Karur Vysya Bank', icon: '🏛️' },
    { id: 21, name: 'Dhanlaxmi Bank', icon: '🏛️', color: '#F3E5F5' },
    { id: 22, name: 'RBL Bank', icon: '🏛️' },
    { id: 23, name: 'Bandhan Bank', icon: '🏛️' },
    { id: 24, name: 'City Union Bank', icon: '🏛️' },
    { id: 25, name: 'DCB Bank', icon: '🏛️' },
    { id: 26, name: 'Jammu & Kashmir Bank', icon: '🏛️' },
    { id: 27, name: 'Karnataka Bank', icon: '🏛️' },
    { id: 28, name: 'Tamilnad Mercantile Bank', icon: '🏛️' },
    { id: 29, name: 'UCO Bank', icon: '🏛️' },
    { id: 30, name: 'Bank of Maharashtra', icon: '🏛️' },
    { id: 31, name: 'Indian Bank', icon: '🏛️' },
    { id: 32, name: 'Indian Overseas Bank', icon: '🏛️' },
    { id: 33, name: 'Punjab & Sind Bank', icon: '🏛️' },
  ]
};

const WALKTHROUGH_STEPS = [
  {
    id: 1,
    title: "bank_tutorial.select_bank1_title",
    description: "bank_tutorial.select_bank1_description",
    highlightSection: "page",
    tooltipPosition: "top",
    requiresAction: false,
  },
  {
    id: 2,
    title: "bank_tutorial.select_bank2_title",
    description: "bank_tutorial.select_bank2_description",
    highlightSection: "search",
    tooltipPosition: "middle",
    requiresAction: true,
    actionText: "bank_tutorial.select_bank2_actionText",
    validationFn: (search) => search.toLowerCase().includes("dhanlaxmi"),
  },
  {
    id: 3,
    title: "bank_tutorial.select_bank3_title",
    description: "bank_tutorial.select_bank3_description",
    highlightSection: "dhanlaxmi",
    tooltipPosition: "bottom",
    requiresAction: true,
    actionText: "bank_tutorial.select_bank3_actionText",
  },
];

export default function BankSelector() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [helpVisible, setHelpVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const currentWalkthrough = WALKTHROUGH_STEPS[currentStep];
  const allBanks = [...bankData.popular, ...bankData.all];
  const filteredBanks = search.trim() === '' ? [] : allBanks.filter(bank => bank.name.toLowerCase().includes(search.toLowerCase()));
  const showPopular = search.trim() === '';
  const displayAllBanks = showPopular ? bankData.all : filteredBanks;

  const hasTypedDhanlaxmi = search.toLowerCase().includes("dhanlaxmi");
  const canProceed = currentWalkthrough.validationFn ? currentWalkthrough.validationFn(search) : true;

  const handleSearchChange = (text) => {
    setSearch(text);
    if (showTutorial && currentStep === 1 && text.toLowerCase().includes("dhanlaxmi")) {
      setCurrentStep(2);
    }
  };

  const selectBank = (bank) => {
    if (showTutorial) return;
    router.push({
      pathname: './addBankAccountDetails',
      params: { bankName: bank.name, bankIcon: bank.icon, bankColor: bank.color || "#F5F5F7" }
    });
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      if (currentStep === 2) setSearch('');
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentWalkthrough.requiresAction && !canProceed) return;
    if (currentStep < WALKTHROUGH_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
      const dhanlaxmiBank = bankData.all.find(b => b.id === 21);
      selectBankFromTutorial(dhanlaxmiBank);
    }
  };

  const selectBankFromTutorial = (bank) => {
    router.push({
      pathname: './addBankAccountDetails',
      params: { bankName: bank.name, bankIcon: bank.icon, bankColor: bank.color || "#F5F5F7" }
    });
  };

  const renderHighlightedElement = () => {
    if (!showTutorial) return null;

    if (currentWalkthrough.highlightSection === "search") {
      return (
        <View style={styles.highlightedSearchContainer}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Search by bank name"
              placeholderTextColor="#999"
              value={search}
              onChangeText={handleSearchChange}
              style={styles.searchInput}
              autoFocus={true}
            />
          </View>
        </View>
      );
    }

    if (currentWalkthrough.highlightSection === "dhanlaxmi") {
      return (
        <View style={styles.highlightedBankContainer}>
          <TouchableOpacity onPress={handleNext} style={styles.bankListItem} activeOpacity={0.9}>
            <View style={styles.bankListIcon}>
              <Text style={styles.bankListEmoji}>🏛️</Text>
            </View>
            <Text style={styles.bankListName}>Dhanlaxmi Bank</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const renderTooltip = () => {
    if (!showTutorial) return null;

    const positionStyle = currentWalkthrough.tooltipPosition === "top" ? styles.tooltipTop
      : currentWalkthrough.tooltipPosition === "middle" ? styles.tooltipMiddle
      : styles.tooltipBottom;

    return (
      <View style={[styles.tooltipContainer, positionStyle]}>
        <Text style={styles.tooltipTitle}>{t(currentWalkthrough.title)}</Text>
        <Text style={styles.tooltipDescription}>{t(currentWalkthrough.description)}</Text>

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
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>{currentStep === WALKTHROUGH_STEPS.length - 1 ? "Select" : "Next"}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.actionText}>{t(currentWalkthrough.actionText || " ")}</Text>
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
      <View style={[styles.header, showTutorial && currentWalkthrough.highlightSection !== "page" && styles.dimmedContent]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} disabled={showTutorial}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <TouchableOpacity style={styles.helpButton} onPress={() => setHelpVisible(true)} disabled={showTutorial}>
          <View style={styles.helpIconContainer}>
            <Text style={styles.helpIcon}>?</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={[styles.titleContainer, showTutorial && currentWalkthrough.highlightSection !== "page" && styles.dimmedContent]}>
        <Text style={styles.title}>Select receiver Bank</Text>
      </View>

      {/* Search Bar (normal) */}
      {currentWalkthrough.highlightSection !== "search" && (
        <View style={[styles.searchContainer, showTutorial && styles.dimmedContent]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search by bank name"
            placeholderTextColor="#999"
            value={search}
            onChangeText={handleSearchChange}
            style={styles.searchInput}
            editable={!showTutorial}
          />
        </View>
      )}

      {/* Bank Lists */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} scrollEnabled={!showTutorial}>
        {showPopular && (
          <>
            <View style={[styles.sectionHeader, showTutorial && styles.dimmedContent]}>
              <Text style={styles.sectionTitle}>POPULAR BANKS</Text>
            </View>
            <View style={[styles.popularGrid, showTutorial && styles.dimmedContent]}>
              {bankData.popular.map((bank) => (
                <TouchableOpacity key={bank.id} onPress={() => selectBank(bank)} style={styles.popularBankItem} activeOpacity={0.7} disabled={showTutorial}>
                  <View style={[styles.popularBankIcon, { backgroundColor: bank.color }]}>
                    <Text style={styles.bankEmoji}>{bank.icon}</Text>
                  </View>
                  <Text style={styles.popularBankName} numberOfLines={2}>{bank.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <View style={[styles.sectionHeader, showTutorial && currentWalkthrough.highlightSection !== "dhanlaxmi" && styles.dimmedContent]}>
          <Text style={styles.sectionTitle}>{showPopular ? "ALL BANKS" : "SEARCH RESULTS"}</Text>
        </View>

        <View style={styles.allBanksContainer}>
          {displayAllBanks.length > 0 ? (
            displayAllBanks.map((bank) => {
              const isDhanlaxmi = bank.name === "Dhanlaxmi Bank";
              const shouldHide = showTutorial && currentWalkthrough.highlightSection === "dhanlaxmi" && isDhanlaxmi;
              return (
                <TouchableOpacity
                  key={bank.id}
                  onPress={() => selectBank(bank)}
                  style={[
                    styles.bankListItem,
                    showTutorial && currentWalkthrough.highlightSection === "dhanlaxmi" && !isDhanlaxmi && styles.dimmedContent,
                    shouldHide && styles.hiddenBank
                  ]}
                  activeOpacity={0.7}
                  disabled={showTutorial}
                >
                  <View style={styles.bankListIcon}>
                    <Text style={styles.bankListEmoji}>{bank.icon}</Text>
                  </View>
                  <Text style={styles.bankListName}>{bank.name}</Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={[styles.noResults, showTutorial && styles.dimmedContent]}>
              <Text style={styles.noResultsText}>No banks found matching "{search}"</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Help Modal */}
      <Modal visible={helpVisible && !showTutorial} transparent animationType="fade" onRequestClose={() => setHelpVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Bank Transfer Help</Text>
            <Text style={styles.modalDesc}>Select the bank where the receiver holds their account. You will be asked to enter the Account Number and IFSC. PhonePe will securely transfer the money using UPI or IMPS instantly.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setHelpVisible(false)}>
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, justifyContent: 'space-between', backgroundColor: '#fff' },
  backButton: { padding: 8 },
  backIcon: { fontSize: 28, color: "#000", fontWeight: "300" },
  headerSpacer: { flex: 1 },
  helpButton: { padding: 8 },
  helpIconContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#F5F5F5", justifyContent: "center", alignItems: "center" },
  helpIcon: { fontSize: 18, color: "#000", fontWeight: "600" },
  titleContainer: { paddingHorizontal: 24, paddingBottom: 20, paddingTop: 4 },
  title: { fontSize: 26, fontWeight: "700", color: "#000" },
  searchContainer: { marginHorizontal: 24, marginBottom: 24, backgroundColor: "#F5F5F7", borderRadius: 12, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: Platform.OS === "ios" ? 14 : 10 },
  searchIcon: { fontSize: 20, color: "#666", marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: "#000" },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  sectionHeader: { paddingHorizontal: 24, marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: "600", color: "#9E9E9E" },
  popularGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, marginBottom: 32 },
  popularBankItem: { width: "33.33%", alignItems: "center", marginBottom: 28, paddingHorizontal: 4 },
  popularBankIcon: { width: 68, height: 68, borderRadius: 34, justifyContent: "center", alignItems: "center", marginBottom: 10, borderWidth: 1, borderColor: "transparent" },
  bankEmoji: { fontSize: 32 },
  popularBankName: { fontSize: 13, textAlign: "center", color: "#424242", lineHeight: 18 },
  allBanksContainer: { paddingHorizontal: 24 },
  bankListItem: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  bankListIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#F5F5F7", justifyContent: "center", alignItems: "center", marginRight: 16 },
  bankListEmoji: { fontSize: 26 },
  bankListName: { flex: 1, fontSize: 16, color: "#000" },
  noResults: { paddingVertical: 60, alignItems: "center" },
  noResultsText: { fontSize: 16, color: "#9E9E9E" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  modalBox: { width: "85%", backgroundColor: "#fff", borderRadius: 14, padding: 20, elevation: 6 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#000" },
  modalDesc: { fontSize: 15, color: "#444", lineHeight: 21, marginBottom: 20 },
  modalButton: { backgroundColor: "#5f259f", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  modalButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  // Tutorial styles
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", zIndex: 100 },
  dimmedContent: { opacity: 0.3 },
  hiddenBank: { opacity: 0 },
  highlightedSearchContainer: { position: "absolute", top: 140, left: 5, right: 5, zIndex: 101, shadowColor: "#fff", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 30, elevation: 50 },
  highlightedBankContainer: { position: "absolute", top: 360, left: 24, right: 24, zIndex: 101, backgroundColor: "#fff", borderRadius: 8, shadowColor: "#fff", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 30, elevation: 50 },
  tooltipContainer: { position: "absolute", left: "5%", right: "5%", backgroundColor: "#fff", borderRadius: 16, padding: 20, zIndex: 102, elevation: 60, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  tooltipTop: { top: 220 },
  tooltipMiddle: { top: 260 },
  tooltipBottom: { top: 480 },
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