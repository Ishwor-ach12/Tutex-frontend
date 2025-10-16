// import { Ionicons } from '@expo/vector-icons'
// import { useRouter } from 'expo-router'
// import React from 'react'
// import { StyleSheet, TextInput, View } from 'react-native'

// const SearchBar = () => {
//     const router = useRouter();
    
//   return (
//     <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search"
//           placeholderTextColor="#888"
//         />
//         <Ionicons
//           name="search"
//           size={24}
//           color="#888"
//           style={styles.searchIcon}
//         />
//       </View>
//   )
// }
// const styles = StyleSheet.create({
// searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//     height:60,
//     marginBottom: 25,
//     paddingHorizontal: 10,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     fontSize: 16,
//     paddingHorizontal: 5,
//   },
//   searchIcon: {
//     marginLeft: 5,
//   },
// })
// export default SearchBar


// customComponents/SearchBar.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
}) => {
  const handleClear = () => {
    onChangeText('');
    if (onClear) onClear();
  };

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#6c757d" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#adb5bd"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color="#6c757d" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#212529',
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default SearchBar;