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

export interface Lesson {
  lessonId: number;
  title: string;
  description: string;
  progress: string;
}

interface ModuleItem {
  name: string;
  displayName: string;
  status: "completed" | "incomplete";
}

const LessonDetailPage = () => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const { courseId, assignmentId, lessonId } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const storedLesson = await AsyncStorage.getItem("selectedLesson");
        if (storedLesson) {
          setLesson(await JSON.parse(storedLesson));
        }
      } catch (error) {
        console.error("Error fetching lesson:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, []);

  const calculateProgressPercentage = (progressString: string): number => {
    if (!progressString) return 0;
    const total = progressString.length;
    const completed = progressString
      .split("")
      .filter((ch) => ch === "1").length;
    return Math.round((completed / total) * 100);
  };

  const getModules = (): ModuleItem[] => {
    if (!lesson) return [];

    return [
      {
        name: "walkthrough",
        displayName: "Walkthrough",
        status: lesson.progress[0] == "1" ? "completed" : "incomplete",
      },
      {
        name: "practice",
        displayName: "Practice",
        status: lesson.progress[1] == "1" ? "completed" : "incomplete",
      },
      {
        name: "assessment",
        displayName: "Assessment",
        status: lesson.progress[2] == "1" ? "completed" : "incomplete",
      },
    ];
  };

  const handleModulePress =async (moduleName: string) => {
    const loadLesson = {courseId, assignmentId, lessonId, moduleName};
    await AsyncStorage.setItem("loadedLesson", JSON.stringify(loadLesson))
    router.push(
      `/(tutorials)/${courseId}/lessons/${lessonId}/${moduleName}/startPage` as any
    );
  };

  const handleNextLesson = async () => {
    const nextLessonId = parseInt(lessonId as string) + 1;

    // // Check if there's a next lesson in AsyncStorage
    // // You might want to store the total lesson count or list of lessons
    // try {
    //   const totalLessonsStr = await AsyncStorage.getItem('totalLessons');
    //   const totalLessons = totalLessonsStr ? parseInt(totalLessonsStr) : null;

    //   if (totalLessons && nextLessonId > totalLessons) {
    //     // Last lesson - navigate back to course or show completion
    //     alert('Congratulations! You have completed all lessons.');
    //     router.back();
    //     return;
    //   }
    // } catch (error) {
    //   console.error('Error checking total lessons:', error);
    // }

    // Navigate to next lesson
    router.push(
      `/(main)/(main-routes)/LessonDetailPage?courseId=${courseId}&assignmentId=${assignmentId}&lessonId=${nextLessonId}` as any
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Lesson not found</Text>
      </View>
    );
  }

  const modules = getModules();
  const progressPercentage = calculateProgressPercentage(lesson.progress);

  return (
    <ScrollView style={styles.container}>
      {/* Lesson Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.lessonNumber}>Lesson {lesson.lessonId}</Text>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonDescription}>{lesson.description}</Text>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercentage}%` },
            ]}
          />
        </View>
      </View>

      {/* Modules List */}
      <View style={styles.modulesContainer}>
        {modules.map((module, index) => (
          <TouchableOpacity
            key={index}
            style={styles.moduleCard}
            onPress={() => handleModulePress(module.name)}
            activeOpacity={0.7}
          >
            <View style={styles.moduleContent}>
              <Text style={styles.moduleName}>{module.displayName}</Text>
            </View>
            <View style={styles.moduleStatus}>
              {module.status === "completed" ? (
                <View style={styles.completedIcon}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              ) : (
                <View style={styles.incompleteIcon} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Lesson Button */}
      <View style={styles.nextLessonContainer}>
        <TouchableOpacity
          style={styles.nextLessonButton}
          onPress={handleNextLesson}
          activeOpacity={0.8}
        >
          <Text style={styles.nextLessonButtonText}>Next Lesson</Text>
        </TouchableOpacity>
      </View>

      {/* Analytics Section */}
      <View style={styles.analyticsContainer}>
        <Text style={styles.analyticsTitle}>Analytics</Text>
        <View style={styles.analyticsPlaceholder}>
          {/* Add your analytics content here */}
          <Text style={styles.analyticsPlaceholderText}>
            Analytics data will appear here
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  errorText: {
    fontSize: 16,
    color: "#E53935",
  },
  headerContainer: {
    backgroundColor: "#E8E8E8",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  lessonNumber: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  lessonDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#D0D0D0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 3,
  },
  modulesContainer: {
    padding: 16,
  },
  moduleCard: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  moduleContent: {
    flex: 1,
  },
  moduleName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  moduleScore: {
    fontSize: 14,
    color: "#999",
    marginTop: 2,
  },
  moduleStatus: {
    marginLeft: 12,
  },
  completedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  incompleteIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D0D0D0",
    backgroundColor: "#FFF",
  },
  nextLessonContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  nextLessonButton: {
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
  nextLessonButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  analyticsContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  analyticsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  analyticsPlaceholder: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 40,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  analyticsPlaceholderText: {
    fontSize: 14,
    color: "#999",
  },
});

export default LessonDetailPage;
