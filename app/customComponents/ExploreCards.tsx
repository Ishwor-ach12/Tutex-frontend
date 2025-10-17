import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  AllCourseResponse,
  EXPLORE_ITEM_WIDTH,
  ITEM_MARGIN,
  NUM_COLUMNS,
  Tutorial
} from "./typesAndDimensions";




const exploreData: Tutorial[] = [
  {
    id: "yl1",
    title: "Web Development Basics",
    lessons: 5,
    image: require("../../assets/instagram.png"),
    status: "Ongoing",
  },
  {
    id: "yl2",
    title: "Data Structures 101",
    lessons: 3,
    image: require("../../assets/amazon.png"),
    status: "Ongoing",
  },
  {
    id: "yl3",
    title: "Mobile App Design",
    lessons: 8,
    image: require("../../assets/facebook.png"),
    status: "Ongoing",
  },
  {
    id: "yl4",
    title: "Advanced React Native",
    lessons: 2,
    image: require("../../assets/phonepeBanner.png"),
    status: "Ongoing",
  },
];

const imageMap: Record<string, any> = {
  "phonepeBanner.png": require("../../assets/phonepeBanner.png"),
  "amazon.png": require("../../assets/amazon.png"),
  "uber.png": require("../../assets/uber.png"),
  "whatsapp.png": require("../../assets/whatsapp.png"),
};

const ExploreCard: React.FC<{ item: Tutorial }> = ({ item }) => {
  const router = useRouter(); // ✅ hook at top level

  return (
    <TouchableOpacity
      style={[styles.exploreCard, { width: EXPLORE_ITEM_WIDTH }]}
      onPress={() =>
        router.push({
          pathname: "/(main)/(tutorials)/[id]/DetailsPage",
          params: { id: String(item.id) },
        } as any)}
    >
      <Image source={item.image} style={styles.cardImage} />
      <LinearGradient
        colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.9)"]}
        style={styles.gradientOverlay}
      />
      <View style={styles.exploreTextContainer}>
        <Text style={styles.exploreTitle}>{item.title}</Text>
        <Text style={styles.exploreLessons}>Lessons: {item.lessons}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ExploreCards = () => {
  const renderExploreCard = ({ item }: ListRenderItemInfo<Tutorial>) => (
    <ExploreCard item={item} />
  );
  const [courses, setCourses] = useState<Tutorial[]>(exploreData);
  const [loading, setLoading] = useState(true);
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
        setCourses(exploreData);
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
      console.log(transformedCourses);
      setCourses(transformedCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch courses");
      // Keep fallback data on error
      setCourses(exploreData);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Explore</Text>
      </View>

      <FlatList
        data={courses}
        renderItem={renderExploreCard}
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
export default ExploreCards;
