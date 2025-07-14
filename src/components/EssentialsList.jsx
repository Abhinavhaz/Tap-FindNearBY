import { useState, useEffect, useRef } from "react"
import { MapPin, Clock, Phone, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

function EssentialItem({ essential, isVisible }) {
  const getServiceIcon = (type) => {
    switch (type) {
      case "hospital":
        return "🏥"
      case "atm":
        return "🏧"
      case "grocery":
        return "🛒"
      case "pharmacy":
        return "💊"
      case "gas_station":
        return "⛽"
      default:
        return "📍"
    }
  }

  const getServiceColor = (type) => {
    switch (type) {
      case "hospital":
        return "bg-red-100 text-red-800"
      case "atm":
        return "bg-green-100 text-green-800"
      case "grocery":
        return "bg-amber-100 text-amber-800"
      case "pharmacy":
        return "bg-purple-100 text-purple-800"
      case "gas_station":
        return "bg-cyan-100 text-cyan-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isVisible) {
    return (
      <div className="h-36 flex items-center justify-center border-b border-gray-100">
        <div className="animate-pulse flex space-x-4 w-full p-6">
          <div className="rounded-full bg-gradient-to-br from-gray-200 to-gray-300 h-14 w-14"></div>
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100 last:border-b-0 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 hover:shadow-md rounded-lg mx-1 sm:mx-2 my-1">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="text-2xl sm:text-3xl flex-shrink-0 mt-1 p-1.5 sm:p-2 bg-white rounded-full shadow-sm">
          {getServiceIcon(essential.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg break-words">{essential.name}</h3>
            <Badge className={`${getServiceColor(essential.type)} font-semibold px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm self-start sm:self-auto flex-shrink-0`}>
              {essential.type.replace("_", " ").toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-gray-500" />
              <span className="text-xs sm:text-sm break-words">{essential.address}</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 flex-wrap">
              <div className="flex items-center gap-1 sm:gap-2 bg-blue-100 px-2 sm:px-3 py-1 rounded-full">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="font-bold text-blue-700 text-xs sm:text-sm">{essential.distance.toFixed(1)} km away</span>
              </div>

              {essential.rating && (
                <div className="flex items-center gap-1 bg-yellow-100 px-2 sm:px-3 py-1 rounded-full">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-500 text-yellow-500 flex-shrink-0" />
                  <span className="font-semibold text-yellow-700 text-xs sm:text-sm">{essential.rating}</span>
                </div>
              )}

              {essential.isOpen !== undefined && (
                <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full ${
                  essential.isOpen ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className={`font-semibold text-xs sm:text-sm ${
                    essential.isOpen ? "text-green-700" : "text-red-700"
                  }`}>
                    {essential.isOpen ? "Open Now" : "Closed"}
                  </span>
                </div>
              )}
            </div>

            {essential.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <a href={`tel:${essential.phone}`} className="text-blue-600 hover:underline">
                  {essential.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EssentialsList({ essentials }) {
  const [visibleItems, setVisibleItems] = useState(new Set())
  const observerRef = useRef(null)
  const itemRefs = useRef([])

  useEffect(() => {
    // Initialize Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, index]))
          }
        })
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.1,
      },
    )

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    // Observe all items
    itemRefs.current.forEach((ref, index) => {
      if (ref && observerRef.current) {
        ref.setAttribute("data-index", index.toString())
        observerRef.current.observe(ref)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [essentials])

  return (
    <div className="max-h-[620px] overflow-y-auto">
      {essentials.map((essential, index) => (
        <div
          key={essential.id}
          ref={(el) => {
            itemRefs.current[index] = el
          }}
        >
          <EssentialItem essential={essential} isVisible={visibleItems.has(index)} />
        </div>
      ))}

      {essentials.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No essentials found nearby</p>
        </div>
      )}
    </div>
  )
}
