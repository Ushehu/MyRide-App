# 🚗 MyRide - Ride Booking App

A modern, full-stack ride-booking mobile application built with React Native and Expo. Book rides, choose your driver, and pay securely with real-time pricing based on route distance and traffic conditions.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🗺️ **Real-Time Location** - Live GPS tracking with automatic location updates
- 🚕 **Smart Driver Matching** - AI-powered driver selection based on proximity and ratings
- 💳 **Secure Payments** - Stripe integration with real-time payment processing
- 📍 **Route Optimization** - Dynamic pricing based on distance and traffic using Geoapify API
- 🔐 **Authentication** - Secure user authentication with Clerk
- 📊 **Ride History** - Track all your past rides with detailed information
- 🌍 **Interactive Maps** - Real-time route visualization with traffic data
- ⚡ **Instant Booking** - Book rides in under 30 seconds
- 🎨 **Modern UI** - Beautiful, responsive interface with smooth animations
- 🔄 **Auto-Refresh** - Real-time updates without manual refresh

## 📱 Screenshots

<div align="center">

### Authentication & Onboarding
<img src="./screenshots/1-welcome.jpg" width="250" alt="Welcome"> <img src="./screenshots/2-signin.jpg" width="250" alt="Sign In"> <img src="./screenshots/3-signup.jpg" width="250" alt="Sign Up">

### Core Features
<img src="./screenshots/4-home.jpg" width="250" alt="Home Screen"> <img src="./screenshots/5-find-drivers.jpg" width="250" alt="Find Drivers"> <img src="./screenshots/6-book-ride.jpg" width="250" alt="Book Ride">

### Payment & Confirmation
<img src="./screenshots/7-payment.jpg" width="250" alt="Payment"> <img src="./screenshots/8-success.jpg" width="250" alt="Success">

</div>

## 🏗️ Tech Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Development and build tooling
- **TypeScript** - Type-safe code
- **NativeWind (Tailwind CSS)** - Utility-first styling
- **Expo Router** - File-based navigation with deep linking
- **Zustand** - Lightweight state management

### Backend & APIs
- **Neon Database (PostgreSQL)** - Serverless database
- **Clerk Authentication** - User authentication & management
- **Stripe** - Payment processing
- **Geoapify API** - Maps, routing, and geocoding
- **Google Maps** - Location services

### Key Libraries
- **@stripe/stripe-react-native** - Payment integration
- **react-native-maps** - Interactive maps
- **expo-location** - GPS and location services
- **react-native-modal** - Beautiful modals
- **@gorhom/bottom-sheet** - Smooth bottom sheets

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio (for emulator)
- Stripe account ([Sign up](https://stripe.com))
- Clerk account ([Sign up](https://clerk.com))
- Geoapify API key ([Get one here](https://www.geoapify.com/))
- Neon Database ([Sign up](https://neon.tech))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/myride.git
cd myride
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**

Create a `.env` file in the root directory:

```env
# Clerk Authentication
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Database
DATABASE_URL=postgresql://user:password@host.neon.tech/neondb?sslmode=require

# Stripe
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Maps & Routing
EXPO_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_key
EXPO_PUBLIC_GOOGLE_API_KEY=your_google_key
EXPO_PUBLIC_PLACES_API_KEY=your_places_key
```

4. **Set up the database**

Run the SQL schema in your Neon Database console:

```sql
-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_image_url TEXT,
    car_image_url TEXT,
    car_seats INTEGER DEFAULT 4,
    rating DECIMAL(3, 2) DEFAULT 4.50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rides table
CREATE TABLE IF NOT EXISTS rides (
    id SERIAL PRIMARY KEY,
    origin_address VARCHAR(255) NOT NULL,
    destination_address VARCHAR(255) NOT NULL,
    origin_latitude DECIMAL(10, 8) NOT NULL,
    origin_longitude DECIMAL(11, 8) NOT NULL,
    destination_latitude DECIMAL(10, 8) NOT NULL,
    destination_longitude DECIMAL(11, 8) NOT NULL,
    ride_time INTEGER NOT NULL,
    fare_price INTEGER NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    driver_id INTEGER REFERENCES drivers(id),
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample drivers
INSERT INTO drivers (first_name, last_name, profile_image_url, car_image_url, car_seats, rating) VALUES
('James', 'Wilson', 'https://randomuser.me/api/portraits/men/1.jpg', 'https://cdn.imagin.studio/getImage?customer=hrjavascript-mastery&make=tesla&modelFamily=model-3&angle=01&width=500', 4, 4.80),
('David', 'Brown', 'https://randomuser.me/api/portraits/men/2.jpg', 'https://cdn.imagin.studio/getImage?customer=hrjavascript-mastery&make=bmw&modelFamily=3-series&angle=01&width=500', 4, 4.60),
('Sarah', 'Miller', 'https://randomuser.me/api/portraits/women/1.jpg', 'https://cdn.imagin.studio/getImage?customer=hrjavascript-mastery&make=audi&modelFamily=a4&angle=01&width=500', 3, 4.90);
```

5. **Start the development server**
```bash
npx expo start --clear
```

6. **Run on device/emulator**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## 📁 Project Structure

```
myride/
├── app/                        # App screens (Expo Router)
│   ├── (api)/                 # API routes
│   │   ├── (stripe)/          # Stripe payment endpoints
│   │   │   ├── create+api.ts  # Create payment intent
│   │   │   └── pay+api.ts     # Confirm payment
│   │   └── ride/              # Ride endpoints
│   │       ├── create+api.ts  # Create new ride
│   │       └── [id]+api.ts    # Fetch user rides
│   ├── (auth)/                # Authentication screens
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── welcome.tsx
│   ├── (root)/                # Main app
│   │   ├── (tabs)/           # Bottom tab navigation
│   │   │   └── home.tsx      # Home screen
│   │   ├── find-ride.tsx     # Driver selection
│   │   └── book-ride.tsx     # Booking & payment
│   └── _layout.tsx            # Root layout
├── components/                # Reusable components
│   ├── CustomButton.tsx       # Button component
│   ├── GoogleTextInput.tsx    # Location search
│   ├── Map.tsx                # Interactive map
│   ├── RideCard.tsx           # Ride history card
│   └── RideLayout.tsx         # Bottom sheet layout
├── store/                     # State management
│   └── index.ts               # Zustand stores
├── lib/                       # Utilities
│   ├── fetch.ts               # API client
│   ├── map.ts                 # Map utilities
│   └── utils.ts               # Helper functions
├── types/                     # TypeScript types
│   └── type.d.ts              # Type definitions
├── constants/                 # App constants
│   └── index.ts               # Icons, images
└── assets/                    # Static assets
```

## 🎯 Key Features Explained

### Real-Time Pricing
The app calculates ride prices dynamically using Geoapify's routing API. Pricing factors include:
- Base fare: $2.00
- Per-minute rate: $0.50/min
- Real-time traffic conditions
- Route distance and duration

### Smart Driver Matching
Drivers are automatically positioned near the user's location with:
- Live GPS tracking
- Distance-based sorting
- Rating-based recommendations
- Real-time availability

### Secure Payment Processing
Stripe integration provides:
- PCI-compliant payment handling
- Support for all major credit cards
- Secure 3D authentication
- Instant payment confirmation
- Automated receipt generation

### Location Services
Advanced location features:
- Auto-detection of user location
- Real-time GPS updates
- Intelligent address search
- Route visualization with traffic
- Turn-by-turn navigation support

## 💳 Payment Flow

1. User selects destination → Route calculated
2. Available drivers shown with prices
3. User selects driver → Booking screen opens
4. Stripe payment sheet appears
5. User enters card details
6. Payment processed securely
7. Ride saved to database
8. Success confirmation shown

## 🔧 Configuration

### Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your API keys (Test mode)
3. Add to `.env` file
4. Enable payment methods in Dashboard

### Clerk Authentication

1. Create project at [Clerk Dashboard](https://dashboard.clerk.com/)
2. Enable email/password authentication
3. Copy publishable key to `.env`
4. Configure OAuth providers (optional)

### Geoapify Maps

1. Sign up at [Geoapify](https://www.geoapify.com/)
2. Create an API key
3. Enable these APIs:
   - Routing API
   - Geocoding API
   - Static Maps API
4. Add key to `.env`

## 🚀 Deployment

### Build for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
```

### Submit to App Stores

```bash
# iOS App Store
eas submit --platform ios

# Google Play Store
eas submit --platform android
```

## 🧪 Testing

### Test Payment Flow

Use Stripe test cards:
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 9995
- **3D Secure**: 4000 0027 6000 3184

Expiry: Any future date  
CVC: Any 3 digits  
ZIP: Any 5 digits

### Test Locations

Sample addresses for testing:
- New York: `Times Square, New York, NY`
- London: `Big Ben, London, UK`
- Lagos: `Victoria Island, Lagos, Nigeria`

## 📊 Database Schema

### Rides Table
- `id`: Primary key
- `origin_address`: Pickup location
- `destination_address`: Drop-off location
- `origin_latitude/longitude`: GPS coordinates
- `destination_latitude/longitude`: GPS coordinates
- `ride_time`: Duration in minutes
- `fare_price`: Price in cents
- `payment_status`: paid/pending/failed
- `driver_id`: Foreign key to drivers
- `user_id`: Clerk user ID
- `created_at`: Timestamp

### Drivers Table
- `id`: Primary key
- `first_name/last_name`: Driver name
- `profile_image_url`: Avatar
- `car_image_url`: Car photo
- `car_seats`: Available seats
- `rating`: Driver rating (0-5)
- `created_at`: Timestamp

## 🎨 Customization

### Change Brand Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#0286FF',    // Main brand color
      secondary: '#F59E0B',  // Accent color
    }
  }
}
```

### Modify Pricing Algorithm

Edit `lib/map.ts`:

```typescript
const calculatePrice = (timeInMinutes: number) => {
  const baseRate = 2.0;      // Base fare
  const perMinRate = 0.5;     // Per minute rate
  return (baseRate + (timeInMinutes * perMinRate)).toFixed(2);
};
```

### Add New Payment Methods

Modify Stripe configuration in `book-ride.tsx`:

```typescript
paymentMethodTypes: ['card', 'apple_pay', 'google_pay']
```

## 🐛 Troubleshooting

### Location Not Working
- Check location permissions in device settings
- Ensure GPS is enabled
- Verify API keys in `.env`

### Payment Fails
- Verify Stripe keys are correct
- Check network connection
- Use test card numbers in test mode

### Database Connection Issues
- Confirm DATABASE_URL is correct
- Check Neon database is active
- Verify SSL mode is enabled

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Umar Faruk Shehu**
- GitHub: [@Ushehu](https://github.com/Ushehu)

## 🙏 Acknowledgments

- [Stripe](https://stripe.com/) - Payment processing
- [Clerk](https://clerk.com/) - Authentication
- [Geoapify](https://www.geoapify.com/) - Maps and routing
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Expo](https://expo.dev/) - Development platform
- [React Native](https://reactnative.dev/) - Mobile framework

## 📞 Support

For support:
1. Check [Issues](https://github.com/yourusername/myride/issues)
2. Create new issue with details

## 🗺️ Roadmap

- [x] User authentication
- [x] Real-time location tracking
- [x] Driver selection
- [x] Stripe payment integration
- [x] Ride history
- [x] Route visualization
- [ ] Push notifications
- [ ] In-app chat with driver
- [ ] Ride scheduling
- [ ] Promo codes & discounts
- [ ] Driver ratings & reviews
- [ ] Split payment
- [ ] Ride sharing (carpool)
- [ ] Multi-language support

## 💼 For Recruiters

This project demonstrates:
- **Full-stack development**: Backend APIs + Frontend mobile app
- **Payment integration**: Stripe implementation with security best practices
- **Database design**: PostgreSQL schema with relationships
- **API integration**: Multiple third-party services (Maps, Payments, Auth)
- **State management**: Zustand for global state
- **Real-time features**: Live location tracking and updates
- **TypeScript**: Type-safe code throughout
- **Modern React patterns**: Hooks, context, custom hooks
- **Mobile development**: Cross-platform React Native
- **UI/UX design**: Clean, intuitive user interface

### Technical Highlights
- Implemented custom payment flow with Stripe Elements
- Built real-time pricing algorithm using route calculations
- Integrated multiple map providers for redundancy
- Created secure API routes with Expo Router
- Designed scalable database schema
- Implemented auto-refreshing data with useFocusEffect
- Built reusable component library
- Handled complex location permissions across platforms

## ⭐ Show Your Support

Give a ⭐️ if you find this project interesting!

---

<div align="center">
  <sub>Built with ❤️ using React Native & Expo</sub>
</div>
