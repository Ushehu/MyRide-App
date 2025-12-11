// store/index.ts
import { create } from 'zustand';

// Driver Interface
export interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
  price: string;
  time: number;
}

// Computed property for full name
export interface DriverWithTitle extends Driver {
  title: string;
}

// Driver Store Interface
interface DriverStore {
  drivers: DriverWithTitle[];
  selectedDriver: number | null;
  setDrivers: (drivers: Driver[]) => void;
  setSelectedDriver: (driverId: number) => void;
  clearSelectedDriver: () => void;
}

// Location Store Interface
interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  setUserLocation: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setDestinationLocation: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  clearLocations: () => void;
}

// Driver Store
export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [],
  selectedDriver: null,
  
  setDrivers: (drivers: Driver[]) => {
    // Add computed 'title' property to each driver
    const driversWithTitle: DriverWithTitle[] = drivers.map(driver => ({
      ...driver,
      title: `${driver.first_name} ${driver.last_name}`,
    }));
    
    set({ drivers: driversWithTitle });
  },
  
  setSelectedDriver: (driverId: number) => {
    set({ selectedDriver: driverId });
  },
  
  clearSelectedDriver: () => {
    set({ selectedDriver: null });
  },
}));

// Location Store
export const useLocationStore = create<LocationStore>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,
  
  setUserLocation: ({ latitude, longitude, address }) => {
    set({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    });
  },
  
  setDestinationLocation: ({ latitude, longitude, address }) => {
    set({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    });
  },
  
  clearLocations: () => {
    set({
      userLatitude: null,
      userLongitude: null,
      userAddress: null,
      destinationLatitude: null,
      destinationLongitude: null,
      destinationAddress: null,
    });
  },
}));