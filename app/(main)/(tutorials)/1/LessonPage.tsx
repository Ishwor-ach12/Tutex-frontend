import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const sampleData = {
  "message": "Successfully retrieved tutorial details",
  "body": {
    "tutorialId": 1,
    "title": "UPI Transaction Tutorial",
    "photoUrl": "upiTutorialBanner.png",
    "slug": "upi-transaction-tutorial",
    "createdAt": "2025-04-12T17:08:54.000Z",
    "updatedAt": "2025-10-16T18:30:10.000Z",
    "lessons": [
      {
        "lessonId": 1,
        "title": "Introduction to UPI",
        "order": 1,
        "progress": 100,
        "slug": "introduction-to-upi",
        "isCompleted": true
      },
      {
        "lessonId": 2,
        "title": "Setting Up a UPI App",
        "order": 2,
        "progress": 100,
        "slug": "setting-up-upi-app",
        "isCompleted": true
      },
      {
        "lessonId": 3,
        "title": "Pay Using QR Code",
        "order": 3,
        "progress": 70,
        "slug": "pay-using-qr-code",
        "isCompleted": false
      },
      {
        "lessonId": 4,
        "title": "Pay to Mobile Number",
        "order": 4,
        "progress": 40,
        "slug": "pay-to-mobile-number",
        "isCompleted": false
      },
      {
        "lessonId": 5,
        "title": "Pay to Bank Account",
        "order": 5,
        "progress": 0,
        "slug": "pay-to-bank-account",
        "isCompleted": false
      },
      {
        "lessonId": 6,
        "title": "Transaction History and Limits",
        "order": 6,
        "progress": 0,
        "slug": "transaction-history-and-limits",
        "isCompleted": false
      },
      {
        "lessonId": 7,
        "title": "UPI Safety and Security Tips",
        "order": 7,
        "progress": 0,
        "slug": "upi-safety-and-security-tips",
        "isCompleted": false
      }
    ]
  }
}

// API Response Interfaces
export interface TutorialDetailResponse {
  message: string;
  body: TutorialDetail;
}

export interface TutorialDetail {
  tutorialId: number;
  title: string;
  photoUrl: string;
  slug: string;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  lessonId: number;
  title: string;
  order: number;
  progress: number; // 0-100 representing percentage
  slug: string;
  isCompleted: boolean;
}

const TutorialDetailPage = () => {
  const router = useRouter();
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
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      // Replace with actual tutorial ID/slug from navigation params
      const tutorialSlug = 'sample-tutorial'; // Get this from route params
      
      const response = await fetch(
        `https://tutex-vq6j.onrender.com/tutorial/${tutorialSlug}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TutorialDetailResponse = await response.json();
      setTutorial(data.body);
    } catch (err) {
      console.error('Error fetching tutorial detail:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tutorial');
      setTutorial(sampleData.body);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonPress = (lesson: Lesson) => {
    // Navigate to lesson detail page
    router.push(`/`);
  };

  const handleSeeAnalytics = () => {
    // Navigate to analytics page
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

//   if (error || !tutorial) {
//     return (
//       <View style={styles.centerContainer}>
//         <Text style={styles.errorText}>{error || 'Tutorial not found'}</Text>
//         <TouchableOpacity
//           style={styles.retryButton}
//           onPress={fetchTutorialDetail}
//         >
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Tutorial Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
        </View>

        {/* Lessons List */}
        <View style={styles.lessonsContainer}>
          {tutorial.lessons
            .sort((a, b) => a.order - b.order)
            .map((lesson, index) => (
              <TouchableOpacity
                key={lesson.lessonId}
                style={styles.lessonCard}
                onPress={() => handleLessonPress(lesson)}
                activeOpacity={0.7}
              >
                <View style={styles.lessonContent}>
                  <View style={styles.lessonHeader}>
                    <Text style={styles.lessonNumber}>Lesson · {index + 1}</Text>
                    <Text style={styles.chevron}>›</Text>
                  </View>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  
                  {/* Progress Bar */}
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${lesson.progress}%` }
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
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#E53935',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  titleContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tutorialTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  lessonsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  lessonCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lessonNumber: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chevron: {
    fontSize: 24,
    color: '#CCC',
    fontWeight: '300',
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  analyticsButtonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  analyticsButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  analyticsButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TutorialDetailPage;