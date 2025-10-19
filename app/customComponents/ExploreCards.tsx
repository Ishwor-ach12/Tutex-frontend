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
  Course,
  EXPLORE_ITEM_WIDTH,
  ITEM_MARGIN,
  NUM_COLUMNS
} from "./typesAndDimensions";

const exploreData: Course[] = [
        {
            "courseId": 1,
            "title": "UPI Payment",
            "photoUrl": "phonepeBanner.png",
            "slug": "UPI-Payment-phonepe-paytm",
            "createdAt": "2025-04-12T17:08:54.000Z",
            "updatedAt": "2025-04-12T17:08:54.000Z"
        },
        {
            "courseId": 2,
            "title": "Amazon Online Shopping",
            "photoUrl": "amazon.png",
            "slug": "Online-Shopping-Amazon-Flipkart",
            "createdAt": "2025-04-29T18:00:17.000Z",
            "updatedAt": "2025-04-29T18:00:17.000Z"
        },
        {
            "courseId": 3,
            "title": "Uber Booking",
            "photoUrl": "uber.png",
            "slug": "Online-Booking-Auto-Cab-Bike-Uber",
            "createdAt": "2025-04-29T18:03:56.000Z",
            "updatedAt": "2025-04-29T18:03:56.000Z"
        },
        {
            "courseId": 4,
            "title": "WhatsApp",
            "photoUrl": "whatsapp.png",
            "slug": "Social-Media-Online-Call-WhatsApp",
            "createdAt": "2025-04-29T18:06:18.000Z",
            "updatedAt": "2025-04-29T18:06:18.000Z"
        }
    ];

const imageMap: Record<string, any> = {
  "phonepeBanner.png": require("../../assets/phonepeBanner.png"),
  "amazon.png": require("../../assets/amazon.png"),
  "uber.png": require("../../assets/uber.png"),
  "whatsapp.png": require("../../assets/whatsapp.png"),
};

const ExploreCard: React.FC<{ item: Course }> = ({ item }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.exploreCard, { width: EXPLORE_ITEM_WIDTH }]}
      onPress={() =>
        router.push({
          pathname: "/(main)/(tutorials)/DetailPage",
          params: {courseId: String(item.courseId)}
        } as any)}
    >
      <Image source={imageMap[item.photoUrl]} style={styles.cardImage} />
      <LinearGradient
        colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.9)"]}
        style={styles.gradientOverlay}
      />
      <View style={styles.exploreTextContainer}>
        <Text style={styles.exploreTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ExploreCards = () => {
  const renderExploreCard = ({ item }: ListRenderItemInfo<Course>) => (
    <ExploreCard item={item} />
  );
  const [courses, setCourses] = useState<Course[]>(exploreData);
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
      setCourses(data.body);
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
        keyExtractor={(item) => item.courseId.toString()}
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
    bottom: 20,
    left: 12,
  },
  exploreTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "semibold",
  },
});
export default ExploreCards;
