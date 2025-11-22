// FINAL UPDATED PhonePe Landing Page - React Native with Expo Router

import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  BadgePercent,
  Bell,
  Building2,
  Car,
  Clock,
  HelpCircle,
  Home,
  Lightbulb,
  Megaphone,
  Phone,
  QrCode,
  Search,
  Smartphone,
  Wallet,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");

// -------------------------------------------------------
// MODULAR WALKTHROUGH STEPS
// -------------------------------------------------------
const WALKTHROUGH_STEPS = [
  {
    id: 1,
    title: "bank_tutorial.landing_title",
    description:
      "bank_tutorial.landing_description",
    target: {
      top: 310,
      left: width * 0.25 + 10,
      width: 80,
      height: 80,
    },
    tooltipPosition: {
      top: 420,
      left: width * 0.05,
      width: width * 0.90,
    },
  },
];

export default function PhonePeLanding() {
  const{t} = useTranslation();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [showHeader, setShowHeader] = useState(false);

  // Tutorial state
  const [currentStep, setCurrentStep] = useState(0);
  const tutorialActive = currentStep < WALKTHROUGH_STEPS.length;
  const step = WALKTHROUGH_STEPS[currentStep];

  // Header fade animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 150],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  // Banner parallax
  const bannerTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -100],
    extrapolate: "clamp",
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowHeader(offsetY > 120);
      },
    }
  );

  // Reusable icon content
  const BankIconContent = ({ highlighted = false }) => (
    <View style={[styles.iconButton, highlighted && styles.highlightedIconButton]}>
      <View style={styles.iconCircle}>
        <View style={styles.iconBox}>
          <Building2 size={30} color="#491359ff" />
        </View>
      </View>
      <Text
        style={[
          styles.iconLabel,
          highlighted && { color: "#000" },
        ]}
      >
        To Bank &{"\n"}Self A/c
      </Text>
    </View>
  );

  // Click on highlighted tutorial icon → close tutorial only
  const closeTutorial = () => {
    setCurrentStep(WALKTHROUGH_STEPS.length);

  };

  return (
    <View style={styles.container}>
      {/* -------------------------------------------------------
            TUTORIAL OVERLAY (ON TOP OF UI)
         ------------------------------------------------------- */}
      {tutorialActive && step && (
        <>
          {/* Dim background */}
          <View style={styles.overlay} />

          {/* Enlarged Highlight Box */}
          <View
            style={{
              position: "absolute",
              top: step.target.top - 10,
              left: step.target.left - 10,
              width: step.target.width + 20,
              height: step.target.height + 20,
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 26,
              zIndex: 101,
              shadowColor: "#fff",
              shadowOpacity: 1,
              shadowRadius: 35,
              elevation: 60,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                closeTutorial();
                router.push("./chooseService");
              }}
            >
              <BankIconContent highlighted />
            </TouchableOpacity>
          </View>

          {/* Tooltip */}
          <View
            style={[
              styles.tooltipContainer,
              {
                top: step.tooltipPosition.top,
                left: step.tooltipPosition.left,
                width: step.tooltipPosition.width,
              },
            ]}
          >
            <Text style={styles.tooltipTitle}>{t(step.title)}</Text>
            <Text style={styles.tooltipDescription}>{t(step.description)}</Text>

            {/* Plain Left-aligned Text */}
            <Text style={styles.proceedNoteText}>
              Click on the icon to proceed
            </Text>
          </View>
        </>
      )}

      {/* -------------------------------------------------------
            MAIN UI
         ------------------------------------------------------- */}

      <View style={styles.topBar} />

      <Animated.View style={styles.scrollHeader}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: headerOpacity, backgroundColor: "#fff" }]}
        />
        <View style={styles.headerContent}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileText}>*</Text>
          </View>

          <Animated.Text style={[styles.headerTitle, { opacity: headerOpacity }]}>
            PhonePe
          </Animated.Text>

          <View style={styles.helpIcon}>
            <HelpCircle size={20} color="#5f259f" />
          </View>
        </View>
      </Animated.View>

      {/* Purple Banner */}
      <Animated.View style={[styles.purpleBanner, { transform: [{ translateY: bannerTranslateY }] }]}>
        <Animated.Image
          source={require("@/assets/images/phonepeTutorial/banner.png")}
          style={[
            styles.backgroundImage,
            {
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, 250],
                    outputRange: [0, -100],
                    extrapolate: "clamp",
                  }),
                },
              ],
              opacity: scrollY.interpolate({
                inputRange: [0, 200],
                outputRange: [1, 0],
                extrapolate: "clamp",
              }),
            },
          ]}
        />
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!tutorialActive}
      >
        <View style={styles.whiteCard}>
          {/* Money Transfers Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Money Transfers</Text>

            <View style={styles.iconRow}>
              {/* To Mobile */}
              <View style={styles.iconButton}>
                <View style={styles.iconCircle}>
                  <View style={styles.iconBox}>
                    <Phone size={30} color="#491359ff" />
                    <View style={styles.activeDot} />
                  </View>
                </View>
                <Text style={styles.iconLabel}>To Mobile{"\n"}Number</Text>
              </View>

              {/* To Bank - real icon (navigation enabled) */}
              <TouchableOpacity
                style={[styles.iconButton, tutorialActive && styles.hiddenIcon]}
                onPress={() => router.push("./chooseService")}
              >
                <View style={styles.iconCircle}>
                  <View style={styles.iconBox}>
                    <Building2 size={30} color="#491359ff" />
                  </View>
                </View>
                <Text style={styles.iconLabel}>To Bank &{"\n"}Self A/c</Text>
              </TouchableOpacity>

              {/* Refer */}
              <View style={styles.iconButton}>
                <View style={styles.iconCircle}>
                  <View style={styles.iconBox}>
                    <Megaphone size={30} color="#491359ff" />
                  </View>
                </View>
                <Text style={styles.iconLabel}>Refer & Get{"\n"}₹200</Text>
              </View>

              {/* Balance */}
              <View style={styles.iconButton}>
                <View style={styles.iconCircle}>
                  <View style={styles.iconBox}>
                    <Wallet size={30} color="#491359ff" />
                  </View>
                </View>
                <Text style={styles.iconLabel}>Check{"\n"}Balance</Text>
              </View>
            </View>
          </View>

          {/* Recharge & Bills */}
          <View style={styles.section2}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recharge & Bills</Text>
              <Text style={styles.viewAllText}>View All</Text>
            </View>

            <View style={styles.iconRow}>
              <View style={styles.iconButton}>
                <View style={styles.iconCircleWhite}>
                  <Smartphone size={36} color="#5f259f" />
                </View>
                <Text style={styles.iconLabel}>Mobile{"\n"}Recharge</Text>
              </View>
              <View style={styles.iconButton}>
                <View style={styles.iconCircleWhite}>
                  <Car size={36} color="#5f259f" />
                </View>
                <Text style={styles.iconLabel}>FASTag{"\n"}Recharge</Text>
              </View>
              <View style={styles.iconButton}>
                <View style={styles.iconCircleWhite}>
                  <Lightbulb size={36} color="#5f259f" />
                </View>
                <Text style={styles.iconLabel}>Electricity{"\n"}Bill</Text>
              </View>
              <View style={styles.iconButton}>
                <View style={styles.iconCircleWhite}>
                  <BadgePercent size={36} color="#5f259f" />
                </View>
                <Text style={styles.iconLabel}>Loan{"\n"}Repayment</Text>
              </View>
            </View>
          </View>

          {/* Cards */}
          <View style={styles.cardsGrid}>
            <View style={styles.cardRow}>
              <TouchableOpacity style={styles.card}>
                <Text style={styles.cardTitle}>Loans</Text>
                <Text style={styles.cardSubtitle}>Personal, Gold and More</Text>
                <Image source={require("@/assets/images/phonepeTutorial/loan.png")} style={styles.cardImage} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.card}>
                <Text style={styles.cardTitle}>Insurance</Text>
                <Text style={styles.offerText}>Offer</Text>
                <Image source={require("@/assets/images/phonepeTutorial/insurance.png")} style={styles.cardImage} />
              </TouchableOpacity>
            </View>

            <View style={styles.cardRow}>
              <TouchableOpacity style={styles.card}>
                <Text style={styles.cardTitle}>Digital Gold</Text>
                <Text style={styles.cardSubtitle}>Save ₹10 daily</Text>
                <Image source={require("@/assets/images/phonepeTutorial/savings.png")} style={styles.cardImage} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.card}>
                <Text style={styles.cardTitle}>Travel & Transit</Text>
                <Text style={styles.cardSubtitle}>Flight, Train, Bus, Hotel, Metro</Text>
                <Text style={styles.offerText}>Hotels Sale</Text>
                <Image source={require("@/assets/images/phonepeTutorial/travel.png")} style={styles.cardImage} />
              </TouchableOpacity>
            </View>

            <View style={styles.cardRow}>
              <TouchableOpacity style={styles.cardFull}>
                <Text style={styles.cardTitle}>Mutual Funds</Text>
                <Text style={styles.cardSubtitle}>SIPs & Investments</Text>
                <Image source={require("@/assets/images/phonepeTutorial/mutual_funds.png")} style={styles.cardImage} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Manage Payments */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Manage Payments</Text>
              <Text style={styles.viewAllText}>View All</Text>
            </View>

            <View style={styles.paymentCards}>
              <View style={styles.paymentCardPlaceholder}>
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Popular</Text>
                </View>
                <Text>Payment Cards</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Home size={24} color="#000" />
          <Text style={styles.navLabel}>Home</Text>
        </View>
        <View style={styles.navItem}>
          <Search size={24} color="#999" />
          <Text style={styles.navLabelInactive}>Search</Text>
        </View>
        <TouchableOpacity style={styles.navItemCenter} onPress={() => router.push("./qrScanning")}>
          <View style={styles.navIconCenter}>
            <QrCode size={32} color="#fff" />
          </View>
        </TouchableOpacity>
        <View style={styles.navItem}>
          <Bell size={24} color="#999" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
          <Text style={styles.navLabelInactive}>Alerts</Text>
        </View>
        <View style={styles.navItem}>
          <Clock size={24} color="#999" />
          <Text style={styles.navLabelInactive}>History</Text>
        </View>
      </View>
    </View>
  );
}

// -------------------------------------------------------
// STYLES
// -------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    zIndex: 100,
  },

  topBar: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 28,
    backgroundColor: "black",
    zIndex: 80,
  },

  scrollHeader: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 80,
    zIndex: 99,
    paddingTop: 16,
  },

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },

  profileIcon: {
    width: 50,
    height: 50,
    backgroundColor: "#e6b800",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  profileText: { fontSize: 28, color: "#fff", fontWeight: "bold" },

  helpIcon: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.91)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },

  purpleBanner: {
    position: "absolute",
    top: 24,
    left: 0,
    right: 0,
    height: 240,
    zIndex: 1,
  },

  backgroundImage: {
    width: "100%", height: "100%", objectFit: "cover",
  },

  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 0 },

  whiteCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 240,
    minHeight: height,
  },

  section: { padding: 20, backgroundColor: "#fff", marginBottom: 8 },
  section2: { padding: 20, margin: 10, backgroundColor: "#f5f5f5", borderRadius: 10 },

  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginBottom: 20,
  },

  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#000" },
  viewAllText: { color: "#5f259f", fontSize: 16 },

  iconRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 20 },

  iconButton: { alignItems: "center", width: 80 },

  iconCircle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: "#5f259f",
    justifyContent: "center", alignItems: "center",
    marginBottom: 8,
  },

  iconBox: {
    marginTop: 28,
    backgroundColor: "#ebd8feff",
    padding: 4,
    // paddingTop: 8,
    width: 40,
    // height: 60,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  iconCircleWhite: {
    width: 60, height: 60, borderRadius: 30,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 8,
  },

  iconLabel: {
    fontSize: 12,
    textAlign: "center",
    color: "#000",
    lineHeight: 16,
  },

  hiddenIcon: {
    opacity: 0,
  },

  activeDot: {
    position: "absolute",
    top: -2, right: -1,
    width: 12, height: 12,
    backgroundColor: "#00e676",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },

  cardsGrid: { paddingHorizontal: 16, paddingVertical: 8 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },

  card: {
    width: (width - 44) / 2,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    minHeight: 90,
    position: "relative",
  },

  cardFull: {
    width: "100%",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    minHeight: 90,
    position: "relative",
  },

  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: "#666", marginBottom: 8 },

  cardImage: {
    position: "absolute",
    bottom: 0, right: 0,
    width: 60, height: 60,
  },

  offerText: {
    fontSize: 11,
    color: "#5f259f",
    backgroundColor: "#e8d5ff",
    padding: 5,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  paymentCards: { marginTop: 16 },

  paymentCardPlaceholder: {
    height: 100,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  popularBadge: {
    position: "absolute", top: 12, left: 12,
    backgroundColor: "#ff4444",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  popularText: { color: "#fff", fontWeight: "600", fontSize: 11 },

  bottomNav: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },

  navItem: { alignItems: "center" },
  navItemCenter: { alignItems: "center", marginTop: -20 },

  navIconCenter: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#5f259f",
    justifyContent: "center",
    alignItems: "center",
  },

  navLabel: { color: "#000", fontWeight: "600", fontSize: 12 },
  navLabelInactive: { color: "#999", fontSize: 12 },

  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#00c853",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },

  // Tooltip
  tooltipContainer: {
    position: "absolute",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    zIndex: 102,
    elevation: 60,
  },

  tooltipTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  tooltipDescription: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },

  proceedNoteText: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: "600",
    color: "#5f259f",
    textAlign: "left",
  },
});
