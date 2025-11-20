// chooseService.tsx - PhonePe Send Money Screen

import { useRouter } from "expo-router";
import React from "react";
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

export default function SendMoney() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Status Bar Configuration */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#000" 
        translucent={false}
      />
      
      {/* Top Status Bar Spacer */}
      <View style={styles.statusBar} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.helpButton}>
          <HelpCircle size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Send Money</Text>

        {/* Main Options Cards */}
        <View style={styles.mainCards}>
          <TouchableOpacity style={styles.card}>
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

          <TouchableOpacity style={styles.card} onPress={() => router.push("./addBenificiary")}>
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
        <TouchableOpacity style={styles.upiOption}>
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
        <View style={styles.suggestedSection}>
          <Text style={styles.suggestedTitle}>Suggested</Text>
          
          <View style={styles.suggestedList}>
            {/* Dhanlaxmi Bank */}
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

            {/* State Bank */}
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

        {/* UPI Logo at bottom */}
        <View style={styles.upiLogoContainer}>
          <Text style={styles.poweredBy}>POWERED BY</Text>
          <Text style={styles.upiLogo}>UPI</Text>
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  statusBar: {
    height: 0, // No extra spacer needed with translucent={false}
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  helpButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 24,
  },
  mainCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    width: (width - 52) / 2,
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 20,
    alignItems: "flex-start",
    minHeight: 180,
  },
  cardIcon: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    backgroundColor: "#5f259f",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  personIcon: {
    position: "relative",
    width: 32,
    height: 32,
  },
  personHead: {
    width: 14,
    height: 14,
    backgroundColor: "#fff",
    borderRadius: 7,
    position: "absolute",
    top: 2,
    left: 9,
  },
  personBody: {
    width: 24,
    height: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    position: "absolute",
    bottom: 0,
    left: 4,
  },
  personPlus: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#5f259f",
  },
  basketIcon: {
    width: 32,
    height: 32,
  },
  basketTop: {
    width: 32,
    height: 8,
    backgroundColor: "#fff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  basketBody: {
    width: 32,
    height: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingTop: 4,
    paddingHorizontal: 6,
  },
  basketStripe: {
    height: 2,
    backgroundColor: "#5f259f",
    marginVertical: 2,
    borderRadius: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    lineHeight: 22,
  },
  upiOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  upiLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  upiIconCircle: {
    width: 48,
    height: 48,
    backgroundColor: "#f5f5f5",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  atSymbol: {
    fontSize: 24,
    fontWeight: "600",
    color: "#5f259f",
  },
  upiText: {
    flex: 1,
  },
  upiTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  upiSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  suggestedSection: {
    marginTop: 32,
  },
  suggestedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  suggestedList: {
    flexDirection: "row",
    gap: 20,
  },
  suggestedItem: {
    alignItems: "center",
    width: 100,
  },
  bankIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  bankIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  sbiIconContainer: {
    backgroundColor: "#1565c0",
  },
  sbiIcon: {
    width: 32,
    height: 32,
    position: "relative",
  },
  sbiCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#fff",
  },
  sbiKeyhole: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 8,
    height: 12,
    backgroundColor: "#fff",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  bankName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  bankDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  selfTag: {
    fontSize: 12,
    fontWeight: "600",
    color: "#00bfa5",
  },
  accountNumber: {
    fontSize: 12,
    color: "#666",
  },
  upiLogoContainer: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: 20,
  },
  poweredBy: {
    fontSize: 10,
    color: "#999",
    letterSpacing: 1,
    marginBottom: 4,
  },
  upiLogo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    letterSpacing: 2,
  },
  bottomPadding: {
    height: 40,
  },
});