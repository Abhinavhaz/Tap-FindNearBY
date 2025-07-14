// Reverse geocoding utilities to convert coordinates to human-readable addresses

/**
 * Get address from coordinates using OpenStreetMap Nominatim (free)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} - Formatted address
 */
export async function getAddressFromCoordinatesOSM(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'NearbyEssentialsFinder/1.0'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch address from OSM')
    }
    
    const data = await response.json()
    
    if (data && data.display_name) {
      // Format the address nicely
      const address = data.address || {}
      const parts = []
      
      // Add house number and road
      if (address.house_number && address.road) {
        parts.push(`${address.house_number} ${address.road}`)
      } else if (address.road) {
        parts.push(address.road)
      }
      
      // Add neighborhood or suburb
      if (address.neighbourhood || address.suburb) {
        parts.push(address.neighbourhood || address.suburb)
      }
      
      // Add city
      if (address.city || address.town || address.village) {
        parts.push(address.city || address.town || address.village)
      }
      
      // Add state/region
      if (address.state) {
        parts.push(address.state)
      }
      
      // Add country
      if (address.country) {
        parts.push(address.country)
      }
      
      return parts.length > 0 ? parts.join(', ') : data.display_name
    }
    
    throw new Error('No address found')
  } catch (error) {
    console.error('OSM reverse geocoding error:', error)
    throw error
  }
}

/**
 * Get address from coordinates using Google Geocoding API (requires API key)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} - Formatted address
 */
export async function getAddressFromCoordinatesGoogle(lat, lng) {
  const apiKey = import.meta.env.VITE_GOOGLE_GEOCODING_API_KEY
  
  if (!apiKey) {
    throw new Error('Google Geocoding API key not configured')
  }
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch address from Google')
    }
    
    const data = await response.json()
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      return data.results[0].formatted_address
    }
    
    throw new Error('No address found')
  } catch (error) {
    console.error('Google reverse geocoding error:', error)
    throw error
  }
}

/**
 * Get address from coordinates with multiple fallbacks
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} - Formatted address
 */
export async function getAddressFromCoordinates(lat, lng) {
  // Try OpenStreetMap first (free)
  try {
    const address = await getAddressFromCoordinatesOSM(lat, lng)
    return address
  } catch (error) {
    console.log('OSM geocoding failed, trying Google...')
  }
  
  // Fallback to Google if available
  try {
    const address = await getAddressFromCoordinatesGoogle(lat, lng)
    return address
  } catch (error) {
    console.log('Google geocoding failed')
  }
  
  // If all fails, return coordinates
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
}

/**
 * Format coordinates with accuracy for display
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} accuracy - Accuracy in meters
 * @returns {string} - Formatted coordinates string
 */
export function formatCoordinates(lat, lng, accuracy) {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)} (±${Math.round(accuracy)}m accuracy)`
}
