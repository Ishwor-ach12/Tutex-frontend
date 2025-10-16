// (main-routes)/tutorial/[id].tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Lesson {
  id: string;
  lessonNumber: number;
  title: string;
  duration?: number;
  isCompleted?: boolean;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

const TutorialDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Replace with your backend URL
  const API_BASE_URL = 'https://your-backend-url.com/api';

  useEffect(() => {
    fetchTutorialDetail();
  }, [id]);

  const fetchTutorialDetail = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/tutorials/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization if needed
          // 'Authorization': `Bearer ${yourToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTutorial(data);
    } catch (error) {
      console.error('Error fetching tutorial:', error);
      
      // Sample data for development (when backend is not ready)
      setTutorial({
        id: id as string,
        title: 'Tutorial Title',
        description: 'description of the course',
        lessons: [
          {
            id: '1',
            lessonNumber: 1,
            title: 'Lesson Title',
            duration: 15,
            isCompleted: false,
          },
          {
            id: '2',
            lessonNumber: 2,
            title: 'Lesson Title',
            duration: 20,
            isCompleted: false,
          },
          {
            id: '3',
            lessonNumber: 3,
            title: 'Lesson Title',
            duration: 18,
            isCompleted: false,
          },
          {
            id: '4',
            lessonNumber: 4,
            title: 'Lesson Title',
            duration: 25,
            isCompleted: false,
          },
          {
            id: '5',
            lessonNumber: 5,
            title: 'Lesson Title',
            duration: 22,
            isCompleted: false,
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCourse = () => {
    if (tutorial && tutorial.lessons.length > 0) {
      // Navigate to first lesson or lesson page
    //   router.push(`/(main)/(main-routes)/lesson/${tutorial.lessons[0].id}`);
    }
  };

  const handleLessonPress = (lesson: Lesson) => {
    // Navigate to specific lesson
    // router.push(`/(main)/(main-routes)/lesson/${lesson.id}`);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d6efd" />
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

  return (
    <ScrollView style={styles.container}>
      {/* Tutorial Title */}
      <Text style={styles.title}>{tutorial.title}</Text>

      {/* Description Box */}
      <View style={styles.descriptionBox}>
        <Text style={styles.description}>{tutorial.description}</Text>
      </View>

      {/* Start Course Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartCourse}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Start Course</Text>
        </TouchableOpacity>
      </View>

      {/* Lessons Section */}
      <Text style={styles.lessonsTitle}>Lessons:</Text>

      {/* Lessons List */}
      <View style={styles.lessonsList}>
        {tutorial.lessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            style={styles.lessonItem}
            onPress={() => handleLessonPress(lesson)}
            activeOpacity={0.7}
          >
            <Text style={styles.lessonNumber}>
              Lesson - {lesson.lessonNumber}
            </Text>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000',
    marginBottom: 16,
  },
  descriptionBox: {
    backgroundColor: '#d3d3d3',
    padding: 20,
    minHeight: 150,
    justifyContent: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#d3d3d3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  startButtonText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  lessonsTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
    marginBottom: 16,
  },
  lessonsList: {
    gap: 12,
  },
  lessonItem: {
    backgroundColor: '#d3d3d3',
    padding: 16,
    borderRadius: 4,
  },
  lessonNumber: {
    fontSize: 12,
    color: '#000',
    marginBottom: 4,
    fontWeight: '400',
  },
  lessonTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
  },
});

export default TutorialDetail;