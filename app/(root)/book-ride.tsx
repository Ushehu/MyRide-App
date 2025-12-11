import React, { useState } from "react";
import { View, Text, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { useUser } from "@clerk/clerk-expo";

import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { useDriverStore, useLocationStore } from "@/store";
import CustomButton from "@/components/CustomButton";
import { fetchAPI } from "@/lib/fetch";

const BookRideContent = () => {
  const { user } = useUser();
  const { userAddress, destinationAddress, userLatitude, userLongitude, destinationLatitude, destinationLongitude } = useLocationStore();
  const { drivers, selectedDriver } = useDriverStore();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  // Get selected driver details
  const driverDetails = drivers?.find(
    (driver) => driver.id === selectedDriver
  );

  // Handle null addresses with fallback
  const pickupAddress = userAddress || "Pickup location not set";
  const dropoffAddress = destinationAddress || "Destination not set";

  // Validate required data
  if (!driverDetails) {
    return (
      <RideLayout title="Book Ride" snapPoints={["55%"]}>
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-lg text-gray-900 text-center">
            No driver selected. Please go back and select a driver.
          </Text>
          <CustomButton
            title="Go Back"
            onPress={() => router.back()}
            className="mt-4"
          />
        </View>
      </RideLayout>
    );
  }

  // Initialize payment sheet with Expo Router API
  const initializePaymentSheet = async () => {
    try {
      const amount = driverDetails.price?.toString() || "0";
      const driverName = user?.fullName || user?.emailAddresses[0]?.emailAddress?.split("@")[0] || "Guest";
      const driverEmail = user?.emailAddresses[0]?.emailAddress || "";

      // Create payment intent using your existing API route
      const { paymentIntent, ephemeralKey, customer } = await fetchAPI(
        "/(api)/(stripe)/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: driverName,
            email: driverEmail,
            amount: amount,
          }),
        },
      );

      if (!paymentIntent) {
        throw new Error("Failed to create payment intent");
      }

      const { error } = await initPaymentSheet({
        merchantDisplayName: "MyRide",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey.secret,
        paymentIntentClientSecret: paymentIntent.client_secret,
        defaultBillingDetails: {
          name: user?.fullName || undefined,
          email: user?.emailAddresses[0]?.emailAddress || undefined,
        },
        returnURL: "myapp://book-ride",
      });

      if (error) {
        console.error("Error initializing payment sheet:", error);
        Alert.alert("Error", error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in initializePaymentSheet:", error);
      Alert.alert("Error", "Failed to initialize payment. Please try again.");
      return false;
    }
  };

  // Handle payment
  const handlePayment = async () => {
    setLoading(true);

    try {
      const initialized = await initializePaymentSheet();

      if (!initialized) {
        setLoading(false);
        return;
      }

      const { error } = await presentPaymentSheet();

      if (error) {
        if (error.code === "Canceled") {
          Alert.alert("Payment Cancelled", "You cancelled the payment.");
        } else {
          Alert.alert("Payment Failed", error.message);
        }
        setLoading(false);
        return;
      }

      // Payment successful - create ride in database
      try {
        const farePrice = driverDetails.price ? parseInt(driverDetails.price.toString()) * 100 : 0;
        const rideTime = driverDetails.time || 0;
        
        await fetchAPI("/(api)/ride/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            origin_address: userAddress || "Unknown",
            destination_address: destinationAddress || "Unknown",
            origin_latitude: userLatitude || 0,
            origin_longitude: userLongitude || 0,
            destination_latitude: destinationLatitude || 0,
            destination_longitude: destinationLongitude || 0,
            ride_time: rideTime.toString(),
            fare_price: farePrice,
            payment_status: "paid",
            driver_id: driverDetails.id,
            user_id: user?.id || "",
          }),
        });

        Alert.alert(
          "🎉 Ride Booked!",
          "Your payment was successful and your ride has been confirmed.",
          [
            {
              text: "View Ride",
              onPress: () => router.push("/(root)/(tabs)/home"),
            },
          ]
        );
      } catch (rideError) {
        console.error("Error creating ride:", rideError);
        Alert.alert(
          "Warning",
          "Payment was successful but there was an issue saving your ride. Please contact support."
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RideLayout title="Book Ride" snapPoints={["55%", "80%", "95%"]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Driver Profile */}
        <View className="items-center py-4 mb-4">
          <View
            className="mb-2"
            style={{
              borderWidth: 3,
              borderColor: '#3B82F6',
              borderRadius: 40,
              padding: 2,
            }}
          >
            <Image
              source={{ uri: driverDetails.profile_image_url }}
              className="w-16 h-16 rounded-full"
            />
          </View>

          <Text className="text-lg font-bold text-gray-900 mb-1">
            {driverDetails.title}
          </Text>

          <View className="flex-row items-center bg-yellow-50 px-3 py-1 rounded-full">
            <Image source={icons.star} className="w-3.5 h-3.5" resizeMode="contain" />
            <Text className="text-xs font-bold text-yellow-600 ml-1">
              {driverDetails.rating}
            </Text>
          </View>
        </View>

        {/* Payment Summary */}
        <View
          className="bg-gray-50 rounded-2xl p-4 mb-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold text-gray-900">
              Payment Summary
            </Text>
            <View className="bg-green-100 px-2.5 py-1 rounded-full">
              <Text className="text-xs font-semibold text-green-700">SECURE</Text>
            </View>
          </View>

          {/* Fare Details */}
          <View className="bg-white rounded-xl p-3 mb-3">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600">Base Fare</Text>
              <Text className="text-sm text-gray-900">${driverDetails.price}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600">Service Fee</Text>
              <Text className="text-sm text-gray-900">$0.00</Text>
            </View>
            <View className="h-px bg-gray-200 my-2" />
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-bold text-gray-900">Total</Text>
              <Text className="text-xl font-bold text-green-600">
                ${driverDetails.price}
              </Text>
            </View>
          </View>

          {/* Trip Info */}
          <View className="flex-row items-center justify-between py-2.5 border-t border-gray-200">
            <Text className="text-sm text-gray-600">Pickup Time</Text>
            <Text className="text-sm font-semibold text-gray-900">
              {formatTime(driverDetails.time || 0)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between py-2.5 border-t border-gray-200">
            <Text className="text-sm text-gray-600">Seats Available</Text>
            <Text className="text-sm font-semibold text-gray-900">
              {driverDetails.car_seats}
            </Text>
          </View>
        </View>

        {/* Route Summary */}
        <View
          className="bg-gray-50 rounded-2xl p-4 mb-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text className="text-base font-bold text-gray-900 mb-3">Route</Text>

          {/* Pickup */}
          <View className="flex-row mb-3">
            <View className="items-center mr-3 mt-1">
              <View className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
              <View className="w-0.5 h-full bg-gray-300 my-1" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-medium text-gray-500 uppercase mb-0.5">
                Pickup
              </Text>
              <Text className="text-sm text-gray-900 leading-4">
                {pickupAddress}
              </Text>
            </View>
          </View>

          {/* Destination */}
          <View className="flex-row">
            <View className="items-center mr-3 mt-1">
              <View className="w-2.5 h-2.5 bg-green-500 rounded-full" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-medium text-gray-500 uppercase mb-0.5">
                Destination
              </Text>
              <Text className="text-sm text-gray-900 leading-4">
                {dropoffAddress}
              </Text>
            </View>
          </View>
        </View>

        {/* Security Info */}
        <View className="bg-blue-50 rounded-xl p-3 flex-row items-center">
          <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-2.5">
            <Text className="text-base">🔒</Text>
          </View>
          <View className="flex-1">
            <Text className="text-xs font-semibold text-blue-900 mb-0.5">
              Secure Payment
            </Text>
            <Text className="text-xs text-blue-700 leading-3">
              Your payment info is encrypted
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
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
          title={loading ? "Processing..." : `Pay $${driverDetails.price}`}
          onPress={handlePayment}
          disabled={loading}
          className={loading ? "bg-gray-400" : "bg-blue-600"}
        />

        {loading && (
          <View className="flex-row items-center justify-center mt-2">
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text className="text-xs text-gray-600 ml-2">
              Initializing secure payment...
            </Text>
          </View>
        )}

        <Text className="text-xs text-gray-500 text-center mt-2">
          By continuing, you agree to our Terms & Conditions
        </Text>
      </View>
    </RideLayout>
  );
};

const BookRide = () => {
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier="merchant.com.myride"
      urlScheme="myapp"
    >
      <BookRideContent />
    </StripeProvider>
  );
};

export default BookRide;