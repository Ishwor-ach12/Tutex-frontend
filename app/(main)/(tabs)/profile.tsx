import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useRouter } from "expo-router";
import { t } from "i18next";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface UserProfileType {
  profileId: number;
  name: string;
  gender: "M" | "F" | string;
  dob: string;
  email: string;
  profileUrl: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

// --- Utility Functions ---
const handlePress = (title: string) => {
  console.log(`Action: ${title} pressed`);
};

// --- Reusable Component 1: ProfileHeader ---
const ProfileHeader = ({
  user,
  onEditPress,
}: {
  user: UserProfileType | null;
  onEditPress: () => void;
}) => {
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
          <Image
            source={{ uri: user.profileUrl }}
            style={styles.avatarPlaceholder}
          />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.usernameText}>{user.name}</Text>
        <Text style={styles.detailText}>{user.email}</Text>
        <Text style={styles.detailText}>Age: {age}</Text>
        <Text style={styles.detailText}>Gender: {user.gender || "N/A"}</Text>

        {/* Edit Button */}
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Text style={styles.editButtonText}>
          {`${t("static_text.profile_edit")}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Reusable Component 2: SettingItem ---
const SettingItem = ({
  title,
  iconName,
  isSignout = false,
  onPress,
}: {
  title: string;
  iconName: string;
  isSignout?: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        isSignout ? styles.signoutItem : styles.defaultItem,
      ]}
      onPress={onPress}
    >
      <View style={styles.settingContent}>
        <Ionicons
          name={iconName as any}
          size={24}
          color={isSignout ? "#E53E3E" : "#4A5568"}
          style={styles.icon}
        />
        <Text style={[styles.settingTitle, isSignout && styles.signoutText]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Main Component: Profile (App) ---
const settingsList = [
  {
    title: "static_text.profile_lp",
    icon: "bar-chart-outline",
    action: "progress",
  },
  {
    title: "static_text.profile_as",
    icon: "contrast-outline",
    action: "accessibility",
  },
  {
    title: "static_text.profile_cp",
    icon: "lock-closed-outline",
    action: "change_password",
  },
  {
    title: "static_text.profile_lang",
    icon: "language-outline",
    action: "language",
  },
  {
    title: "static_text.profile_notset",
    icon: "notifications-outline",
    action: "notifications",
  },
  {
    title: "static_text.profile_help",
    icon: "help-circle-outline",
    action: "help",
  },
  {
    title: "static_text.profile_tnc",
    icon: "document-text-outline",
    action: "legal",
  },
];

export default function Profile() {
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const userStr = await AsyncStorage.getItem("userProfile");
          if (userStr) {
            setUserProfile(JSON.parse(userStr));
          }
        } catch (err) {
          console.error("Error loading updated profile:", err);
        }
      };

      loadProfile();
    }, [])
  );

  const onEditProfile = () => {
    router.push({
      pathname: "/(main)/(tabs)/edit-profile",
      params: {
        name: userProfile?.name,
        dob: userProfile?.dob,
        gender: userProfile?.gender,
        email: userProfile?.email,
        profileUrl: userProfile?.profileUrl ?? "",
        userId: String(userProfile?.userId),
      },
    });
  };

  const onSettingPress = (title: string, action: string) => {
    switch (action) {
      case "language":
        console.log("Pressed:", title);
        router.push("/(main)/(tabs)/language-preference");
        break;
      case "change_password":
        router.push("/(main)/(tabs)/changePassword");
        break;
      default:
        console.log("Pressed:", title);
    }
  };

  const onSignOut = async () => {
    await AsyncStorage.removeItem("userProfile");
    await AsyncStorage.removeItem("authToken");
    router.replace("/(auth)/Login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <ProfileHeader user={userProfile} onEditPress={onEditProfile} />

        <View style={styles.settingsList}>
          {settingsList.map((item) => (
            <SettingItem
              key={item.title}
              title={t(item.title)}
              iconName={item.icon}
              onPress={() => onSettingPress(item.title, item.action)}
            />
          ))}

          <SettingItem
            title={t("static_text.profile_logout")}
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
  safeArea: { flex: 1, backgroundColor: "#F7FAFC" },
  container: { flex: 1 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
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
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E2E8F0",
    borderWidth: 2,
    borderColor: "#CBD5E0",
  },
  infoContainer: { flex: 1, position: "relative", justifyContent: "center" },
  usernameText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 2,
  },
  detailText: { fontSize: 14, color: "#718096", lineHeight: 20 },
  editButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#4299E1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: { color: "white", fontWeight: "600", fontSize: 14 },
  settingsList: { marginTop: 20 },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 25,
    paddingHorizontal: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#EDF2F7",
  },
  defaultItem: { borderBottomWidth: 1 },
  signoutItem: {
    marginTop: 0,
    borderBottomWidth: 0,
    borderRadius: 12,
    paddingVertical: 20,
    marginBottom: 20,
  },
  settingContent: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: 7 },
  settingTitle: { fontSize: 16, color: "#4A5568", fontWeight: "500" },
  signoutText: { color: "#E53E3E", fontWeight: "600" },
});
