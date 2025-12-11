import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Ionicons } from '@expo/vector-icons';

import Map from "@/components/Map";

interface RideLayoutProps {
  title: string;
  snapPoints?: string[];
  children: React.ReactNode;
}

const RideLayout = ({ title, snapPoints, children }: RideLayoutProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <GestureHandlerRootView className="flex-1">
      {/* Status Bar Configuration */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          {/* Header */}
          <View className="bg-white border-b border-gray-200 px-5 py-4 flex-row items-center justify-between z-10">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-11 h-11 rounded-full bg-gray-100 items-center justify-center"
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            
            <Text className="text-xl font-bold text-gray-900 flex-1 text-center mx-4">
              {title}
            </Text>
            
            {/* Spacer for centering */}
            <View className="w-11" />
          </View>

          {/* Map Container */}
          <View className="flex-1">
            <Map />
          </View>

          {/* Bottom Sheet */}
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints || ["40%", "65%", "85%"]}
            index={1}
            handleIndicatorStyle={{
              backgroundColor: '#D1D5DB',
              width: 50,
              height: 5,
              borderRadius: 3,
            }}
            handleStyle={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 12,
              paddingBottom: 8,
            }}
            backgroundStyle={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 10,
            }}
            enablePanDownToClose={false}
          >
            <BottomSheetView className="flex-1">
              {children}
            </BottomSheetView>
          </BottomSheet>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default RideLayout;