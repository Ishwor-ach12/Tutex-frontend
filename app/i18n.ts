// src/i18n.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization'; // Or react-native-localize
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 1. IMPORT YOUR TRANSLATION FILES
import en from '../locales/en.json';
import hi from '../locales/hi.json';
// Add all other languages here...

// 2. DEFINE THE RESOURCE MAP
const resources = {
  // 'en' language code maps to the imported 'en' object
  en: { translation: en }, 
  // 'hi' language code maps to the imported 'hi' object
  hi: { translation: hi },
  // Add more language mappings here...
};

// 3. STORAGE AND DETECTION CONFIGURATION
const languageDetector = {
  type: 'languageDetector',
  // Async storage key to save the user's last selection
  async: true, 
  detect: async (callback) => {
    try {
      // 1. Try to load saved language from storage
      const savedLng = await AsyncStorage.getItem('user-language');
      if (savedLng) {
        return callback(savedLng);
      }
    } catch (error) {
      console.error("Error fetching language from storage", error);
    }
    // 2. Fallback: Use device's locale (if no saved language)
    return callback(Localization.locale?.split('-')[0]); 
  },
  init: () => {},
  cacheUserLanguage: (language) => {
    // Save the new language selection
    AsyncStorage.setItem('user-language', language);
  },
};

// 4. INITIALIZE i18next
i18n
  .use(languageDetector) // Use our custom detector
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources, // <-- THIS IS WHERE YOUR JSON DATA IS LOADED
    fallbackLng: 'en', // Use English if the detected language is not supported
    debug: false,
    interpolation: {
      escapeValue: false, // React protects against XSS
    },
    react: {
      useSuspense: false, // Important for React Native
    }
  });

export default i18n;