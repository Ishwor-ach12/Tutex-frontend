import ExploreCards from "@/app/customComponents/ExploreCards";
import OngoingLessons from "@/app/customComponents/OngoingLessons";
import RecommendedLessons from "@/app/customComponents/RecommendedLessons";
import { Tutorial } from "@/app/customComponents/typesAndDimensions";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// --- Type Definitions ---


// Calculate item width for the Explore grid (two columns with margin)
const { width } = Dimensions.get("window");
const ITEM_MARGIN = 15;
const NUM_COLUMNS = 2;
const EXPLORE_ITEM_WIDTH = (width - ITEM_MARGIN * 3) / NUM_COLUMNS; // 3 margins: left, middle, right

// --- Reusable Components ---

/**
 * Renders a single "Your Lessons" card (Horizontal Scroll)
 */
const YourLessonCard: React.FC<{ item: Tutorial }> = ({ item }) => (
  <View style={styles.lessonCard}>
    {/* Placeholder for the gradient/image */}
    <View style={styles.gradientPlaceholder} />

    {/* Icon at top right (assuming it means "In Progress") */}
    <View style={styles.lessonIconContainer}>
      <Ionicons name="bookmark" size={16} color="#0d6efd" />
    </View>

    <View style={styles.lessonTextContainer}>
      <Text style={styles.lessonTitle}>{item.title}</Text>
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  </View>
);

/**
 * Renders a single "Explore" card (Grid Layout)
 */
const ExploreCard: React.FC<{ item: Tutorial }> = ({ item }) => (
  <View style={[styles.exploreCard, { width: EXPLORE_ITEM_WIDTH }]}>
    {/* Placeholder for the gradient/image */}
    <View style={styles.gradientPlaceholder} />

    <View style={styles.exploreTextContainer}>
      <Text style={styles.exploreTitle}>{item.title}</Text>
      <Text style={styles.exploreLessons}>Lessons: {item.lessons}</Text>
    </View>
  </View>
);

// --- Main Home Screen Component ---

export default function HomeScreen() {
  const router = useRouter();

  // Function to handle navigation to the "All Lessons" page

  

  // Define the render function signature explicitly
  const renderExploreCard = ({ item }: ListRenderItemInfo<Tutorial>) => (
    <ExploreCard item={item} />
  );
  return (
    <ScrollView style={styles.container}>
      <View style={styles.trends}>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.trendsImage}
        />
      </View>
      {/* --- Your Lessons Section --- */}
      <OngoingLessons/>
      {/* --- Search Bar --- */}

      {/* Recommendation section */}
      <RecommendedLessons/>

      {/* --- Explore Section --- */}
      <ExploreCards/>
    </ScrollView>
  );
}

// --- Stylesheet ---
const LESSON_CARD_WIDTH = width * 0.35;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  trends: {
    height: 200,
    backgroundColor: "black",
    marginVertical: 15,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  trendsImage: {
    height: 200,
    objectFit: "contain",
    width: 0,
  },
  // Headers
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#0d6efd",
  },

  // Your Lessons (Horizontal)
  lessonsListContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  lessonCard: {
    width: LESSON_CARD_WIDTH,
    height: 230,
    borderRadius: 10,
    marginRight: 15,
    overflow: "hidden", // Ensures the gradient placeholder stays within bounds
  },
  gradientPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ddd", // Light gray background
    // You would typically use a library like expo-linear-gradient here
  },
  lessonIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 12,
  },
  lessonTextContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
  },
  lessonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  continueButton: {
    backgroundColor: "#0d6efd",
    borderRadius: 5,
    paddingVertical: 6,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },

  // Search Bar
  

  // Explore (Grid)
  exploreListContainer: {
    paddingHorizontal: ITEM_MARGIN,
    paddingBottom: 20,
  },
  exploreColumnWrapper: {
    justifyContent: "space-between",
    marginBottom: ITEM_MARGIN,
  },
  exploreCard: {
    height: 280,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f0f0f0", // Fallback
  },
  exploreTextContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  exploreTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  exploreLessons: {
    color: "white",
    fontSize: 12,
    marginTop: 2,
  },
});
