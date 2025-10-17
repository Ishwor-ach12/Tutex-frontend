// (main-routes)/tutorial/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


export interface CourseResponse {
  message: string;
  body: Course;
}

export interface Course {
  courseId: number;
  title: string;
  photoUrl: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  Lessons: Lesson[];
}

export interface Lesson {
  lessonId: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  courseId: number;
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
  const API_BASE_URL = 'https://tutex-vq6j.onrender.com';

  useEffect(() => {
    fetchTutorialDetail();
  }, [id]);

  const fetchTutorialDetail = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/tutorial/${id}`, {
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
                "lessonId": 1,
                "title": "Pay using QR code",
                "description": "Learn to make UPI payments by scanning QR codes.",
                "createdAt": "2025-04-12T17:15:03.000Z",
                "updatedAt": "2025-04-12T17:15:03.000Z",
                "courseId": 1
            },
            {
                "lessonId": 2,
                "title": "Pay to a Mobile Number",
                "description": "Learn to make UPI payments to the mobile number of receiver.",
                "createdAt": "2025-04-12T17:16:18.000Z",
                "updatedAt": "2025-04-12T17:16:18.000Z",
                "courseId": 1
            },
            {
                "lessonId": 3,
                "title": "Pay to a Bank Account",
                "description": "Learn to make UPI payments to the bank account of receiver.",
                "createdAt": "2025-04-12T17:16:55.000Z",
                "updatedAt": "2025-04-12T17:16:55.000Z",
                "courseId": 1
            }
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
            key={lesson.lessonId}
            style={styles.lessonItem}
            onPress={() => handleLessonPress(lesson)}
            activeOpacity={0.7}
          >
            <Text style={styles.lessonNumber}>
              Lesson - {lesson.lessonId}
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