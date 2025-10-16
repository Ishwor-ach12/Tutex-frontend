import SearchBar from '@/app/customComponents/SearchBar'
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

const Search = () => {
  return (
    <ScrollView style={styles.container}>
      <SearchBar/>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "white"
    }
})
export default Search