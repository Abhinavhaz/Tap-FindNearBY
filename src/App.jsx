import { useState, useEffect } from "react"
import { MapPin, Navigation, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MapCanvas from "./components/MapCanvas"
import EssentialsList from "./components/EssentialsList"
import { fetchNearbyPlacesOSM, fetchNearbyPlaces } from "./data/mockData"
import DebugPanel from "./components/DebugPanel"
import { getAddressFromCoordinates, formatCoordinates } from "./lib/geocoding"

export default function App() {
  const [userLocation, setUserLocation] = useState(null)
  const [userAddress, setUserAddress] = useState(null)
  const [addressLoading, setAddressLoading] = useState(false)
  const [essentials, setEssentials] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getUserLocation = async () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }
        setUserLocation(location)

        // Get address from coordinates
        setAddressLoading(true)
        try {
          const address = await getAddressFromCoordinates(location.latitude, location.longitude)
          setUserAddress(address)
        } catch (error) {
          console.error("Error getting address:", error)
          setUserAddress(formatCoordinates(location.latitude, location.longitude, location.accuracy))
        }
        setAddressLoading(false)

        try {
          // Try OpenStreetMap first (free), fallback to Google Places if needed
          let nearbyEssentials = await fetchNearbyPlacesOSM(location.latitude, location.longitude, 5000)

          // If OSM doesn't return enough results, try Google Places
          if (nearbyEssentials.length < 10) {
            console.log("Trying Google Places API as fallback...")
            const googlePlaces = await fetchNearbyPlaces(location.latitude, location.longitude, 5000)
            nearbyEssentials = [...nearbyEssentials, ...googlePlaces]
          }

          // Remove duplicates and sort by distance
          const uniquePlaces = nearbyEssentials.filter(
            (place, index, self) =>
              index === self.findIndex((p) => p.name === place.name && Math.abs(p.latitude - place.latitude) < 0.001),
          )

          const sortedPlaces = uniquePlaces.sort((a, b) => a.distance - b.distance)
          console.log("Final essentials data for map:", sortedPlaces)

          // If no real data, add some test data for debugging
          if (sortedPlaces.length === 0) {
            console.log("No real data found, adding test markers for debugging")
            const testData = [
              {
                id: "test_1",
                name: "Test Grocery Store",
                type: "grocery",
                latitude: location.latitude + 0.001,
                longitude: location.longitude + 0.001,
                distance: 0.1,
                address: "Test Address"
              },
              {
                id: "test_2",
                name: "Test Pharmacy",
                type: "pharmacy",
                latitude: location.latitude - 0.001,
                longitude: location.longitude + 0.001,
                distance: 0.15,
                address: "Test Address"
              },
              {
                id: "test_3",
                name: "Test Gas Station",
                type: "gas_station",
                latitude: location.latitude + 0.001,
                longitude: location.longitude - 0.001,
                distance: 0.2,
                address: "Test Address"
              }
            ]
            setEssentials(testData)
          } else {
            setEssentials(sortedPlaces)
          }
        } catch (error) {
          console.error("Error fetching places:", error)
          setError("Failed to fetch nearby places. Please try again.")
        }

        setLoading(false)
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location."
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            break
        }
        setError(errorMessage)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      },
    )
  }

  useEffect(() => {
    // Auto-request location on component mount
    getUserLocation()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" >
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200  top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <MapPin className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-blue-600 flex-shrink-0" />
              <span className="text-center">Nearby Essentials Finder</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed px-2">
              Discover hospitals, ATMs, groceries, pharmacies, and gas stations in your area with our smart location finder
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">

        {/* Location Status */}
        <Card className="mb-6 sm:mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-3 sm:pb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg px-4 sm:px-6 py-4 sm:py-6">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2 sm:gap-3">
              <Navigation className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <span>Location Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
            {loading && (
              <div className="flex items-center gap-2 sm:gap-3 text-blue-600 bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">Getting your location...</span>
              </div>
            )}

            {error && (
              <div className="text-red-600 bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200 mb-3 sm:mb-4">
                <div className="font-medium text-sm sm:text-base">❌ {error}</div>
              </div>
            )}

            {userLocation && (
              <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <span className="text-sm sm:text-base">Location found</span>
                </div>
                {addressLoading ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Getting address...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userAddress && (
                      <div className="text-gray-800 font-medium text-sm sm:text-base break-words">{userAddress}</div>
                    )}
                    <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded break-all">
                      {formatCoordinates(userLocation.latitude, userLocation.longitude, userLocation.accuracy)}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={getUserLocation}
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-0 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin flex-shrink-0" />
                  <span className="hidden sm:inline">Getting Location...</span>
                  <span className="sm:hidden">Getting...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">{userLocation ? "🔄 Refresh Location" : "📍 Get My Location"}</span>
                  <span className="sm:hidden">{userLocation ? "🔄 Refresh" : "📍 Get Location"}</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Main Content */}
        {userLocation && essentials.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Map Canvas */}
            <Card className="order-2 xl:order-1 xl:sticky xl:top-24 h-fit shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg px-4 sm:px-6 py-4 sm:py-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <span>Interactive Map View</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <MapCanvas
                  userLocation={userLocation}
                  essentials={essentials.slice(0, 20)} // Limit for performance
                />
              </CardContent>
            </Card>

            {/* Essentials List */}
            <div className="order-1 xl:order-2 space-y-4 sm:space-y-6">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg px-4 sm:px-6 py-4 sm:py-6">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                      {essentials.length}
                    </div>
                    <span className="text-sm sm:text-base lg:text-xl">Nearby Essentials Found</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <EssentialsList essentials={essentials} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!userLocation && !loading && (
          <Card className="text-center py-8 sm:py-12 lg:py-16 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="px-4 sm:px-6">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <MapPin className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Location Access Required</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-xs sm:max-w-md mx-auto leading-relaxed">
                To discover amazing places near you, we need access to your location. Your privacy is protected - we only use this to find nearby services.
              </p>
              <Button
                onClick={getUserLocation}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
              >
                <Navigation className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">🌟 Enable Location Access</span>
                <span className="sm:hidden">🌟 Enable Location</span>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Debug Panel */}
        {userLocation && <DebugPanel essentials={essentials} userLocation={userLocation} />}
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-8 sm:mt-12 lg:mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="text-center">
            <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">
              Built with ❤️ using React, Vite, and OpenStreetMap
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Find essential services near you with real-time location data
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
