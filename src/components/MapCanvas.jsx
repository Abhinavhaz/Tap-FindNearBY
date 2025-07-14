import { useEffect, useRef } from "react"

export default function MapCanvas({ userLocation, essentials }) {
  const canvasRef = useRef(null)

  // Debug logging
  console.log("MapCanvas received:", {
    userLocation,
    essentialsCount: essentials?.length || 0,
    essentials: essentials?.slice(0, 3) // Show first 3 for debugging
  })

  const getServiceColor = (type) => {
    switch (type) {
      case "hospital":
        return "#ef4444" // red
      case "atm":
        return "#10b981" // green
      case "grocery":
      case "supermarket":
      case "grocery_or_supermarket":
        return "#f59e0b" // amber
      case "pharmacy":
      case "drugstore":
        return "#8b5cf6" // purple
      case "gas_station":
      case "fuel":
        return "#06b6d4" // cyan
      case "bank":
        return "#10b981" // green (same as ATM)
      default:
        return "#6b7280" // gray
    }
  }

  const drawMap = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Check if we have valid data
    if (!userLocation || !essentials) {
      console.log("Missing data for map:", { userLocation: !!userLocation, essentials: !!essentials })
      return
    }

    const { width, height } = canvas

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw background grid
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1

    // Vertical lines
    for (let x = 0; x <= width; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Calculate bounds for positioning
    const allLats = [userLocation.latitude, ...essentials.map((e) => e.latitude)]
    const allLngs = [userLocation.longitude, ...essentials.map((e) => e.longitude)]

    const minLat = Math.min(...allLats)
    const maxLat = Math.max(...allLats)
    const minLng = Math.min(...allLngs)
    const maxLng = Math.max(...allLngs)

    console.log("Map bounds:", { minLat, maxLat, minLng, maxLng })

    console.log(
      "Drawing essentials:",
      essentials.map((e) => ({ name: e.name, type: e.type, lat: e.latitude, lng: e.longitude })),
    )

    const latRange = maxLat - minLat || 0.01
    const lngRange = maxLng - minLng || 0.01

    // Add padding
    const padding = 40
    const mapWidth = width - 2 * padding
    const mapHeight = height - 2 * padding

    const latToY = (lat) => padding + ((maxLat - lat) / latRange) * mapHeight
    const lngToX = (lng) => padding + ((lng - minLng) / lngRange) * mapWidth

    // Draw essentials markers
    essentials.forEach((essential, index) => {
      const x = lngToX(essential.longitude)
      const y = latToY(essential.latitude)

      // Skip if coordinates are invalid
      if (isNaN(x) || isNaN(y)) {
        console.warn("Invalid coordinates for:", essential.name)
        return
      }

      // Draw marker circle with larger size for better visibility
      ctx.fillStyle = getServiceColor(essential.type)
      ctx.beginPath()
      ctx.arc(x, y, 15, 0, 2 * Math.PI) // Increased to 15 for better visibility
      ctx.fill()

      // Draw marker border
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 4 // Increased border width
      ctx.stroke()

      console.log(`Drawing marker for ${essential.name} at (${x}, ${y}) with color ${getServiceColor(essential.type)}`)

      // Draw distance label with better positioning
      ctx.fillStyle = "#374151"
      ctx.font = "bold 11px sans-serif" // Made font bold and slightly larger
      ctx.textAlign = "center"
      ctx.fillText(`${essential.distance.toFixed(1)}km`, x, y + 25)

      // Add service type indicator
      ctx.fillStyle = "#1f2937"
      ctx.font = "10px sans-serif"
      ctx.fillText(essential.type.charAt(0).toUpperCase(), x, y - 15)
    })

    // Draw user location (on top)
    const userX = lngToX(userLocation.longitude)
    const userY = latToY(userLocation.latitude)

    // User location outer circle (pulse effect)
    ctx.fillStyle = "rgba(59, 130, 246, 0.3)"
    ctx.beginPath()
    ctx.arc(userX, userY, 16, 0, 2 * Math.PI)
    ctx.fill()

    // User location inner circle
    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(userX, userY, 10, 0, 2 * Math.PI)
    ctx.fill()

    // User location border
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 3
    ctx.stroke()

    // User label
    ctx.fillStyle = "#1f2937"
    ctx.font = "bold 12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("You", userX, userY - 25)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    const updateCanvasSize = () => {
      const container = canvas.parentElement
      if (container) {
        const rect = container.getBoundingClientRect()
        canvas.width = rect.width
        // Responsive height based on screen size
        const isMobile = window.innerWidth < 640
        const isTablet = window.innerWidth < 1024
        let maxHeight = 400
        if (isMobile) {
          maxHeight = 250
        } else if (isTablet) {
          maxHeight = 300
        }
        canvas.height = Math.min(maxHeight, Math.max(200, rect.width * 0.6))
        drawMap()
      }
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [userLocation, essentials])

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full border rounded-lg bg-gray-50"
        style={{
          maxHeight: "300px",
          minHeight: "200px"
        }}
      />

      {/* Legend */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-center text-sm sm:text-base">Map Legend</h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-1 sm:gap-2 bg-white p-1.5 sm:p-2 rounded-lg shadow-sm">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500 shadow-sm flex-shrink-0"></div>
            <span className="font-medium">📍 You</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 bg-white p-1.5 sm:p-2 rounded-lg shadow-sm">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500 shadow-sm flex-shrink-0"></div>
            <span className="font-medium">🏥 Hospital</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 bg-white p-1.5 sm:p-2 rounded-lg shadow-sm">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500 shadow-sm flex-shrink-0"></div>
            <span className="font-medium">🏧 ATM</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 bg-white p-1.5 sm:p-2 rounded-lg shadow-sm">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-amber-500 shadow-sm flex-shrink-0"></div>
            <span className="font-medium">🛒 Grocery</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 bg-white p-1.5 sm:p-2 rounded-lg shadow-sm">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-purple-500 shadow-sm flex-shrink-0"></div>
            <span className="font-medium">💊 Pharmacy</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 bg-white p-1.5 sm:p-2 rounded-lg shadow-sm">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-cyan-500 shadow-sm flex-shrink-0"></div>
            <span className="font-medium">⛽ Gas Station</span>
          </div>
        </div>
      </div>
    </div>
  )
}
