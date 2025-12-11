// lib/services/driverService.ts
import { Driver } from '@/store';

const API_URL = process.env.EXPO_PUBLIC_SERVER_URL;

// Fetch nearby drivers
export const fetchNearbyDrivers = async (
  latitude: number,
  longitude: number
): Promise<Driver[]> => {
  try {
    console.log('Fetching drivers for location:', { latitude, longitude });
    
    const response = await fetch(`${API_URL}/api/drivers/nearby`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude,
        longitude,
        radius: 10, // 10 km radius
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch drivers');
    }

    const data = await response.json();
    return data.drivers || [];
  } catch (error) {
    console.error('Error fetching drivers:', error);
    
    // Return mock data if API fails (for development)
    return getMockDrivers();
  }
};

// Mock drivers for development/testing
export const getMockDrivers = (): Driver[] => {
  return [
    {
      id: 1,
      first_name: 'James',
      last_name: 'Wilson',
      profile_image_url: 'https://randomuser.me/api/portraits/men/1.jpg',
      car_image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
      car_seats: 4,
      rating: 4.9,
      price: '25.00',
      time: 300, // seconds
    },
    {
      id: 2,
      first_name: 'Sarah',
      last_name: 'Johnson',
      profile_image_url: 'https://randomuser.me/api/portraits/women/2.jpg',
      car_image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
      car_seats: 4,
      rating: 4.8,
      price: '22.00',
      time: 420,
    },
    {
      id: 3,
      first_name: 'Michael',
      last_name: 'Brown',
      profile_image_url: 'https://randomuser.me/api/portraits/men/3.jpg',
      car_image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400',
      car_seats: 5,
      rating: 4.7,
      price: '30.00',
      time: 240,
    },
    {
      id: 4,
      first_name: 'Emily',
      last_name: 'Davis',
      profile_image_url: 'https://randomuser.me/api/portraits/women/4.jpg',
      car_image_url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400',
      car_seats: 4,
      rating: 4.9,
      price: '28.00',
      time: 360,
    },
    {
      id: 5,
      first_name: 'David',
      last_name: 'Martinez',
      profile_image_url: 'https://randomuser.me/api/portraits/men/5.jpg',
      car_image_url: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400',
      car_seats: 4,
      rating: 4.6,
      price: '24.00',
      time: 480,
    },
  ];
};