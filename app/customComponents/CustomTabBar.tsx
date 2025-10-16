// CustomTabBar.tsx
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
  const router = useNavigation();

  // Define which routes should be visible in the tab bar
  const visibleRoutes = ['(tabs)/home', '(tabs)/search', '(tabs)/analytics', '(tabs)/profile'];

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        // Skip routes that shouldn't be in the tab bar
        if (!visibleRoutes.includes(route.name)) {
          return null;
        }

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
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarButton}
          >
            <Ionicons
              name={iconName as any}
              size={24}
              color={isFocused ? '#0d6efd' : '#888'}
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
    height: 70,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0ffdf',
    paddingBottom: 10,
  },
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
});

export default CustomTabBar;