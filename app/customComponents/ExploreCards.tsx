import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EXPLORE_ITEM_WIDTH, ITEM_MARGIN, NUM_COLUMNS, Tutorial } from './typesAndDimensions';

const exploreData: Tutorial[] = [
  { id: "yl1", title: "Web Development Basics", lessons: 5 , image: require("../../assets/instagram.png"), status: "Ongoing"},
  { id: "yl2", title: "Data Structures 101", lessons: 3,  image: require("../../assets/amazon.png"), status: "Ongoing"},
  { id: "yl3", title: "Mobile App Design", lessons: 8,  image:  require("../../assets/facebook.png"), status: "Ongoing"},
  { id: "yl4", title: "Advanced React Native", lessons: 2,  image: require("../../assets/phonepeBanner.png"), status: "Ongoing"},
];



const ExploreCard: React.FC<{ item: Tutorial }> = ({ item }) => {
  const router = useRouter(); // ✅ hook at top level

  const handlePress = () => {
    router.push("/(main)/(tutorials)/SampleTutorial/DetailPage");
  };

  return (
    <TouchableOpacity
      style={[styles.exploreCard, { width: EXPLORE_ITEM_WIDTH }]}
      onPress={handlePress} // ✅ no arrow function needed unless you pass args
    >
      <Image source={item.image} style={styles.cardImage} />
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
        style={styles.gradientOverlay}
      />
      <View style={styles.exploreTextContainer}>
        <Text style={styles.exploreTitle}>{item.title}</Text>
        <Text style={styles.exploreLessons}>Lessons: {item.lessons}</Text>
      </View>
    </TouchableOpacity>
  );
};


const ExploreCards = () => {
      const renderExploreCard = ({ item }: ListRenderItemInfo<Tutorial>) => (
        <ExploreCard item={item} />
      );
  return (
    <>
        <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Explore</Text>
              </View>
        
              <FlatList
                data={exploreData}
                renderItem={renderExploreCard}
                keyExtractor={(item) => item.id}
                numColumns={NUM_COLUMNS}
                scrollEnabled={false} // Important: Disable internal scrolling to allow the parent ScrollView to handle it
                columnWrapperStyle={styles.exploreColumnWrapper}
                contentContainerStyle={styles.exploreListContainer}
              />
    </>
  )
}

const styles = StyleSheet.create({
    gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    // The gradient covers the entire card area
    borderRadius: 10,
},
    
    cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    borderRadius: 10, // Must match lessonCard's borderRadius
  },
    sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
    exploreListContainer: {
    paddingHorizontal: ITEM_MARGIN,
    paddingBottom: 20,
  },
  exploreColumnWrapper: {
    justifyContent: "space-between",
    marginBottom: ITEM_MARGIN,
  },
  exploreCard: {
    height: 280,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f0f0f0", // Fallback
  },
  exploreTextContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  exploreTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  exploreLessons: {
    color: "white",
    fontSize: 12,
    marginTop: 2,
  },
})
export default ExploreCards