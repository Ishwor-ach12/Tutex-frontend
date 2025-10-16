import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LESSON_CARD_WIDTH, Tutorial } from "./typesAndDimensions";
import { Ionicons } from "@expo/vector-icons";

const yourLessonsData: Tutorial[] = [
  {
    id: "yl1",
    title: "Web Development Basics",
    lessons: 5,
    image: require("../../assets/amazon.png"),
    status: "Ongoing",
  },
  {
    id: "yl2",
    title: "Data Structures 101",
    lessons: 3,
    image: require("../../assets/flipkart.png"),
    status: "Ongoing",
  },
  {
    id: "yl3",
    title: "Mobile App Design",
    lessons: 8,
    image: require("../../assets/uber.png"),
    status: "Ongoing",
  },
  {
    id: "yl4",
    title: "Advanced React Native",
    lessons: 2,
    image: require("../../assets/whatsapp.png"),
    status: "Ongoing",
  },
];

const LessonCard: React.FC<{ item: Tutorial }> = ({ item }) => (
  <View style={styles.lessonCard}>
    {/* Placeholder for the gradient/image */}
    <Image source={item.image} style={styles.cardImage} />
    <LinearGradient
      colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.9)"]} // Transparent at top, solid black at bottom
      style={styles.gradientOverlay}
    />

    {/* Icon at top right (using Emoji instead of Ionicons to resolve module error) */}
    <View style={styles.lessonIconContainer}>
      <Ionicons name="bookmark" size={16} color="#0d6efd" />{" "}
    </View>

    <View style={styles.lessonTextContainer}>
      <Text style={styles.lessonTitle}>{item.title}</Text>
    </View>
  </View>
);

const RecommendedLessons = () => {
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
        <Text style={styles.sectionTitle}>Recommended Lessons</Text>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={yourLessonsData}
        renderItem={renderYourLessonCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.lessonsListContainer}
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
    width: LESSON_CARD_WIDTH,
    height: 230,
    borderRadius: 10,
    marginRight: 15,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
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
    padding: 10,
  },
  lessonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
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
});
export default RecommendedLessons;
