import { Dimensions } from 'react-native';

// --- Type Definitions ---
export type Tutorial = {
  id: string;
  title: string;
  lessons: number;
  image: number;
  status:string;
};

export interface AllCourseResponse {
  message: string;
  body: Course[];
}

export interface Course {
  courseId: number;
  title: string;
  photoUrl: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
export interface SubscribedCourseResonse {
  message: string;
  body: SubscribedCourse[];
}

export interface SubscribedCourse {
  assignmentId: number,
  status: string,
  courseId: number;
  title: string;
  photoUrl: string;
  slug: string;
}

// --- Dimension Calculations ---
const { width } = Dimensions.get('window');
export const ITEM_MARGIN = 15;
export const NUM_COLUMNS = 2;
// Explore: Two columns, three margins (left, middle, right)
export const EXPLORE_ITEM_WIDTH = (width - ITEM_MARGIN * 3) / NUM_COLUMNS;
// Lesson Card: Single horizontal item (35% of width)
export const LESSON_CARD_WIDTH = width * 0.35;
export const LESSON_CARD_WIDTH_LARGE = width * 0.45;
