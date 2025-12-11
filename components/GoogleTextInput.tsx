import { View, Image, TextInput, FlatList, TouchableOpacity, Text, ScrollView } from "react-native";
import { useState } from "react";
import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";
import { useLocationStore } from "@/store";

const GEOAPIFY_API_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;

interface Suggestion {
  properties: {
    formatted: string;
    lat: number;
    lon: number;
    place_id: string;
    distance?: number;
    city?: string;
    country?: string;
  };
}

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const { userLatitude, userLongitude } = useLocationStore();
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = async (text: string) => {
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      // Add user location bias to prioritize nearby results
      const biasParam = userLatitude && userLongitude 
        ? `&bias=proximity:${userLongitude},${userLatitude}`
        : '';
      
      // Add filter to limit search radius (50km)
      const filterParam = userLatitude && userLongitude
        ? `&filter=circle:${userLongitude},${userLatitude},50000`
        : '';

      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          text
        )}&limit=8${biasParam}${filterParam}&lang=en&apiKey=${GEOAPIFY_API_KEY}`
      );

      const data = await response.json();

      if (data.features) {
        // Calculate distance from user location for each suggestion
        const suggestionsWithDistance = data.features.map((feature: any) => {
          if (userLatitude && userLongitude) {
            const distance = calculateDistance(
              userLatitude,
              userLongitude,
              feature.properties.lat,
              feature.properties.lon
            );
            return {
              ...feature,
              properties: {
                ...feature.properties,
                distance,
              },
            };
          }
          return feature;
        });

        // Sort by distance (nearest first)
        suggestionsWithDistance.sort((a: any, b: any) => {
          if (a.properties.distance && b.properties.distance) {
            return a.properties.distance - b.properties.distance;
          }
          return 0;
        });

        setSuggestions(suggestionsWithDistance);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (degrees: number) => {
    return degrees * (Math.PI / 180);
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setSearchText(suggestion.properties.formatted);
    setSuggestions([]);
    setIsFocused(false);
    
    handlePress({
      latitude: suggestion.properties.lat,
      longitude: suggestion.properties.lon,
      address: suggestion.properties.formatted,
    });
  };

  return (
    <View className={`flex flex-col relative z-50 ${containerStyle}`}>
      <View 
        className="flex flex-row items-center justify-center rounded-xl"
        style={{
          backgroundColor: textInputBackgroundColor || "white",
          shadowColor: "#d4d4d4",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <View className="justify-center items-center w-6 h-6 ml-3">
          <Image
            source={icon ? icon : icons.search}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </View>
        
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: '600',
            paddingVertical: 12,
            paddingHorizontal: 12,
            backgroundColor: textInputBackgroundColor || "white",
            borderRadius: 12,
          }}
          placeholder={initialLocation ?? "Where do you want to go?"}
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            fetchSuggestions(text);
          }}
          onFocus={() => setIsFocused(true)}
        />
      </View>

      {isFocused && suggestions.length > 0 && (
        <View 
          style={{
            backgroundColor: textInputBackgroundColor || "white",
            borderRadius: 10,
            marginTop: 8,
            maxHeight: 300,
            shadowColor: "#d4d4d4",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <ScrollView
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={item.properties.place_id || `suggestion-${index}`}
                style={{
                  padding: 12,
                  borderBottomWidth: index < suggestions.length - 1 ? 1 : 0,
                  borderBottomColor: '#f0f0f0',
                }}
                onPress={() => handleSelectSuggestion(item)}
              >
                <View>
                  <Text style={{ fontSize: 14, color: '#333', fontWeight: '500' }}>
                    {item.properties.formatted}
                  </Text>
                  {item.properties.distance && (
                    <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      📍 {formatDistance(item.properties.distance)}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {isFocused && isLoading && (
        <View 
          style={{
            backgroundColor: textInputBackgroundColor || "white",
            borderRadius: 10,
            marginTop: 8,
            padding: 16,
            shadowColor: "#d4d4d4",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
            Searching nearby...
          </Text>
        </View>
      )}
    </View>
  );
};

export default GoogleTextInput;