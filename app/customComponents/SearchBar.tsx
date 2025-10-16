import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

const SearchBar = () => {
    const router = useRouter();
    
  return (
    <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#888"
        />
        <Ionicons
          name="search"
          size={24}
          color="#888"
          style={styles.searchIcon}
        />
      </View>
  )
}
const styles = StyleSheet.create({
searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    height:60,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 5,
  },
  searchIcon: {
    marginLeft: 5,
  },
})
export default SearchBar