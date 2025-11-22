// SendMoney.tsx - React Native with Expo

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Search,
    HelpCircle,
    ChevronRight,
    RefreshCw,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Sample payment data
const payments = [
    { id: 1, name: 'Vivek', amount: 20, type: 'received', date: '22/10', phone: '9876543210', avatar: '👨' },
    { id: 2, name: ' Sumeet', amount: 160, type: 'sent', date: '20/10', phone: '7894561230', avatar: '👤' },
    { id: 3, name: 'Samip', amount: 69, type: 'sent', date: '20/10', phone: '9090909090', avatar: '👨‍💼' },
    { id: 4, name: 'Purab', amount: 343, type: 'received', date: '03/10', phone: '9988776655', avatar: 'P', isActive: true },

];

export default function SendMoney() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPayments, setFilteredPayments] = useState(payments);
    const [currentStep, setCurrentStep] = useState<number>(4)

    const handleSearch = (text: string) => {
        setSearchQuery(text);

        if (text.trim() === '') {
            setFilteredPayments(payments);
            return;
        }

        const filtered = payments.filter(
            (p) =>
                p.name.toLowerCase().includes(text.toLowerCase()) ||
                p.phone.includes(text)
        );
        setFilteredPayments(filtered);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>

                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.headerButton}>
                        <RefreshCw size={22} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerButton}>
                        <HelpCircle size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Send Money</Text>
                <View style={styles.upiAppsContainer}>
                    <Text style={styles.subtitle}>to any UPI app</Text>
                    <View style={styles.upiIcons}>
                        {['Ⓟ', 'B', 'G', 'P'].map((icon, i) => (
                            <View key={i} style={styles.upiIconBox}>
                                <Text style={styles.upiIconText}>{icon}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Search size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search any contact / name"
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            {/* Split Card */}
            <TouchableOpacity style={styles.splitCard}>
                <View style={styles.splitIconContainer}>
                    <Text style={styles.splitIcon}>↕</Text>
                </View>
                <View style={styles.splitContent}>
                    <View style={styles.splitHeader}>
                        <Text style={styles.splitTitle}>Split Expenses</Text>
                        <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>New</Text>
                        </View>
                    </View>
                    <Text style={styles.splitSubtitle}>Track & settle with friends</Text>
                </View>
                <ChevronRight size={20} color="#999" />
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>PAYMENTS & CHAT</Text>

            {/* Payments List */}
            <ScrollView style={styles.paymentsList} showsVerticalScrollIndicator={false}>
                {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                        <TouchableOpacity
                            key={payment.id}
                            style={styles.paymentItem}
                            onPress={() =>
                                router.push({
                                    pathname: './enterAmount',
                                    params: {
                                        name: payment.name,
                                        phone: payment.phone,
                                    },
                                })
                            }
                        >
                            <View style={styles.avatarContainer}>
                                <View
                                    style={[
                                        styles.avatar,
                                        payment.avatar === 'P' && styles.avatarLetter,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.avatarText,
                                            payment.avatar === 'P' && styles.avatarLetterText,
                                        ]}
                                    >
                                        {payment.avatar}
                                    </Text>
                                </View>
                                <View style={styles.upiLogo}>
                                    <Text style={styles.upiLogoText}>UPI</Text>
                                </View>
                            </View>

                            <View style={styles.paymentInfo}>
                                <Text style={styles.paymentName}>{payment.name}</Text>
                                <Text style={styles.paymentDetails}>
                                    {payment.type === 'sent' ? 'You: ' : ''}₹{payment.amount} -{' '}
                                    {payment.type === 'received'
                                        ? 'Received Instantly'
                                        : 'Sent Securely'}
                                </Text>
                            </View>

                            <View style={styles.paymentRight}>
                                <Text style={styles.paymentDate}>{payment.date}</Text>
                                {payment.isActive && <View style={styles.activeIndicator} />}
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    searchQuery.length >= 5 && (
                        <TouchableOpacity
                            style={styles.newNumberCard}
                            onPress={() =>
                                router.push({
                                    pathname: './enterAmount',
                                    params: {
                                        phone: searchQuery,
                                        name: '',
                                    },
                                })
                            }
                        >
                            <View style={styles.newAvatar}>
                                <Text style={styles.newAvatarText}>+</Text>
                            </View>
                            <View>
                                <Text style={styles.newNumberTitle}>New Number</Text>
                                <Text style={styles.newNumberValue}>{searchQuery}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Floating New Payment Button */}
            <TouchableOpacity
                style={styles.newPaymentButton}
                onPress={() => router.push('./qrScanning')}
            >
                <Text style={styles.plusIcon}>+</Text>
                <Text style={styles.newPaymentText}>New Payment</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    gap: 4,
  },

  // Title
  titleContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },

  // UPI Apps
  upiAppsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  upiIcons: {
    flexDirection: "row",
    gap: 8,
  },
  upiIconBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  upiIconText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 22,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },

  // Split Card
  splitCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 2,
  },
  splitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#f3e5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  splitIcon: {
    fontSize: 24,
    color: "#5f27cd",
  },
  splitContent: {
    flex: 1,
  },
  splitHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  splitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginRight: 8,
  },
  newBadge: {
    backgroundColor: "#00bfa5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  splitSubtitle: {
    fontSize: 13,
    color: "#666",
  },

  // Section Title
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    paddingHorizontal: 24,
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  // Payments List
  paymentsList: {
    flex: 1,
  },
  paymentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    backgroundColor: "#9e9e9e",
  },
  avatarText: {
    fontSize: 24,
  },
  avatarLetterText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  upiLogo: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#5f27cd",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  upiLogoText: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#fff",
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  paymentDetails: {
    fontSize: 13,
    color: "#666",
  },
  paymentRight: {
    alignItems: "flex-end",
  },
  paymentDate: {
    fontSize: 13,
    color: "#999",
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4caf50",
    marginTop: 4,
  },

  // New Number
  newNumberCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    paddingVertical: 12,
  },
  newAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#8bc34a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  newAvatarText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
  },
  newNumberTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  newNumberValue: {
    fontSize: 14,
    color: "#666",
  },

  // New Payment Button
  newPaymentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#5f27cd",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 8,
  },
  plusIcon: {
    fontSize: 24,
    color: "#fff",
    marginRight: 8,
    fontWeight: "300",
  },
  newPaymentText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
