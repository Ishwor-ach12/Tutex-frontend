// accountNumberIFSC.tsx - PhonePe Account Number & IFSC Screen

import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from "react-native";
import { ArrowLeft, HelpCircle, Plus } from "lucide-react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");

export default function AccountNumberIFSC() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Status Bar Configuration */}
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#fff" 
        translucent={true}
      />

      {/* Safe Area Top Spacer */}
      <View style={[styles.statusBarSpacer, { height: insets.top }]} />

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
        <Text style={styles.title}>To Account Number & IFSC</Text>

        {/* Saved Bank Accounts Section */}
        <View style={styles.savedSection}>
          <Text style={styles.savedTitle}>SAVED BANK ACCOUNTS</Text>
        </View>

        {/* Empty State - No saved accounts shown */}
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No saved bank accounts yet</Text>
        </View>

      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        {/* UPI Logo - Left Side */}
        <View style={styles.upiLogoContainer}>
          <Text style={styles.poweredBy}>POWERED BY</Text>
          <Text style={styles.upiLogo}>UPI</Text>
        </View>

        {/* Add Bank Account Button - Right Side */}
        <TouchableOpacity style={styles.addButton}
        onPress={() => router.push("./selectBank")}>
          <Plus size={20} color="#fff" strokeWidth={2.5} />
          <Text style={styles.addButtonText}>Bank Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  statusBarSpacer: {
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 32,
  },
  savedSection: {
    marginBottom: 16,
  },
  savedTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  upiLogoContainer: {
    alignItems: "flex-start",
  },
  poweredBy: {
    fontSize: 9,
    color: "#999",
    letterSpacing: 1,
    marginBottom: 2,
  },
  upiLogo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    letterSpacing: 2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5f259f",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});