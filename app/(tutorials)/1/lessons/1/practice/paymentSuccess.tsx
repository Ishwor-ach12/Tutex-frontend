import { VoiceAgent } from "@/app/customComponents/VoiceAgent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckIcon, LayoutGridIcon, Share2Icon } from "lucide-react-native";
import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// --- INTERFACES & TYPES ---

// Interface for the data received from navigation parameters
interface PaymentSuccessParams {
  amount: string;
  refId: string;
  recipientName: string; // Changed from recipientName to recipient for consistency with router.push
}

// Interface for Icon placeholders
interface IconProps {
  size: number;
  color: string;
  style?: object;
}

// Mock router for navigation

const { width } = Dimensions.get("window");

// --- Main Screen Component ---
export default function PaymentSuccessScreen() {
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const { amount, recipientName, refId } = useLocalSearchParams();
  const router = useRouter();

  const currentStepRef = useRef<number>(0);
  const isFocused = useIsFocused();

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
    // Custom format to match "04 July 2025 at 06:44 PM"
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
    return recipientName.toLocaleString().charAt(0).toUpperCase();
  }, [recipientName]);

  const handleDone = async () => {
    try {
      setIsButtonLoading(true);
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.warn("No auth token found.");
        return;
      }
      const loadedLesson = await AsyncStorage.getItem("loadedLesson");
      if (!loadedLesson) {
        console.log("Not founded loaded lesson");
        return;
      }

      const { lessonId, courseId, assignmentId, moduleName } = await JSON.parse(
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
        (lesson) => lesson.lessonId == lessonId
      )[0];
      console.log(selectedLesson);

      await AsyncStorage.setItem(
        "selectedLesson",
        JSON.stringify(selectedLesson)
      );

      router.push({
        pathname: `/(main)/(main-routes)/LessonDetailPage`,
        params: {
          courseId: String(courseId),
          assignmentId: String(assignmentId),
          lessonId: String(lessonId),
        },
      } as any);
    } catch (error) {
      console.error("Error Starting tutorial:", error);
      Alert.alert("Internal Error Occured! Please try again later");
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleViewDetails = (): void => {
    Alert.alert("View Details", "Showing transaction details...");
    // Implement navigation to a detailed transaction screen if needed
  };

  const handleShareReceipt = (): void => {
    Alert.alert(
      "Share Receipt",
      "Sharing functionality would be implemented here."
    );
    // Implement sharing functionality
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Green Header Section */}
        {isFocused && (
          <View
            style={{
              position: "absolute",
              top: 40,
              right: 20,
              zIndex: 500,
            }}
          >
            <VoiceAgent
              tutorialName="UPI_MB_5"
              size={35}
              uiHandlerFunction={(num: string) => {}}
              currentStepRef={currentStepRef}
            />
          </View>
        )}
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
              {/* Assuming a fixed email format or placeholder */}
              <Text style={styles.recipientEmail}>
                {`${recipientName
                  .toLocaleString()
                  .toLowerCase()
                  .replace(/\s/g, "")}@hdfcbank`}
              </Text>
            </View>
          </View>

          {/* Amount */}
          <Text style={styles.amountText}>₹{amount}</Text>

          {/* Split Expense (optional, based on image) */}
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
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          {isButtonLoading ? (
            <ActivityIndicator size="large" color="#2196F3" />
          ) : (
            <Text style={styles.doneButtonText}>Done</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4CAF50", // Green background matching the top header
  },
  container: {
    flex: 1,
    backgroundColor: "#4CAF50", // Matches safeArea background
    alignItems: "center",
  },
  successHeader: {
    width: "100%",
    backgroundColor: "#4CAF50", // Green color
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
    fontSize: 18,
    fontWeight: "semibold",
    color: "rgba(238, 238, 238, 0.8)",
  },
  detailsCard: {
    width: "90%",
    backgroundColor: "#fff", // Dark gray/black for the card
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#bdbdbdff",
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
    backgroundColor: "#5D3FD3", // Purple for the initial background
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
    flex: 1, // Allows text to take available space
  },
  recipientName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  recipientEmail: {
    fontSize: 14,
    color: "#A0A0A0", // Lighter gray for email
  },
  amountText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  splitExpenseText: {
    fontSize: 14,
    color: "#8A2BE2", // Violet color
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
    width: "45%", // Distribute space
  },
  actionIconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e4e4e4ff", // Darker gray for icon background
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#727272ff",
  },
  spacer: {
    flex: 1, // Pushes the Done button to the bottom
  },
  doneButton: {
    width: "90%",
    backgroundColor: "#5D3FD3", // A distinct purple for the button
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20, // Space from the bottom edge
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
