# 🗺️ Nearby Essentials Finder

> **Discover essential services near you with real-time location data**

A modern, responsive web application that helps users find nearby essential services like hospitals, ATMs, grocery stores, pharmacies, and gas stations using their current location. Built with React, Vite, and integrated with OpenStreetMap and Google Places APIs.

![Nearby Essentials Finder](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.3.1-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

### 🎯 Core Functionality
- **📍 Real-time Location Detection** - Automatically detects user's current location with high accuracy
- **🗺️ Interactive Map View** - Custom canvas-based map visualization with service markers
- **📋 Comprehensive Service List** - Detailed list view with distance, ratings, and contact information
- **🔍 Smart Search** - Finds hospitals, ATMs, grocery stores, pharmacies, and gas stations
- **📱 Fully Responsive** - Optimized for mobile, tablet, and desktop devices

### 🚀 Advanced Features
- **🌐 Dual API Integration** - OpenStreetMap (free) with Google Places API fallback
- **🎨 Modern UI/UX** - Beautiful gradient designs with glassmorphism effects
- **⚡ Performance Optimized** - Lazy loading, intersection observers, and efficient rendering
- **🔄 Real-time Updates** - Live location refresh and dynamic content loading
- **🛠️ Debug Panel** - Development tools for testing and debugging
- **📍 Reverse Geocoding** - Converts coordinates to human-readable addresses

## 🛠️ Technology Stack

### Frontend Framework
- **React 18.2.0** - Modern React with hooks and functional components
- **Vite 5.3.1** - Lightning-fast build tool and development server
- **JavaScript (ES6+)** - Modern JavaScript features and syntax

### Styling & UI
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Lucide React** - Beautiful, customizable icons
- **Custom Canvas** - Hand-drawn map visualization

### APIs & Services
- **OpenStreetMap Nominatim** - Free geocoding and place search
- **Google Places API** - Enhanced place data and search (optional)
- **Browser Geolocation API** - Native location services

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic vendor prefixing

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 16.0 or higher)
- **npm** or **yarn** package manager
- Modern web browser with geolocation support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abhinavhaz/Tap-FindNearBY.git
   cd Tap-FindNearBY
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup (Optional)**
   Create a `.env` file in the root directory for enhanced features:
   ```env
   VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
   VITE_GOOGLE_GEOCODING_API_KEY=your_google_geocoding_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` and allow location access when prompted.

## 📖 Usage Guide

### Getting Started
1. **Allow Location Access** - Click "Get My Location" and grant permission when prompted
2. **View Results** - Browse nearby essentials in both map and list views
3. **Explore Details** - Click on any service to see contact information and directions
4. **Refresh Location** - Use the refresh button to update your current location

### Service Categories
- 🏥 **Hospitals** - Emergency and healthcare facilities
- 🏧 **ATMs** - Banking and cash withdrawal points
- 🛒 **Grocery Stores** - Supermarkets and food retailers
- 💊 **Pharmacies** - Medical and pharmaceutical services
- ⛽ **Gas Stations** - Fuel and automotive services

### Map Features
- **Interactive Canvas** - Custom-drawn map with color-coded markers
- **Service Markers** - Different colors for each service type
- **User Location** - Blue marker showing your current position
- **Responsive Design** - Adapts to different screen sizes

## 🔧 Configuration

### API Keys (Optional)
While the app works with free OpenStreetMap data, you can enhance functionality with Google APIs:

1. **Google Places API** - For richer place data and better search results
2. **Google Geocoding API** - For more accurate address resolution

### Environment Variables
```env
# Google Places API (optional - enhances search results)
VITE_GOOGLE_PLACES_API_KEY=your_api_key

# Google Geocoding API (optional - improves address accuracy)
VITE_GOOGLE_GEOCODING_API_KEY=your_api_key
```

## 📁 Project Structure

```
nearby-essentials-finder/
├── public/                 # Static assets
│   ├── placeholder-*.png   # Image placeholders
│   └── *.svg              # Icon files
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── MapCanvas.jsx # Interactive map component
│   │   ├── EssentialsList.jsx # Service list component
│   │   └── DebugPanel.jsx # Development debug tools
│   ├── data/             # Data fetching and APIs
│   │   └── mockData.js   # API integration and fallback data
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   │   └── geocoding.js  # Location and address utilities
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles and Tailwind imports
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md            # Project documentation
```

## 🎨 Key Components

### MapCanvas Component
- **Custom Canvas Rendering** - Hand-drawn map visualization
- **Service Markers** - Color-coded markers for different service types
- **Responsive Design** - Adapts to different screen sizes
- **Performance Optimized** - Efficient rendering for smooth interactions

### EssentialsList Component
- **Lazy Loading** - Intersection Observer for performance
- **Rich Information** - Distance, ratings, contact details
- **Interactive Elements** - Click-to-call and directions
- **Accessibility** - Screen reader friendly

### Location Services
- **High Accuracy GPS** - Precise location detection
- **Fallback Strategies** - Multiple geocoding providers
- **Error Handling** - Graceful degradation for location issues
- **Privacy Focused** - Location data stays on device

## 🔄 API Integration

### OpenStreetMap (Primary)
- **Free to Use** - No API key required
- **Global Coverage** - Worldwide place data
- **Community Driven** - Open-source mapping data
- **Rate Limited** - Respectful usage patterns

### Google Places API (Fallback)
- **Enhanced Data** - Richer place information
- **Better Accuracy** - More precise location data
- **Real-time Info** - Business hours, ratings, reviews
- **Requires API Key** - Paid service with free tier

## 📱 Browser Compatibility

### Supported Browsers
- ✅ **Chrome** 60+ (Recommended)
- ✅ **Firefox** 55+
- ✅ **Safari** 12+
- ✅ **Edge** 79+
- ✅ **Mobile Browsers** (iOS Safari, Chrome Mobile)

### Required Features
- **Geolocation API** - For location detection
- **Canvas API** - For map rendering
- **Fetch API** - For API requests
- **ES6+ Support** - Modern JavaScript features

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or
yarn build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

### Deployment Platforms
- **Vercel** - Recommended for React apps
- **Netlify** - Easy static site deployment
- **GitHub Pages** - Free hosting for public repos
- **Firebase Hosting** - Google's hosting platform

### Environment Variables for Production
```env
VITE_GOOGLE_PLACES_API_KEY=your_production_api_key
VITE_GOOGLE_GEOCODING_API_KEY=your_production_geocoding_key
```

## 🧪 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Development Features
- **Hot Module Replacement** - Instant updates during development
- **Debug Panel** - Development tools and data inspection
- **Console Logging** - Detailed API and location logs
- **Error Boundaries** - Graceful error handling

### Code Quality
- **ESLint Configuration** - Consistent code style
- **React Best Practices** - Modern React patterns
- **Performance Monitoring** - Optimized rendering
- **Accessibility Standards** - WCAG compliance

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started
1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** with proper testing
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style and conventions
- Add tests for new features when applicable
- Update documentation for significant changes
- Ensure responsive design for UI changes
- Test across different browsers and devices

### Areas for Contribution
- 🌐 **Internationalization** - Multi-language support
- 🎨 **UI/UX Improvements** - Enhanced user experience
- 🔧 **Performance Optimization** - Speed and efficiency improvements
- 📱 **Mobile Features** - Native app capabilities
- 🗺️ **Map Enhancements** - Advanced mapping features

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenStreetMap** - Free, open-source mapping data
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Beautiful icon library
- **React Community** - Amazing ecosystem and support

## 📞 Support & Contact

- **GitHub Issues** - [Report bugs or request features](https://github.com/Abhinavhaz/Tap-FindNearBY/issues)
- **Discussions** - [Community discussions and Q&A](https://github.com/Abhinavhaz/Tap-FindNearBY/discussions)
- **Email** - abhinavhazarika27@gmail.com

## 🔮 Roadmap

### Upcoming Features
- 🌙 **Dark Mode** - Theme switching capability
- 🔍 **Advanced Filters** - Filter by ratings, distance, hours
- 📱 **PWA Support** - Progressive Web App features
- 🗺️ **Route Planning** - Directions and navigation
- ⭐ **Favorites** - Save frequently visited places
- 📊 **Analytics** - Usage insights and statistics

### Long-term Goals
- 🌍 **Offline Support** - Work without internet connection
- 🤖 **AI Recommendations** - Smart place suggestions
- 🔔 **Push Notifications** - Location-based alerts
- 🎯 **Geofencing** - Location-based triggers
- 📈 **Business Dashboard** - Analytics for business owners

---

<div align="center">

**Built with ❤️ using React, Vite, and OpenStreetMap**

[⭐ Star this repo](https://github.com/Abhinavhaz/Tap-FindNearBY) • [🐛 Report Bug](https://github.com/Abhinavhaz/Tap-FindNearBY/issues) • [💡 Request Feature](https://github.com/Abhinavhaz/Tap-FindNearBY/issues)

</div>
