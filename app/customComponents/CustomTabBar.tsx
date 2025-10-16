// CustomTabBar.tsx (You can put this in a separate file or inline in MainLayout.tsx)

import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Helper function to get the correct icon name
const getIconName = (routeName: string, isFocused: boolean): string => {
  switch (routeName) {
    case '(tabs)/home':
      return isFocused ? 'home' : 'home-outline';
    case '(tabs)/analytics':
      return isFocused ? 'bar-chart' : 'bar-chart-outline';
    case '(tabs)/search':
      return isFocused ? 'search' : 'search-outline';
    case '(tabs)/profile':
      return isFocused ? 'person' : 'person-outline';
    default:
      return 'help-circle-outline';
  }
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const router = useNavigation(); // Use useNavigation or useRouter if needed

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label = options.title !== undefined ? options.title : route.name;
        const iconName = getIconName(route.name, isFocused);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // Navigate to the new tab
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            // testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarButton}
          >
            <Ionicons
              name={iconName as any} // Cast to 'any' for simpler icon handling
              size={24}
              color={isFocused ? '#0d6efd' : '#888'} // Custom active/inactive colors
            />
            <Text style={{ color: isFocused ? '#0d6efd' : '#888', fontSize: 12 }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 70, // Custom height for the navbar
    backgroundColor: 'white', // Custom background color
    borderTopWidth: 1,
    borderTopColor: '#f0ffdf', // Custom separator line
    paddingBottom: 10, // Account for bottom safe area
  },
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
});

export default CustomTabBar