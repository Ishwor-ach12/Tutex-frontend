import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


// --- Placeholder Icon Components ---
// These custom components are used to prevent compilation errors related to
// unresolved module paths like '@expo/vector-icons' while providing visual placeholders.


// --- Utility Functions ---
const handlePress = (title: string) => {
  // Replace with actual navigation or state change logic in a real app
  console.log(`Action: ${title} pressed`);
};

// --- Reusable Component 1: ProfileHeader ---
// This component displays the user's avatar and summary information.
const ProfileHeader = ({ user, onEditPress }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        {/* Placeholder for an Image component or just a gray circle */}
        <View style={styles.avatarPlaceholder} />
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.usernameText}>{user.name}</Text>
        <Text style={styles.detailText}>{user.email}</Text>
        <Text style={styles.detailText}>
          Age: {user.age || 'N/A'}
        </Text>
        <Text style={styles.detailText}>
          Gender: {user.gender || 'N/A'}
        </Text>

        {/* Edit Button */}
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={onEditPress}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Reusable Component 2: SettingItem ---
// This component renders a single, clickable setting row.
const SettingItem = ({ title, iconName, isSignout = false, onPress }) => {
  
  return (
    <TouchableOpacity 
      style={[
        styles.settingItem, 
        isSignout ? styles.signoutItem : styles.defaultItem
      ]} 
      onPress={() => onPress(title)}
    >
      <View style={styles.settingContent}>
        {Ionicons && (
          // Render the placeholder icon component
          <Ionicons
            size={24} 
            color={isSignout ? '#E53E3E' : '#4A5568'} 
            style={styles.icon} 
          />
        )}
        <Text style={[
          styles.settingTitle, 
          isSignout && styles.signoutText
        ]}>
          {title}
        </Text>
      </View>
      {/* Arrow Icon for navigation, not shown on Signout */}
      
    </TouchableOpacity>
  );
};

// --- Main Component: Profile (App) ---

const userProfile = {
  name: 'Account Username',
  email: 'accountMailHandle@email.com',
  age: '68',
  gender: 'Female',
};

const settingsList = [
  // Settings tailored for digitally illiterate learners
  { title: 'My Learning Progress', icon: 'bar-chart-outline', action: 'progress' },
  { title: 'Accessibility Settings', icon: 'contrast-outline', action: 'accessibility' },
  { title: 'Change Password & Security', icon: 'lock-closed-outline', action: 'security' },
  { title: 'Language Preferences', icon: 'language-outline', action: 'language' },
  { title: 'Notification Settings', icon: 'notifications-outline', action: 'notifications' },
  { title: 'Help & Feedback', icon: 'help-circle-outline', action: 'help' },
  { title: 'Terms of Use & Privacy', icon: 'document-text-outline', action: 'legal' },
];

export default function Profile() {
  const onEditProfile = () => {
    handlePress('Edit Profile');
  };

  const onSignOut = () => {
    // Implement actual sign out logic here (e.g., clear session, navigate to login)
    handlePress('Signout');
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <ProfileHeader user={userProfile} onEditPress={onEditProfile} />
        
        <View style={styles.settingsList}>
          {settingsList.map((item, index) => (
            <SettingItem
              key={item.title}
              title={item.title}
              iconName={item.icon}
              onPress={() => handlePress(item.title)}
            />
          ))}
          
          {/* Signout Button */}
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
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC', // Light gray background
  },
  container: {
    flex: 1,
    // paddingHorizontal: 20,
    // paddingTop: 10,
  },
  
  // --- Profile Header Styles ---
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 30,
    backgroundColor: 'white',
    padding: 20,
    paddingVertical:40,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E2E8F0', // Placeholder color
    borderWidth: 2,
    borderColor: '#CBD5E0',
  },
  infoContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  usernameText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 2,
  },
  detailText: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
  },
  editButton: {
    position: 'absolute',
    top: 0, 
    right: 0,
    backgroundColor: '#4299E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },

  // --- Settings List Styles ---
  settingsList: {
    marginTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 25,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#EDF2F7', // Light gray divider
  },
  defaultItem: {
    // Only apply border bottom for default items
    borderBottomWidth: 1,
  },
  signoutItem: {
    marginTop: 0,
    borderBottomWidth: 0, // No border for signout
    borderRadius: 12,
    paddingVertical: 20,
    marginBottom: 20,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    // Margin is handled by the placeholder component definition now for Ionicons
    // For AntDesign (arrow), it's handled by its parent layout.
  },
  settingTitle: {
    fontSize: 16,
    color: '#4A5568',
    fontWeight: '500',
  },
  signoutText: {
    color: '#E53E3E',
    fontWeight: '600',
  },
});
