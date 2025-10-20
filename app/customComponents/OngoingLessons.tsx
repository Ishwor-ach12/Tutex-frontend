import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  LESSON_CARD_WIDTH,
  SubscribedCourseResonse,
} from "./typesAndDimensions";

const imageMap: Record<string, any> = {
  "phonepeBanner.png": require("../../assets/phonepeBanner.png"),
  "amazon.png": require("../../assets/amazon.png"),
  "uber.png": require("../../assets/uber.png"),
  "whatsapp.png": require("../../assets/whatsapp.png"),
};

const sampleData: transformedCourse[] = [
  {
    assignmentId: 18,
    status: "pending",
    courseId: 4,
    title: "WhatsApp",
    image: require("../../assets/whatsapp.png"),
    slug: "Social-Media-Online-Call-WhatsApp",
  },
  {
    assignmentId: 19,
    status: "pending",
    courseId: 1,
    title: "UPI Payment",
    image: require("../../assets/phonepeBanner.png"),
    slug: "UPI-Payment-phonepe-paytm",
  },
];

type transformedCourse = {
  assignmentId: number;
  status: string;
  courseId: number;
  title: string;
  image: number;
  slug: string;
};
const LessonCard: React.FC<{ item: transformedCourse }> = ({ item }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.lessonCard}
      onPress={() =>
        router.push({
              pathname: `/(main)/(main-routes)/LessonPage`,
              params: {courseId: String(item.courseId), assignmentId: String(item.assignmentId) },
        } as any)
      }
    >
      {/* Placeholder for the gradient/image */}
      <Image source={item.image} style={styles.cardImage} />
      <LinearGradient
        colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.9)"]} // Transparent at top, solid black at bottom
        style={styles.gradientOverlay}
      />
      {/* Icon at top right (using Emoji instead of Ionicons to resolve module error) */}
      <View style={styles.lessonIconContainer}>
        <Ionicons name="bookmark" size={16} color="#0d6efd" />
      </View>

      <View style={styles.lessonTextContainer}>
        <Text style={styles.lessonTitle}>{item.title}</Text>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() =>
            router.push({
              pathname: `/(main)/(main-routes)/LessonPage`,
              params: {courseId: String(item.courseId), assignmentId: String(item.assignmentId) },
            } as any)
          }
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const OngoingLessons = () => {
  const [courses, setCourses] = useState<transformedCourse[]>(sampleData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get bearer token from AsyncStorage
      const token = await AsyncStorage.getItem("authToken"); // Adjust key name as needed

      if (!token) {
        console.warn("No auth token found, using fallback data");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://tutex-vq6j.onrender.com/user/tutorial/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SubscribedCourseResonse = await response.json();

      // Transform API response to Tutorial format
      const transformedCourses: transformedCourse[] = data.body.map(
        (course) => ({
          assignmentId: course.assignmentId,
          courseId: course.courseId,
          title: course.title,
          image: imageMap[course.photoUrl], // Use photoUrl from API
          status: "Ongoing" as const,
          slug: course.slug,
        })
      );
      setCourses(transformedCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch courses");
      // Keep fallback data on error
      setCourses(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();
  const handleSeeAll = () => {
    // Assuming you have a route like 'all-lessons' or similar
    router.push("/(main)/(main-routes)/OngoingLessonPage");
    // If 'all-lessons' is a screen within your tabs, use: router.push('/(tabs)/all-lessons');
    // Adjust the path to match your file-based routing structure.
  };
  const renderYourLessonCard = ({
    item,
  }: ListRenderItemInfo<transformedCourse>) => <LessonCard item={item} />;
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ongoing Lessons</Text>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={courses}
        renderItem={renderYourLessonCard}
        keyExtractor={(item) => item.assignmentId.toString()}
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
export default OngoingLessons;
