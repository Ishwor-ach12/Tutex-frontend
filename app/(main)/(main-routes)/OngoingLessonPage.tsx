import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {useTranslation} from "react-i18next";
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
  ITEM_MARGIN,
  LESSON_CARD_WIDTH_LARGE,
  NUM_COLUMNS,
  SubscribedCourseResonse,
} from "../../customComponents/typesAndDimensions";

const sampleData: transformedCourse[] = [
  {
    assignmentId: 18,
    status: "pending",
    courseId: 4,
    title: "WhatsApp",
    image: require("../../../assets/whatsapp.png"),
    slug: "Social-Media-Online-Call-WhatsApp",
  },
  {
    assignmentId: 19,
    status: "pending",
    courseId: 1,
    title: "UPI Payment",
    image: require("../../../assets/phonepeBanner.png"),
    slug: "UPI-Payment-phonepe-paytm",
  },
  {
    assignmentId: 20,
    status: "pending",
    courseId: 3,
    title: "Amazon Shopping",
    image: require("../../../assets/amazon.png"),
    slug: "amazon-shopping-ecommerce",
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

const imageMap: Record<string, any> = {
  "phonepeBanner.png": require("../../../assets/phonepeBanner.png"),
  "amazon.png": require("../../../assets/amazon.png"),
  "uber.png": require("../../../assets/uber.png"),
  "whatsapp.png": require("../../../assets/whatsapp.png"),
  "facebook.png": require("../../../assets/facebook.png"),
  "instagram.png": require("../../../assets/instagram.png"),
  "flipkart.png": require("../../../assets/flipkart.png"),
};
const LessonCard: React.FC<{ item: transformedCourse }> = ({ item }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.lessonCard}
      onPress={() =>
        router.push({
          pathname: `/(main)/(main-routes)/LessonPage`,
          params: { courseId: String(item.courseId), assignmentId: String(item.assignmentId) },
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
  const { t } = useTranslation();
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
      await AsyncStorage.setItem(
        "authToken",
        "eyJhbGciOiJIUzI1NiJ9.MTk.YS1fIZfRTv3dg4GNMwkHyEv5ICv-bxHzMPvye2E5q3g"
      );
      const token = await AsyncStorage.getItem("authToken"); // Adjust key name as needed

      if (!token) {
        console.warn("No auth token found, using fallback data");
        setCourses(sampleData);
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
          slug: course.slug,
          title: course.title,
          image: imageMap[course.photoUrl], // Use photoUrl from API
          status: "Ongoing" as const,
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
  const renderYourLessonCard = ({
    item,
  }: ListRenderItemInfo<transformedCourse>) => <LessonCard item={item} />;
  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("static_text.home_onlesson")}</Text>
      </View>
      <FlatList
        data={courses}
        renderItem={renderYourLessonCard}
        keyExtractor={(item) => item.courseId.toString()}
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
