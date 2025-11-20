import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  StyleSheet,
  Modal,
  Platform
} from 'react-native';
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    { id: 21, name: 'Dhanlaxmi Bank', icon: '🏛️' },
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

export default function BankSelector() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [helpVisible, setHelpVisible] = useState(false);

  const allBanks = [...bankData.popular, ...bankData.all];

  const filteredBanks = search.trim() === '' 
    ? [] 
    : allBanks.filter(bank => bank.name.toLowerCase().includes(search.toLowerCase()));

  const showPopular = search.trim() === '';
  const displayAllBanks = showPopular ? bankData.all : filteredBanks;

  // ⭐ FUNCTION TO NAVIGATE WITH PARAMS
  const selectBank = (bank) => {
    router.push({
      pathname: './addBankAccountDetails',
      params: {
        bankName: bank.name,
        bankIcon: bank.icon,
        bankColor: bank.color || "#F5F5F7",
      }
    });
  };

  return (
    <View style={styles.container}>

      <StatusBar 
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={true}
      />

      {/* Safe Top Area */}
      <View style={{ height: insets.top, backgroundColor: "#fff" }} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerSpacer} />

        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => setHelpVisible(true)}
        >
          <View style={styles.helpIconContainer}>
            <Text style={styles.helpIcon}>?</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* TITLE */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Select receiver Bank</Text>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Search by bank name"
          placeholderTextColor="#999999"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* BANK LISTS */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* POPULAR BANKS */}
        {showPopular && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>POPULAR BANKS</Text>
            </View>

            <View style={styles.popularGrid}>
              {bankData.popular.map((bank) => (
                <TouchableOpacity
                  key={bank.id}
                  onPress={() => selectBank(bank)}
                  style={styles.popularBankItem}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.popularBankIcon,
                    { backgroundColor: bank.color }
                  ]}>
                    <Text style={styles.bankEmoji}>{bank.icon}</Text>
                  </View>
                  <Text style={styles.popularBankName} numberOfLines={2}>
                    {bank.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* ALL BANKS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {showPopular ? "ALL BANKS" : "SEARCH RESULTS"}
          </Text>
        </View>

        {/* LIST BANKS */}
        <View style={styles.allBanksContainer}>
          {displayAllBanks.length > 0 ? (
            displayAllBanks.map((bank) => (
              <TouchableOpacity
                key={bank.id}
                onPress={() => selectBank(bank)}
                style={[
                  styles.bankListItem
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.bankListIcon}>
                  <Text style={styles.bankListEmoji}>{bank.icon}</Text>
                </View>

                <Text style={styles.bankListName}>{bank.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                No banks found matching "{search}"
              </Text>
            </View>
          )}
        </View>

      </ScrollView>

      {/* HELP POPUP */}
      <Modal
        visible={helpVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setHelpVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Bank Transfer Help</Text>

            <Text style={styles.modalDesc}>
              Select the bank where the receiver holds their account. You will 
              be asked to enter the Account Number and IFSC. PhonePe will 
              securely transfer the money using UPI or IMPS instantly.
            </Text>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setHelpVisible(false)}
            >
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },

  backButton: { padding: 8 },
  backIcon: { fontSize: 28, color: "#000", fontWeight: "300" },

  headerSpacer: { flex: 1 },

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

  titleContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
  },

  searchContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
  },
  searchIcon: { fontSize: 20, color: "#666", marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: "#000" },

  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9E9E9E",
  },

  popularGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginBottom: 32,
  },

  popularBankItem: {
    width: "33.33%",
    alignItems: "center",
    marginBottom: 28,
    paddingHorizontal: 4,
  },

  popularBankIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },

  bankEmoji: { fontSize: 32 },
  popularBankName: {
    fontSize: 13,
    textAlign: "center",
    color: "#424242",
    lineHeight: 18,
  },

  allBanksContainer: {
    paddingHorizontal: 24,
  },

  bankListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  bankListIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  bankListEmoji: { fontSize: 26 },
  bankListName: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },

  noResults: {
    paddingVertical: 60,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: "#9E9E9E",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    elevation: 6,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#000",
  },

  modalDesc: {
    fontSize: 15,
    color: "#444",
    lineHeight: 21,
    marginBottom: 20,
  },

  modalButton: {
    backgroundColor: "#5f259f",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
