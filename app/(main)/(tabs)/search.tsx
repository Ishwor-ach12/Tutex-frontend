// (tabs)/search.tsx
import SearchBar from '@/app/customComponents/SearchBar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Types
interface Tutorial {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  tutor: {
    id: string;
    name: string;
    avatar?: string;
  };
  duration?: number;
  rating?: number;
  price?: number;
  category?: string;
}

const Search = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Replace with your backend URL
  const API_BASE_URL = 'https://your-backend-url.com/api';

  const categories = [
    'All',
    'Programming',
    'Design',
    'Business',
    'Music',
    'Photography',
    'Fitness',
  ];

  // Debounce utility
  let searchTimeout: number;
  const debounce = (func: Function, delay: number) => {
    return (...args: any[]) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch tutorials from backend
  const searchTutorials = async (query: string, category?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (category && category !== 'All') params.append('category', category);

      const response = await fetch(`${API_BASE_URL}/search?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization if needed
          // 'Authorization': `Bearer ${yourToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.tutorials || []);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tutorials');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string, category?: string) => {
      if (query.trim().length > 0) {
        searchTutorials(query, category);
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 500),
    []
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text, selectedCategory || undefined);
  };

  const handleCategorySelect = (category: string) => {
    const newCategory = category === 'All' ? null : category;
    setSelectedCategory(newCategory);
    if (searchQuery.trim().length > 0) {
      searchTutorials(searchQuery, newCategory || undefined);
    }
  };

  const handleTutorialPress = (tutorial: Tutorial) => {
    // router.push(`/(main)/(main-routes)/tutorial/${tutorial.id}`);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (searchQuery.trim().length > 0) {
      searchTutorials(searchQuery, selectedCategory || undefined).finally(() => {
        setRefreshing(false);
      });
    } else {
      setRefreshing(false);
    }
  }, [searchQuery, selectedCategory]);

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search tutorials..."
        />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              (selectedCategory === category ||
                (category === 'All' && !selectedCategory)) &&
                styles.categoryChipActive,
            ]}
            onPress={() => handleCategorySelect(category)}
          >
            <Text
              style={[
                styles.categoryText,
                (selectedCategory === category ||
                  (category === 'All' && !selectedCategory)) &&
                  styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Loading State */}
      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0d6efd" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#dc3545" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => searchTutorials(searchQuery, selectedCategory || undefined)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty State */}
      {!isLoading && !error && hasSearched && results.length === 0 && (
        <View style={styles.centerContainer}>
          <Ionicons name="search-outline" size={64} color="#6c757d" />
          <Text style={styles.emptyText}>No tutorials found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search or filters
          </Text>
        </View>
      )}

      {/* Initial State */}
      {!isLoading && !hasSearched && results.length === 0 && (
        <View style={styles.centerContainer}>
          <Ionicons name="compass-outline" size={64} color="#6c757d" />
          <Text style={styles.emptyText}>Start searching</Text>
          <Text style={styles.emptySubtext}>
            Find tutorials on any topic you're interested in
          </Text>
        </View>
      )}

      {/* Results */}
      {!isLoading && results.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsCount}>
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </Text>
          {results.map((tutorial) => (
            <TouchableOpacity
              key={tutorial.id}
              style={styles.tutorialCard}
              onPress={() => handleTutorialPress(tutorial)}
              activeOpacity={0.7}
            >
              {/* Thumbnail */}
              <View style={styles.thumbnailContainer}>
                {tutorial.thumbnail ? (
                  <Image
                    source={{ uri: tutorial.thumbnail }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
                    <Ionicons name="play-circle-outline" size={40} color="#fff" />
                  </View>
                )}
                {tutorial.duration && (
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>
                      {formatDuration(tutorial.duration)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Tutorial Info */}
              <View style={styles.tutorialInfo}>
                <Text style={styles.tutorialTitle} numberOfLines={2}>
                  {tutorial.title}
                </Text>
                <Text style={styles.tutorialDescription} numberOfLines={2}>
                  {tutorial.description}
                </Text>

                {/* Tutor Info */}
                <View style={styles.tutorContainer}>
                  {tutorial.tutor.avatar ? (
                    <Image
                      source={{ uri: tutorial.tutor.avatar }}
                      style={styles.tutorAvatar}
                    />
                  ) : (
                    <View style={[styles.tutorAvatar, styles.tutorAvatarPlaceholder]}>
                      <Ionicons name="person" size={16} color="#6c757d" />
                    </View>
                  )}
                  <Text style={styles.tutorName}>{tutorial.tutor.name}</Text>
                </View>

                {/* Meta Info */}
                <View style={styles.metaContainer}>
                  {tutorial.category && (
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {tutorial.category}
                      </Text>
                    </View>
                  )}
                  {tutorial.rating && (
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#ffc107" />
                      <Text style={styles.ratingText}>
                        {tutorial.rating.toFixed(1)}
                      </Text>
                    </View>
                  )}
                  {tutorial.price !== undefined && (
                    <Text style={styles.priceText}>
                      {tutorial.price === 0 ? 'Free' : `$${tutorial.price}`}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchSection: {
    padding: 16,
    paddingBottom: 8,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryContent: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  categoryChipActive: {
    backgroundColor: '#0d6efd',
    borderColor: '#0d6efd',
  },
  categoryText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#0d6efd',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  resultsContainer: {
    padding: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
    fontWeight: '500',
  },
  tutorialCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    backgroundColor: '#0d6efd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tutorialInfo: {
    padding: 16,
  },
  tutorialTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  tutorialDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
    lineHeight: 20,
  },
  tutorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tutorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  tutorAvatarPlaceholder: {
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorName: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#e7f1ff',
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#0d6efd',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '600',
  },
  priceText: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: '700',
  },
});

export default Search;