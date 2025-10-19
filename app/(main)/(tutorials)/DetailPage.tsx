import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Lesson {
  lessonId: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  courseId: number;
}

interface CourseWithLessons {
  courseId: number;
  title: string;
  photoUrl: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  Lessons: Lesson[];
}

const DetailPage = () => {
  const { courseId } = useLocalSearchParams();
  const router = useRouter();
  const [tutorial, setTutorial] = useState<CourseWithLessons | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);

  const API_BASE_URL = "https://tutex-vq6j.onrender.com";

  useEffect(() => {
    fetchTutorialDetail();
  }, [courseId]);

  const fetchTutorialDetail = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.warn("No auth token found, using fallback data");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/tutorial/${courseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTutorial(data.body);
    } catch (error) {
      console.error("Error fetching tutorial:", error);
      // Fallback data
      setTutorial({
        courseId: 1,
        title: "UPI Payment",
        photoUrl: "phonepeBanner.png",
        slug: "UPI-Payment-phonepe-paytm",
        createdAt: "2025-04-12T17:08:54.000Z",
        updatedAt: "2025-04-12T17:08:54.000Z",
        Lessons: [
          {
            lessonId: 1,
            title: "Pay using QR code",
            description: "Learn to make UPI payments by scanning QR codes.",
            createdAt: "2025-04-12T17:15:03.000Z",
            updatedAt: "2025-04-12T17:15:03.000Z",
            courseId: 1,
          },
          {
            lessonId: 2,
            title: "Pay to a Mobile Number",
            description:
              "Learn to make UPI payments to the mobile number of receiver.",
            createdAt: "2025-04-12T17:16:18.000Z",
            updatedAt: "2025-04-12T17:16:18.000Z",
            courseId: 1,
          },
          {
            lessonId: 3,
            title: "Pay to a Bank Account",
            description:
              "Learn to make UPI payments to the bank account of receiver.",
            createdAt: "2025-04-12T17:16:55.000Z",
            updatedAt: "2025-04-12T17:16:55.000Z",
            courseId: 1,
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCourse = async () => {
    try {
      setIsButtonLoading(true);
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.warn("No auth token found, using fallback data");
        return;
      }

      const response = await fetch(
        `https://tutex-vq6j.onrender.com/tutorial/${courseId}/start`,
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
      const assignmentId = data.body.assignmentId;
      router.push({
        pathname: `/(main)/(tutorials)/LessonPage`,
        params: {
          courseId: String(courseId),
          assignmentId: String(assignmentId),
        },
      } as any);
    } catch (error) {
      console.error("Error Starting tutorial:", error);
      Alert.alert("Internal Error Occured! Please try again later");
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleLessonPress = (lesson: Lesson) => {
    // Toggle accordion
    if (expandedLessonId === lesson.lessonId) {
      setExpandedLessonId(null);
    } else {
      setExpandedLessonId(lesson.lessonId);
    }
  };

  const getLessonNumber = (lessonId: number) => {
    if (!tutorial || !tutorial.Lessons.length) return 1;

    const sortedLessons = [...tutorial.Lessons].sort(
      (a, b) => a.lessonId - b.lessonId
    );
    const minLessonId = sortedLessons[0].lessonId;
    return lessonId - minLessonId + 1;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!tutorial) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Tutorial not found</Text>
      </View>
    );
  }

  const sortedLessons = [...tutorial.Lessons].sort(
    (a, b) => a.lessonId - b.lessonId
  );

  return (
    <ScrollView style={styles.container}>
      {/* Tutorial Title */}
      <Text style={styles.tutorialTitle}>{tutorial.title}</Text>

      {/* Lessons Header with Start Course Button */}
      <View style={styles.lessonsHeader}>
        <Text style={styles.lessonsTitle}>Lessons:</Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartCourse}
          activeOpacity={0.8}
        >
          {isButtonLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.startButtonText}>Start Course</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Lessons List with Accordion */}
      <View style={styles.lessonsContainer}>
        {sortedLessons.map((lesson) => {
          const isExpanded = expandedLessonId === lesson.lessonId;
          const lessonNumber = getLessonNumber(lesson.lessonId);

          return (
            <View key={lesson.lessonId} style={styles.lessonWrapper}>
              <TouchableOpacity
                style={styles.lessonCard}
                onPress={() => handleLessonPress(lesson)}
                activeOpacity={0.7}
              >
                <View style={styles.lessonHeader}>
                  <View>
                    <Text style={styles.lessonNumber}>
                      Lesson - {lessonNumber}
                    </Text>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Accordion Content */}
              {isExpanded && (
                <View style={styles.lessonDescription}>
                  <Text style={styles.descriptionText}>
                    {lesson.description}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
  },
  tutorialTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 24,
    marginTop: 8,
  },
  lessonsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  lessonsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  startButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  startButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  lessonsContainer: {
    marginTop: 8,
  },
  lessonWrapper: {
    marginBottom: 12,
  },
  lessonCard: {
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    padding: 16,
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lessonNumber: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  lessonDescription: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: -8,
    paddingTop: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});

export default DetailPage;
