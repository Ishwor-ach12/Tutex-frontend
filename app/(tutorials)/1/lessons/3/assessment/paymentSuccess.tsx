import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckIcon, LayoutGridIcon, Share2Icon } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PaymentSuccessParams {
  amount: string;
  refId: string;
  recipientName: string;
  phone: string;
}

const { width } = Dimensions.get("window");

export default function PaymentSuccessScreen() {
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const params = useLocalSearchParams();
  const router = useRouter();
  
  // Extract params from navigation
  const amount = Array.isArray(params.amount) ? params.amount[0] : params.amount || "0";
  const recipientName = Array.isArray(params.recipientName) 
    ? params.recipientName[0] 
    : params.recipientName || "Unknown";
  const refId = Array.isArray(params.refId) ? params.refId[0] : params.refId || "";
  const phone = Array.isArray(params.phone) ? params.phone[0] : params.phone || "";

  // Get current date and time
  const formattedDateTime: string = useMemo(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formatter = new Intl.DateTimeFormat("en-GB", options);
    const parts = formatter.formatToParts(now);
    const day = parts.find((p) => p.type === "day")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const year = parts.find((p) => p.type === "year")?.value;
    const hour = parts.find((p) => p.type === "hour")?.value;
    const minute = parts.find((p) => p.type === "minute")?.value;
    const ampm = parts.find((p) => p.type === "dayPeriod")?.value;

    return `${day} ${month} ${year} at ${hour}:${minute} ${ampm}`;
  }, []);

  // Get recipient's initial for profile image
  const recipientInitial: string = useMemo(() => {
    return recipientName ? recipientName.charAt(0).toUpperCase() : "U";
  }, [recipientName]);

  const handleDone = async () => {
    try {
      setIsButtonLoading(true);
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.warn("No auth token found.");
        // Navigate back to home or show error
        router.back();
        return;
      }
      
      const loadedLesson = await AsyncStorage.getItem("loadedLesson");
      if (!loadedLesson) {
        console.log("Not found loaded lesson");
        router.back();
        return;
      }

      const { lessonId, courseId, assignmentId, moduleName } = JSON.parse(
        loadedLesson
      );

      const response = await fetch(
        `https://tutex-vq6j.onrender.com/user/complete?assignmentId=${assignmentId}&lessonId=${lessonId}&moduleName=${moduleName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const selectedLesson = data.body.lessons.filter(
        (lesson: any) => lesson.lessonId == lessonId
      )[0];
      console.log(selectedLesson);
      
      await AsyncStorage.setItem("selectedLesson", JSON.stringify(selectedLesson));

      router.push({
        pathname: `/(main)/(main-routes)/LessonDetailPage`,
        params: {
          courseId: String(courseId),
          assignmentId: String(assignmentId),
          lessonId: String(lessonId),
        },
      } as any);
    } catch (error) {
      console.error("Error completing tutorial:", error);
      Alert.alert("Error", "Internal Error Occurred! Please try again later");
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleViewDetails = (): void => {
    // Show transaction details in an alert or navigate to details screen
    Alert.alert(
      "Transaction Details",
      `Amount: ₹${amount}\nRecipient: ${recipientName}\nPhone: +${phone}\nReference ID: ${refId}\nDate: ${formattedDateTime}`,
      [{ text: "OK" }]
    );
  };

  const handleShareReceipt = (): void => {
    Alert.alert(
      "Share Receipt",
      `Share payment receipt for ₹${amount} to ${recipientName}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Share", onPress: () => console.log("Sharing receipt...") }
      ]
    );
    // TODO: Implement actual sharing functionality using expo-sharing or react-native-share
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Green Header Section */}
        <View style={styles.successHeader}>
          <View style={styles.checkmarkContainer}>
            <CheckIcon size={50} color="#4CAF50" />
          </View>
          <Text style={styles.paymentSuccessText}>Payment Successful</Text>
          <Text style={styles.dateTimeText}>{formattedDateTime}</Text>
        </View>

        {/* Transaction Details Card */}
        <View style={styles.detailsCard}>
          {/* Recipient Info */}
          <View style={styles.recipientInfoContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>{recipientInitial}</Text>
            </View>
            <View style={styles.recipientTextContainer}>
              <Text style={styles.recipientName}>{recipientName}</Text>
              <Text style={styles.recipientEmail}>
                {phone ? `+${phone}` : `${recipientName.toLowerCase().replace(/\s/g, "")}@hdfcbank`}
              </Text>
            </View>
          </View>

          {/* Amount */}
          <Text style={styles.amountText}>₹{amount}</Text>

          {/* Reference ID */}
          <View style={styles.refIdContainer}>
            <Text style={styles.refIdLabel}>Reference ID:</Text>
            <Text style={styles.refIdText} numberOfLines={1} ellipsizeMode="middle">
              {refId}
            </Text>
          </View>

          {/* Split Expense (optional) */}
          <Text style={styles.splitExpenseText}>Split Expense</Text>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleViewDetails}
            >
              <View style={styles.actionIconBackground}>
                <LayoutGridIcon size={24} color="#5D3FD3" />
              </View>
              <Text style={styles.actionButtonText}>View Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShareReceipt}
            >
              <View style={styles.actionIconBackground}>
                <Share2Icon size={24} color="#5D3FD3" />
              </View>
              <Text style={styles.actionButtonText}>Share Receipt</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer to push Done button to bottom */}
        <View style={styles.spacer} />

        {/* Done Button */}
        <TouchableOpacity 
          style={styles.doneButton} 
          onPress={handleDone}
          disabled={isButtonLoading}
        >
          {isButtonLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.doneButtonText}>Done</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4CAF50",
  },
  container: {
    flex: 1,
    backgroundColor: "#4CAF50",
    alignItems: "center",
  },
  successHeader: {
    width: "100%",
    backgroundColor: "#4CAF50",
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  paymentSuccessText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(238, 238, 238, 0.9)",
  },
  detailsCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  recipientInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    paddingLeft: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#5D3FD3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  profileInitial: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  recipientTextContainer: {
    flex: 1,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  recipientEmail: {
    fontSize: 14,
    color: "#A0A0A0",
  },
  amountText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  refIdContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  refIdLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  refIdText: {
    fontSize: 11,
    color: "#666",
    maxWidth: width * 0.7,
  },
  splitExpenseText: {
    fontSize: 14,
    color: "#8A2BE2",
    marginBottom: 30,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 10,
  },
  actionButton: {
    alignItems: "center",
    width: "45%",
  },
  actionIconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e4e4e4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#727272",
  },
  spacer: {
    flex: 1,
  },
  doneButton: {
    width: "90%",
    backgroundColor: "#5D3FD3",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});