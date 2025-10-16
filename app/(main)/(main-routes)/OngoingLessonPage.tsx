import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ITEM_MARGIN,
  LESSON_CARD_WIDTH_LARGE,
  NUM_COLUMNS,
  Tutorial,
} from "../../customComponents/typesAndDimensions";
import { Ionicons } from "@expo/vector-icons";

const yourLessonsData: Tutorial[] = [
  {
    id: "yl1",
    title: "Web Development Basics",
    lessons: 5,
    image: require("../../../assets/amazon.png"),
    status: "Ongoing",
  },
  {
    id: "yl2",
    title: "Data Structures 101",
    lessons: 3,
    image: require("../../../assets/whatsapp.png"),
    status: "Ongoing",
  },
  {
    id: "yl3",
    title: "Mobile App Design",
    lessons: 8,
    image: require("../../../assets/uber.png"),
    status: "Ongoing",
  },
  {
    id: "yl4",
    title: "Advanced React Native",
    lessons: 2,
    image: require("../../../assets/phonepeBanner.png"),
    status: "Ongoing",
  },
];

const LessonCard: React.FC<{ item: Tutorial }> = ({ item }) => (
  <View style={styles.lessonCard}>
    {/* Placeholder for the gradient/image */}
    <Image source={item.image} style={styles.cardImage} />
    <LinearGradient
      colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.9)"]} // Transparent at top, solid black at bottom
      style={styles.gradientOverlay}
    />
    {/* Icon at top right (using Emoji instead of Ionicons to resolve module error) */}
    <View style={styles.lessonIconContainer}>
      <Ionicons name="bookmark" size={16} color="#0d6efd" />{" "}
    </View>

    <View style={styles.lessonTextContainer}>
      <Text style={styles.lessonTitle}>{item.title}</Text>
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const OngoingLessons = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API call
  useEffect(() => {
    const fetchOngoingTutorials = async () => {
      try {
        setLoading(true);
        // 🔹 Replace with your backend endpoint
        const response = await fetch(
          "http://localhost:9004/api/tutorials/ongoing"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTutorials(data);
      } catch (err: any) {
        console.error("Error fetching ongoing tutorials:", err);
        setError("Failed to load tutorials. Please try again.");
        setTutorials(yourLessonsData);
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingTutorials();
  }, []);
  const router = useRouter();
  const handleSeeAll = () => {
    // Assuming you have a route like 'all-lessons' or similar
    router.push("/");
    // If 'all-lessons' is a screen within your tabs, use: router.push('/(tabs)/all-lessons');
    // Adjust the path to match your file-based routing structure.
  };
  const renderYourLessonCard = ({ item }: ListRenderItemInfo<Tutorial>) => (
    <LessonCard item={item} />
  );
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ongoing Lessons</Text>
      </View>
      <FlatList
        data={tutorials}
        renderItem={renderYourLessonCard}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        scrollEnabled={false} // Important: Disable internal scrolling to allow the parent ScrollView to handle it
        columnWrapperStyle={styles.exploreColumnWrapper}
        contentContainerStyle={styles.exploreListContainer}
      />
    </>
  );
};

const styles = StyleSheet.create({
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    // The gradient covers the entire card area
    borderRadius: 10,
  },

  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    borderRadius: 10, // Must match lessonCard's borderRadius
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginVertical: 20,
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
  lessonsListContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  lessonCard: {
    width: LESSON_CARD_WIDTH_LARGE,
    height: 330,
    borderRadius: 10,
    marginRight: 15,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  exploreListContainer: {
    paddingHorizontal: ITEM_MARGIN,
    paddingBottom: 20,
  },
  exploreColumnWrapper: {
    justifyContent: "space-between",
    marginBottom: ITEM_MARGIN,
  },
  gradientPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ddd",
  },
  lessonIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 12,
    zIndex: 1, // Ensure icon is above placeholder
  },
  iconEmoji: {
    fontSize: 14,
    color: "#0d6efd", // Emoji color styling
  },
  lessonTextContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 15,
  },
  lessonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 18,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  continueButton: {
    backgroundColor: "#0d6efd",
    borderRadius: 5,
    paddingVertical: 6,
    marginRight: "40%",
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
export default OngoingLessons;
