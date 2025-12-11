import { View,
   Text ,
   TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  } from 'react-native';
import { useUser, useAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

import RideCard from '@/components/RideCard';
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import { icons, images } from "@/constants";
import { useLocationStore } from "@/store";
  
const recentRides = [
  {
    ride_id: 1,
    origin_address: "Abuja, Nigeria",
    destination_address: "Kaduna, Nigeria",
    origin_latitude: 9.0574,
    origin_longitude: 7.4898,
    destination_latitude: 10.5105,
    destination_longitude: 7.4165,
    ride_time: 142,
    fare_price: 5200.0,
    payment_status: "paid",
    driver_id: 1,
    user_id: "1",
    created_at: "2024-08-12 08:49:01.809053",
    driver: {
      driver_id: 1,
      first_name: "James",
      last_name: "Wilson",
      profile_image_url: "https://ucarecdn.com/dae59769-2c1f-48c7-driver1.jpg",
      car_image_url: "https://ucarecdn.com/a2dc52b2-8bf7-4e49-car1.jpg",
      car_seats: 4,
      rating: "4.80"
    }
  },
  {
    ride_id: 2,
    origin_address: "Lagos, Nigeria",
    destination_address: "Ibadan, Nigeria",
    origin_latitude: 6.5244,
    origin_longitude: 3.3792,
    destination_latitude: 7.3775,
    destination_longitude: 3.947,
    ride_time: 176,
    fare_price: 10500.0,
    payment_status: "pending",
    driver_id: 2,
    user_id: "1",
    created_at: "2024-08-14 11:20:45.002121",
    driver: {
      driver_id: 2,
      first_name: "Maria",
      last_name: "Lopez",
      profile_image_url: "https://ucarecdn.com/1b84ac7e-driver2.jpg",
      car_image_url: "https://ucarecdn.com/8cf42a3e-car2.jpg",
      car_seats: 4,
      rating: "4.92"
    }
  },
  {
    ride_id: 3,
    origin_address: "Zagreb, Croatia",
    destination_address: "Rijeka, Croatia",
    origin_latitude: 45.815011,
    origin_longitude: 15.981919,
    destination_latitude: 45.327063,
    destination_longitude: 14.442176,
    ride_time: 124,
    fare_price: 6200.0,
    payment_status: "paid",
    driver_id: 1,
    user_id: "1",
    created_at: "2024-08-12 08:49:01.809053",
    driver: {
      driver_id: 1,
      first_name: "James",
      last_name: "Wilson",
      profile_image_url: "https://ucarecdn.com/dae59769-driver1.jpg",
      car_image_url: "https://ucarecdn.com/a2dc52b2-car1.jpg",
      car_seats: 4,
      rating: "4.80"
    }
  },
  {
    ride_id: 4,
    origin_address: "Nairobi, Kenya",
    destination_address: "Thika, Kenya",
    origin_latitude: -1.286389,
    origin_longitude: 36.817223,
    destination_latitude: -1.0334,
    destination_longitude: 37.074,
    ride_time: 52,
    fare_price: 2500.0,
    payment_status: "paid",
    driver_id: 3,
    user_id: "1",
    created_at: "2024-08-20 14:10:11.102991",
    driver: {
      driver_id: 3,
      first_name: "Ahmed",
      last_name: "Khan",
      profile_image_url: "https://ucarecdn.com/4c8d0201-driver3.jpg",
      car_image_url: "https://ucarecdn.com/d6a72d30-car3.jpg",
      car_seats: 3,
      rating: "4.64"
    }
  }
];

export default function Page(){
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [locationLoading, setLocationLoading] = useState(true);
  
  const loading = false; // Change this from true to false
    
  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };

useEffect(() => {
  const requestLocation = async() => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        setHasPermission(false);
        setLocationLoading(false);
        return;
      }

      setHasPermission(true);
      
      let location = await Location.getCurrentPositionAsync({});

      // Just use coordinates as the address
      setUserLocation({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
        address: "Current Location",
      });

      setLocationLoading(false);
      
    } catch (error) {
      console.error("Error getting location:", error);
      setLocationLoading(false);
      setHasPermission(false);
    }
  };
  
  requestLocation();
}, []);
  return (
    <SafeAreaView className="bg-general-500">
      <FlatList 
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item, index) => index.toString()}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent rides found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl font-JakartaExtraBold">
                Welcome {user?.firstName}👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10 rounded-full bg-white"
              >
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>

            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
            />

            <>
              <Text className="text-xl font-JakartaBold mt-5 mb-3">
                Your Current Location
              </Text>
              <View className="flex flex-row items-center bg-transparent h-[300px]">
                {locationLoading ? (
                  <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#000" />
                    <Text className="mt-2 text-sm text-gray-500">Loading location...</Text>
                  </View>
                ) : !hasPermission ? (
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-sm text-gray-500">Location permission denied</Text>
                  </View>
                ) : (
                  <Map />
                )}
              </View>
            </>

            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Recent Rides
            </Text>
          </>
        }
      />
    </SafeAreaView>
  );
}