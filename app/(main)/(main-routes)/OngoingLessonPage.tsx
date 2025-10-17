import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AllCourseResponse,
  ITEM_MARGIN,
  LESSON_CARD_WIDTH_LARGE,
  NUM_COLUMNS,
  Tutorial,
} from "../../customComponents/typesAndDimensions";

const yourLessonsData: Tutorial[] = [
  {
    id: "1",
    title: "Web Development Basics",
    lessons: 5,
    image: require("../../../assets/amazon.png"),
    status: "Ongoing",
  },
  {
    id: "1",
    title: "Data Structures 101",
    lessons: 3,
    image: require("../../../assets/whatsapp.png"),
    status: "Ongoing",
  },
  {
    id: "1",
    title: "Mobile App Design",
    lessons: 8,
    image: require("../../../assets/uber.png"),
    status: "Ongoing",
  },
  {
    id: "1",
    title: "Advanced React Native",
    lessons: 2,
    image: require("../../../assets/phonepeBanner.png"),
    status: "Ongoing",
  },
];
const imageMap: Record<string, any> = {
  "phonepeBanner.png": require("../../../assets/phonepeBanner.png"),
  "amazon.png": require("../../../assets/amazon.png"),
  "uber.png": require("../../../assets/uber.png"),
  "whatsapp.png": require("../../../assets/whatsapp.png"),
  "facebook.png": require("../../../assets/facebook.png"),
  "instagram.png": require("../../../assets/instagram.png"),
  "flipkart.png": require("../../../assets/flipkart.png"),
};
const LessonCard: React.FC<{ item: Tutorial }> = ({ item }) => {
  const router = useRouter();
  return (
<TouchableOpacity
      style={styles.lessonCard}
      onPress={() =>
        router.push({
          pathname: "/(main)/(tutorials)/[id]/LessonPage",
          params: { id: String(item.id) },
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
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
)}

const OngoingLessons = () => {
  const [courses, setCourses] = useState<Tutorial[]>(yourLessonsData);
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
      await AsyncStorage.setItem(
        "authToken",
        "eyJhbGciOiJIUzI1NiJ9.MTk.YS1fIZfRTv3dg4GNMwkHyEv5ICv-bxHzMPvye2E5q3g"
      );
      const token = await AsyncStorage.getItem("authToken"); // Adjust key name as needed

      if (!token) {
        console.warn("No auth token found, using fallback data");
        setCourses(yourLessonsData);
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://tutex-vq6j.onrender.com/tutorial/all",
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

      const data: AllCourseResponse = await response.json();

      // Transform API response to Tutorial format
      const transformedCourses: Tutorial[] = data.body.map((course) => ({
        id: course.courseId.toString(),
        title: course.title,
        lessons: 0, // API doesn't provide lesson count, set default or fetch separately
        image: imageMap[course.photoUrl], // Use photoUrl from API
        status: "Ongoing" as const,
      }));
      // console.log(transformedCourses);
      setCourses(transformedCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch courses");
      // Keep fallback data on error
      setCourses(yourLessonsData);
    } finally {
      setLoading(false);
    }
  };
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
    <ScrollView>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ongoing Lessons</Text>
      </View>
      <FlatList
        data={courses}
        renderItem={renderYourLessonCard}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        scrollEnabled={false} // Important: Disable internal scrolling to allow the parent ScrollView to handle it
        columnWrapperStyle={styles.exploreColumnWrapper}
        contentContainerStyle={styles.exploreListContainer}
      />
    </ScrollView>
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
