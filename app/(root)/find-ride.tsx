import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { icons } from "@/constants";
import { useDriverStore } from "@/store";
import CustomButton from "@/components/CustomButton";

interface Driver {
  id: number;
  title: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
  price: string;
  time: number;
}

const FindRide = () => {
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();
  const [loading, setLoading] = useState(false);

  // Ensure drivers is typed correctly
  const driverList: Driver[] = (drivers as Driver[]) || [];

  // Handle driver selection
  const handleSelectDriver = (id: number) => {
    setSelectedDriver(id);
  };

  // Handle confirm ride navigation
  const handleConfirmRide = () => {
    if (!selectedDriver) return;
    router.push("/(root)/confirm-ride");
  };

  // Render individual driver card
  const renderDriverCard = ({ item }: { item: Driver }) => {
    const isSelected = selectedDriver === item.id;

    return (
      <TouchableOpacity
        onPress={() => handleSelectDriver(item.id)}
        activeOpacity={0.7}
        className={`mb-4 rounded-2xl overflow-hidden ${
          isSelected
            ? "bg-blue-50 border-2 border-blue-500"
            : "bg-white border border-gray-200"
        }`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Driver Card Content */}
        <View className="p-4">
          {/* Driver Header - Profile & Rating */}
          <View className="flex-row items-center mb-4">
            {/* Profile Image */}
            <Image
              source={{ uri: item.profile_image_url }}
              className="w-16 h-16 rounded-full"
              style={{
                borderWidth: 2,
                borderColor: isSelected ? "#3B82F6" : "#E5E7EB",
              }}
            />

            {/* Driver Info */}
            <View className="flex-1 ml-3">
              <Text className="text-lg font-bold text-gray-900">
                {item.title}
              </Text>
              
              {/* Rating */}
              <View className="flex-row items-center mt-1">
                <Image
                  source={icons.star}
                  className="w-4 h-4"
                  resizeMode="contain"
                />
                <Text className="text-sm font-semibold text-yellow-500 ml-1">
                  {item.rating}
                </Text>
                <Text className="text-xs text-gray-500 ml-1">
                  ({item.car_seats} seats)
                </Text>
              </View>
            </View>

            {/* Price */}
            <View className="items-end">
              <Text className="text-2xl font-bold text-green-600">
                ${item.price}
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5">per ride</Text>
            </View>
          </View>

          {/* Car Image */}
          <View className="bg-gray-50 rounded-xl p-3 mb-3">
            <Image
              source={{ uri: item.car_image_url }}
              className="w-full h-24"
              resizeMode="contain"
            />
          </View>

          {/* Time Estimate */}
          <View className="flex-row items-center justify-center bg-gray-100 rounded-lg py-2.5">
            <Image
              source={icons.to}
              className="w-4 h-4 mr-2"
              tintColor="#6B7280"
            />
            <Text className="text-sm font-medium text-gray-700">
              Arrives in ~{Math.round(item.time / 60)} min
            </Text>
          </View>

          {/* Selection Indicator */}
          {isSelected && (
            <View className="absolute top-4 right-4 bg-blue-500 rounded-full p-1.5">
              <Image
                source={icons.checkmark}
                className="w-4 h-4"
                tintColor="#FFFFFF"
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "bottom"]}>
      {/* Header Section */}
      <View className="bg-white px-5 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Available Drivers
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Select a driver for your ride
        </Text>
      </View>

      {/* Drivers List */}
      <FlatList
        data={driverList}
        renderItem={renderDriverCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 100, // Extra space for button
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-500 text-base">
              No drivers available
            </Text>
          </View>
        }
      />

      {/* Bottom Fixed Button Container */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white px-5 py-4 border-t border-gray-200"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <CustomButton
          title={
            selectedDriver
              ? "Continue to Confirm"
              : "Select a Driver"
          }
          onPress={handleConfirmRide}
          disabled={!selectedDriver || loading}
          className={`${
            !selectedDriver || loading
              ? "bg-gray-300"
              : "bg-blue-600"
          }`}
        />
      </View>
    </SafeAreaView>
  );
};

export default FindRide;