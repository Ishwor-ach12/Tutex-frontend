import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";



const sampleData = {
  message: "Tutorial fetched Successfully",
  body: {
    assignmentId: 19,
    courseId: 1,
    title: "UPI Payment",
    photoUrl: "phonepeBanner.png",
    status: "pending",
    lessons: [
      {
        lessonId: 3,
        title: "Pay to a Bank Account",
        description:
          "Learn to make UPI payments to the bank account of receiver.",
        progress: "000",
      },
      {
        lessonId: 2,
        title: "Pay to a Mobile Number",
        description:
          "Learn to make UPI payments to the mobile number of receiver.",
        progress: "000",
      },
      {
        lessonId: 1,
        title: "Pay using QR code",
        description: "Learn to make UPI payments by scanning QR codes.",
        progress: "000",
      },
    ],
  },
};

// API Response Interfaces
export interface TutorialDetailResponse {
  message: string;
  body: TutorialDetail;
}

export interface TutorialDetail {
  assignmentId: number;
  courseId: number;
  title: string;
  photoUrl: string;
  status: string;
  lessons: Lesson[];
}

export interface Lesson {
  lessonId: number;
  title: string;
  description: string;
  progress: string; // 0-100 representing percentage
}

const TutorialDetailPage = () => {
  const router = useRouter();
  const { courseId, assignmentId } = useLocalSearchParams<{
    courseId: string;
    assignmentId: string;
  }>();
     
  const [tutorial, setTutorial] = useState<TutorialDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTutorialDetail();
  }, []);

  const fetchTutorialDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get bearer token from AsyncStorage
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://tutex-vq6j.onrender.com/user/tutorial/${assignmentId}`,
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

      const data: TutorialDetailResponse = await response.json();
      setTutorial(data.body);
    } catch (err) {
      console.error("Error fetching tutorial detail:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch tutorial");
      setTutorial(sampleData.body);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgressPercentage = (progressString: string): number => {
    if (!progressString) return 0;
    const total = progressString.length;
    const completed = progressString
      .split("")
      .filter((ch) => ch === "1").length;
    return Math.round((completed / total) * 100);
  };

  const handleLessonPress = async (lesson: Lesson) => {
    await AsyncStorage.setItem("selectedLesson", JSON.stringify(lesson));
    router.push({
      pathname: `/(main)/(main-routes)/LessonDetailPage`,
      params: { courseId: String(courseId), assignmentId: String(assignmentId), lessonId: String(lesson.lessonId) },
    } as any);
  };

  const handleSeeAnalytics = () => {
    router.push(`/`);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading tutorial...</Text>
      </View>
    );
  }

  if (tutorial)
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Tutorial Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
          </View>

          {/* Lessons List */}
          <View style={styles.lessonsContainer}>
            {tutorial.lessons.sort((a, b) => a.lessonId - b.lessonId).map((lesson, index) => (
              <TouchableOpacity
                key={lesson.lessonId}
                style={styles.lessonCard}
                onPress={() => handleLessonPress(lesson)}
                activeOpacity={0.7}
              >
                <View style={styles.lessonContent}>
                  <View style={styles.lessonHeader}>
                    <Text style={styles.lessonNumber}>
                      Lesson · {index + 1}
                    </Text>
                    <Text style={styles.chevron}>›</Text>
                  </View>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>

                  {/* Progress Bar */}
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${calculateProgressPercentage(
                            lesson.progress
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* See Analytics Button */}
          <View style={styles.analyticsButtonContainer}>
            <TouchableOpacity
              style={styles.analyticsButton}
              onPress={handleSeeAnalytics}
              activeOpacity={0.8}
            >
              <Text style={styles.analyticsButtonText}>See Analytics</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#E53935",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  titleContainer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tutorialTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  lessonsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  lessonCard: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lessonContent: {
    padding: 16,
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  lessonNumber: {
    fontSize: 12,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chevron: {
    fontSize: 24,
    color: "#CCC",
    fontWeight: "300",
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  analyticsButtonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  analyticsButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#2196F3",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  analyticsButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TutorialDetailPage;
