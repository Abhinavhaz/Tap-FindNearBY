// Google Places API configuration
const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || "YOUR_API_KEY_HERE"
const PLACES_API_BASE_URL = "https://maps.googleapis.com/maps/api/place"

// Service type mapping for Google Places
const SERVICE_TYPE_MAPPING = {
  hospital: ["hospital", "doctor", "health", "clinic", "medical"],
  atm: ["atm", "bank", "finance"],
  grocery: ["grocery_or_supermarket", "supermarket", "food", "convenience_store"],
  pharmacy: ["pharmacy", "drugstore", "health"],
  gas_station: ["gas_station", "fuel", "petrol"],
}

// Convert Google Places type to our app type
const convertPlaceType = (googleTypes) => {
  // Check each type mapping
  for (const [ourType, googleTypeList] of Object.entries(SERVICE_TYPE_MAPPING)) {
    if (googleTypes.some((type) => googleTypeList.includes(type))) {
      return ourType
    }
  }

  // Additional specific mappings
  if (googleTypes.includes("bank")) return "atm"
  if (googleTypes.includes("convenience_store")) return "grocery"
  if (googleTypes.includes("health")) return "pharmacy"

  return "other"
}

// Calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Fetch places from Google Places API
export const fetchNearbyPlaces = async (latitude, longitude, radius = 5000) => {
  if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY === "YOUR_API_KEY_HERE") {
    console.warn("Google Places API key not configured, using fallback data")
    return getFallbackData(latitude, longitude)
  }

  try {
    const allPlaces = []
    const searchTypes = ["hospital", "atm", "supermarket", "pharmacy", "gas_station"]

    // Fetch places for each type
    for (const type of searchTypes) {
      const url = `${PLACES_API_BASE_URL}/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.status === "OK" && data.results) {
        const places = data.results.slice(0, 10).map((place, index) => ({
          id: `${type}_${place.place_id || index}`,
          name: place.name,
          type: convertPlaceType(place.types),
          address: place.vicinity || place.formatted_address || "Address not available",
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          distance: calculateDistance(latitude, longitude, place.geometry.location.lat, place.geometry.location.lng),
          rating: place.rating || null,
          isOpen: place.opening_hours?.open_now ?? null,
          phone: null, // Would need Place Details API for phone numbers
          priceLevel: place.price_level || null,
          photoReference: place.photos?.[0]?.photo_reference || null,
        }))

        allPlaces.push(...places)
      }
    }

    // Sort by distance and remove duplicates
    const uniquePlaces = allPlaces.filter(
      (place, index, self) => index === self.findIndex((p) => p.name === place.name && p.address === place.address),
    )

    return uniquePlaces.sort((a, b) => a.distance - b.distance)
  } catch (error) {
    console.error("Error fetching places:", error)
    return getFallbackData(latitude, longitude)
  }
}

// Alternative: Use Overpass API (OpenStreetMap) - Free alternative
export const fetchNearbyPlacesOSM = async (latitude, longitude, radius = 5000) => {
  try {
    const overpassUrl = "https://overpass-api.de/api/interpreter"

    // Overpass query for different amenities
    const query = `
  [out:json][timeout:25];
  (
    node["amenity"~"^(hospital|clinic|doctors|pharmacy|bank|atm|fuel|supermarket|convenience|grocery)$"](around:${radius},${latitude},${longitude});
    way["amenity"~"^(hospital|clinic|doctors|pharmacy|bank|atm|fuel|supermarket|convenience|grocery)$"](around:${radius},${latitude},${longitude});
    relation["amenity"~"^(hospital|clinic|doctors|pharmacy|bank|atm|fuel|supermarket|convenience|grocery)$"](around:${radius},${latitude},${longitude});
    node["shop"~"^(supermarket|convenience|grocery)$"](around:${radius},${latitude},${longitude});
    way["shop"~"^(supermarket|convenience|grocery)$"](around:${radius},${latitude},${longitude});
  );
  out center meta;
`

    const response = await fetch(overpassUrl, {
      method: "POST",
      body: query,
      headers: {
        "Content-Type": "text/plain",
      },
    })

    const data = await response.json()

    if (data.elements) {
      const places = data.elements
        .map((element, index) => {
          const lat = element.lat || element.center?.lat
          const lon = element.lon || element.center?.lon

          if (!lat || !lon) return null

          const amenity = element.tags?.amenity || element.tags?.shop
          let type = "other"

          switch (amenity) {
            case "hospital":
            case "clinic":
            case "doctors":
              type = "hospital"
              break
            case "pharmacy":
              type = "pharmacy"
              break
            case "bank":
            case "atm":
              type = "atm"
              break
            case "fuel":
              type = "gas_station"
              break
            case "supermarket":
            case "convenience":
            case "grocery":
              type = "grocery"
              break
          }

          return {
            id: `osm_${element.id || index}`,
            name: element.tags?.name || `${type.charAt(0).toUpperCase() + type.slice(1)} Service`,
            type,
            address:
              element.tags?.["addr:full"] ||
              `${element.tags?.["addr:housenumber"] || ""} ${element.tags?.["addr:street"] || ""}`.trim() ||
              "Address not available",
            latitude: lat,
            longitude: lon,
            distance: calculateDistance(latitude, longitude, lat, lon),
            phone: element.tags?.phone || null,
            rating: null,
            isOpen: element.tags?.opening_hours ? null : null, // Would need to parse opening hours
            website: element.tags?.website || null,
          }
        })
        .filter(Boolean)

      return places.sort((a, b) => a.distance - b.distance).slice(0, 50)
    }

    return getFallbackData(latitude, longitude)
  } catch (error) {
    console.error("Error fetching OSM places:", error)
    return getFallbackData(latitude, longitude)
  }
}

// Fallback data generator based on user location
const getFallbackData = (userLat, userLng) => {
  const generateNearbyCoordinate = (baseLat, baseLng, maxDistanceKm = 5) => {
    const earthRadius = 6371
    const maxDistance = maxDistanceKm / earthRadius

    const randomDistance = Math.random() * maxDistance
    const randomBearing = Math.random() * 2 * Math.PI

    const lat =
      (Math.asin(
        Math.sin((baseLat * Math.PI) / 180) * Math.cos(randomDistance) +
          Math.cos((baseLat * Math.PI) / 180) * Math.sin(randomDistance) * Math.cos(randomBearing),
      ) *
        180) /
      Math.PI

    const lng =
      (((baseLng * Math.PI) / 180 +
        Math.atan2(
          Math.sin(randomBearing) * Math.sin(randomDistance) * Math.cos((baseLat * Math.PI) / 180),
          Math.cos(randomDistance) - Math.sin((baseLat * Math.PI) / 180) * Math.sin((lat * Math.PI) / 180),
        )) *
        180) /
      Math.PI

    return { lat, lng }
  }

  const fallbackPlaces = []
  const placeTypes = [
    { type: "hospital", names: ["General Hospital", "Medical Center", "Urgent Care", "Emergency Clinic"] },
    { type: "atm", names: ["Bank ATM", "Credit Union ATM", "Cash Point", "Money Center"] },
    { type: "grocery", names: ["Supermarket", "Grocery Store", "Food Market", "Corner Store"] },
    { type: "pharmacy", names: ["Pharmacy", "Drugstore", "Medical Supplies", "Health Store"] },
    { type: "gas_station", names: ["Gas Station", "Fuel Stop", "Service Station", "Petrol Station"] },
  ]

  placeTypes.forEach((category, categoryIndex) => {
    for (let i = 0; i < 4; i++) {
      const coords = generateNearbyCoordinate(userLat, userLng)
      const distance = calculateDistance(userLat, userLng, coords.lat, coords.lng)

      fallbackPlaces.push({
        id: `fallback_${categoryIndex}_${i}`,
        name: `${category.names[i % category.names.length]} ${i + 1}`,
        type: category.type,
        address: `${Math.floor(Math.random() * 9999) + 1} Local Street, Your Area`,
        latitude: coords.lat,
        longitude: coords.lng,
        distance,
        phone:
          category.type !== "atm"
            ? `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`
            : null,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
        isOpen: Math.random() > 0.2, // 80% chance of being open
      })
    }
  })

  return fallbackPlaces.sort((a, b) => a.distance - b.distance)
}

// Export the main function
export const mockEssentials = [] // Keep for backward compatibility
export default {
  fetchNearbyPlaces,
  fetchNearbyPlacesOSM,
  getFallbackData,
}
