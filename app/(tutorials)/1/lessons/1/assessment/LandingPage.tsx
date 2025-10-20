// PhonePe Landing Page - React Native with Expo Router
// File: app/(main)/index.tsx

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
// Lucide React Native icons
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

const { width, height } = Dimensions.get("window");

export default function PhonePeLanding() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showHeader, setShowHeader] = useState(false);

  // Animated values for header fade-in
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 150],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  // Banner scroll effect
  const bannerTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -100],
    extrapolate: "clamp",
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowHeader(offsetY > 120);
      },
    }
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar} />

      <Animated.View style={styles.scrollHeader}>
        {/* Background fading layer */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: headerOpacity,
              backgroundColor: "#fff",
            },
          ]}
        />

        {/* Foreground content (icons stay constant, text fades in) */}
        <View style={[styles.headerContent, { zIndex: 1 }]}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileText}>*</Text>
          </View>

          {/* Animated text opacity */}
          <Animated.Text
            style={[styles.headerTitle, { opacity: headerOpacity }]}
          >
            PhonePe
          </Animated.Text>

          <View style={styles.helpIcon}>
            <HelpCircle size={20} color="#5f259f" />
          </View>
        </View>
      </Animated.View>

      {/* Fixed Purple Banner at Top */}
      <Animated.View
        style={[
          styles.purpleBanner,
          { transform: [{ translateY: bannerTranslateY }] },
        ]}
      >
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
      >
        {/* White Content Card */}
        <View style={styles.whiteCard}>
          {/* Money Transfers Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Money Transfers</Text>
            <View style={styles.iconRow}>
              <View style={styles.iconButton}>
                <View style={styles.iconCircle}>
                  <View style={styles.iconBox}>
                    <Phone size={30} color="#491359ff" />

                    <View style={styles.activeDot} />
                  </View>
                </View>
                <Text style={styles.iconLabel}>To Mobile{"\n"}Number</Text>
              </View>

              <View style={styles.iconButton}>
                <View style={styles.iconCircle}>
                  <View style={styles.iconBox}>
                    <Building2 size={30} color="#491359ff" />
                  </View>
                </View>
                <Text style={styles.iconLabel}>To Bank &{"\n"}Self A/c</Text>
              </View>

              <View style={styles.iconButton}>
                <View style={styles.iconCircle}>
                  <View style={styles.iconBox}>
                    <Megaphone size={30} color="#491359ff" />
                  </View>
                </View>
                <Text style={styles.iconLabel}>Refer & Get{"\n"}₹200</Text>
              </View>

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

          {/* Recharge & Bills Section */}
          <View style={styles.section2}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recharge & Bills</Text>
              <View>
                <Text style={styles.viewAllText}>View All</Text>
              </View>
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

          {/* Cards Grid */}
          <View style={styles.cardsGrid}>
            {/* Row 1 */}
            <View style={styles.cardRow}>
              <TouchableOpacity style={styles.card}>
                <Text style={styles.cardTitle}>Loans</Text>
                <Text style={styles.cardSubtitle}>Personal, Gold and More</Text>
                <Image source={require('@/assets/images/phonepeTutorial/loan.png')} style={styles.cardImage} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.card}>
                <Text style={styles.cardTitle}>Insurance</Text>
                <Text style={styles.offerText}>Offer</Text>
                <Image source={require('@/assets/images/phonepeTutorial/insurance.png')} style={styles.cardImage} />
              </TouchableOpacity>
            </View>

            {/* Row 2 */}
            <View style={styles.cardRow}>
              <TouchableOpacity style={styles.card}>
                <Text style={styles.cardTitle}>Digital Gold</Text>
                <Text style={styles.cardSubtitle}>Save ₹10 daily</Text>
                <Image source={require('@/assets/images/phonepeTutorial/savings.png')} style={styles.cardImage} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.card}>
                <Text style={styles.cardTitle}>Travel & Transit</Text>
                <Text style={styles.cardSubtitle}>
                  Flight, Train, Bus, Hotel, Metro
                </Text>
                  <Text style={styles.offerText}>Hotels Sale</Text>
                <Image source={require('@/assets/images/phonepeTutorial/travel.png')} style={styles.cardImage} />
              </TouchableOpacity>
            </View>

            {/* Row 3 */}
            <View style={styles.cardRow}>
              <TouchableOpacity style={styles.cardFull}>
                <Text style={styles.cardTitle}>Mutual Funds</Text>
                <Text style={styles.cardSubtitle}>SIPs & Investments</Text>
                <Image source={require('@/assets/images/phonepeTutorial/mutual_funds.png')} style={styles.cardImage} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Manage Payments Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Manage Payments</Text>
              <View>
                <Text style={styles.viewAllText}>View All</Text>
              </View>
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

          {/* Bottom padding for navigation bar */}
          <View style={styles.bottomPadding} />
        </View>
      </Animated.ScrollView>

      {/* Fixed Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Home size={24} color="#000" />
          <Text style={styles.navLabel}>Home</Text>
        </View>

        <View style={styles.navItem}>
          <Search size={24} color="#999" />
          <Text style={styles.navLabelInactive}>Search</Text>
        </View>

        <TouchableOpacity
          style={styles.navItemCenter}
          onPress={() => router.push("./qrScanning")}
        >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 80,
    backgroundColor: "black",
  },
  profileButton: {
    width: 50,
    height: 50,
  },
  profileIcon: {
    width: 50,
    height: 50,
    backgroundColor: "#e6b800",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  helpButton: {
    width: 50,
    height: 50,
  },
  helpIcon: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.91)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 99,
    paddingTop: 16,
    justifyContent: "center",
    backgroundColor: "transparent", // make sure parent has no solid bg
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 1, // ensure this stays above the fading bg
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
  },
  bannerSpacer: {
    height: 240,
  },
  whiteCard: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    minHeight: height,
    marginTop: 240,
    zIndex: 99,
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 8,
  },
  section2: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  viewAllText: {
    fontSize: 16,
    color: "#5f259f",
    fontWeight: "600",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  iconButton: {
    alignItems: "center",
    width: 80,
  },
  iconCircle: {
    overflow: "hidden",
    width: 60,
    height: 60,
    backgroundColor: "#5f259f",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  iconBox: {
    marginTop: 28,
    backgroundColor: "#ebd8feff",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: "50%",
    borderBottomRightRadius: "50%",
    padding: 4,
    paddingTop: 8,
    width: 40,
    height: 60,
  },
  iconCircleWhite: {
    width: 60,
    height: 60,
    backgroundColor: "#ffffffff",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  activeDot: {
    position: "absolute",
    top: -2,
    right: -1,
    width: 12,
    height: 12,
    backgroundColor: "#00e676",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  iconLabel: {
    fontSize: 12,
    textAlign: "center",
    color: "#000",
    lineHeight: 16,
  },
  cardsGrid: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    width: (width - 44) / 2,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    minHeight: 90,
    position: "relative",
  },
  cardFull: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    minHeight: 90,
    position: "relative",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  cardImage: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    mixBlendMode: "multiply"
  },
  offerText: {
    fontSize: 11,
    color: "#5f259f",
    backgroundColor: "#e8d5ff",
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: 8,
    fontWeight: "bold",
  },
  paymentCards: {
    marginTop: 16,
  },
  paymentCardPlaceholder: {
    height: 100,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  popularBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#ff4444",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "600",
  },
  bottomPadding: {
    height: 100,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingBottom: 10,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  navItemCenter: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
  },
  navIconCenter: {
    width: 56,
    height: 56,
    backgroundColor: "#5f259f",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  navLabel: {
    fontSize: 12,
    color: "#000",
    fontWeight: "600",
  },
  navLabelInactive: {
    fontSize: 12,
    color: "#999",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#00c853",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
});
