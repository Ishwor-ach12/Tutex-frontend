import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface UserProfileType {
  profileId: number;
  name: string;
  gender: "M" | "F" | string; // assuming gender could be other values too
  dob: string; // ISO date string
  email: string;
  profileUrl: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  userId: number;
}

// --- Utility Functions ---
const handlePress = (title: string) => {
  console.log(`Action: ${title} pressed`);
};

// --- Reusable Component 1: ProfileHeader ---
const ProfileHeader = ({ user, onEditPress }: { user: UserProfileType | null; onEditPress: () => void }) => {

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (!user) return null;

  const age = calculateAge(user.dob);

  return (
    <View style={styles.headerContainer}>
      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        {user.profileUrl ? (
          <Image source={{ uri: user.profileUrl }} style={styles.avatarPlaceholder} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.usernameText}>{user.name}</Text>
        <Text style={styles.detailText}>{user.email}</Text>
        <Text style={styles.detailText}>Age: {age}</Text>
        <Text style={styles.detailText}>Gender: {user.gender || 'N/A'}</Text>

        {/* Edit Button */}
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Reusable Component 2: SettingItem ---
const SettingItem = ({ title, iconName, isSignout = false, onPress }: { title: string; iconName: string; isSignout?: boolean; onPress: (title: string) => void }) => {
  return (
    <TouchableOpacity
      style={[styles.settingItem, isSignout ? styles.signoutItem : styles.defaultItem]}
      onPress={() => onPress(title)}
    >
      <View style={styles.settingContent}>
        {Ionicons && (
          <Ionicons size={24} color={isSignout ? '#E53E3E' : '#4A5568'} style={styles.icon} />
        )}
        <Text style={[styles.settingTitle, isSignout && styles.signoutText]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Main Component: Profile (App) ---
const settingsList = [
  { title: 'My Learning Progress', icon: 'bar-chart-outline', action: 'progress' },
  { title: 'Accessibility Settings', icon: 'contrast-outline', action: 'accessibility' },
  { title: 'Change Password & Security', icon: 'lock-closed-outline', action: 'security' },
  { title: 'Language Preferences', icon: 'language-outline', action: 'language' },
  { title: 'Notification Settings', icon: 'notifications-outline', action: 'notifications' },
  { title: 'Help & Feedback', icon: 'help-circle-outline', action: 'help' },
  { title: 'Terms of Use & Privacy', icon: 'document-text-outline', action: 'legal' },
];

export default function Profile() {
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfileString = await AsyncStorage.getItem("userProfile");
        if (userProfileString) {
          const userProfile: UserProfileType = JSON.parse(userProfileString);
          setUserProfile(userProfile);
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const onEditProfile = () => {
    handlePress('Edit Profile');
  };

  const onSignOut = async () => {
    await AsyncStorage.removeItem("userProfile");
    await AsyncStorage.removeItem("authToken");

    router.replace("/(auth)/Login")
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <ProfileHeader user={userProfile} onEditPress={onEditProfile} />

        <View style={styles.settingsList}>
          {settingsList.map(item => (
            <SettingItem
              key={item.title}
              title={item.title}
              iconName={item.icon}
              onPress={() => handlePress(item.title)}
            />
          ))}

          <SettingItem
            title="Signout"
            iconName="log-out-outline"
            isSignout={true}
            onPress={onSignOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7FAFC' },
  container: { flex: 1 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    paddingVertical: 40,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  avatarContainer: { marginRight: 20 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E2E8F0', borderWidth: 2, borderColor: '#CBD5E0' },
  infoContainer: { flex: 1, position: 'relative', justifyContent: 'center' },
  usernameText: { fontSize: 20, fontWeight: '700', color: '#2D3748', marginBottom: 2 },
  detailText: { fontSize: 14, color: '#718096', lineHeight: 20 },
  editButton: { position: 'absolute', top: 0, right: 0, backgroundColor: '#4299E1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  editButtonText: { color: 'white', fontWeight: '600', fontSize: 14 },
  settingsList: { marginTop: 20 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 25, paddingHorizontal: 15, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#EDF2F7' },
  defaultItem: { borderBottomWidth: 1 },
  signoutItem: { marginTop: 0, borderBottomWidth: 0, borderRadius: 12, paddingVertical: 20, marginBottom: 20 },
  settingContent: { flexDirection: 'row', alignItems: 'center' },
  icon: {},
  settingTitle: { fontSize: 16, color: '#4A5568', fontWeight: '500' },
  signoutText: { color: '#E53E3E', fontWeight: '600' },
});
