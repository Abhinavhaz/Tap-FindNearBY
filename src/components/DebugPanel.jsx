import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPanel({ essentials, userLocation }) {
  const [showDebug, setShowDebug] = useState(false)

  if (!showDebug) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDebug(true)}
        className="fixed bottom-3 sm:bottom-4 right-3 sm:right-4 z-50 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
      >
        <span className="hidden sm:inline">Debug Info</span>
        <span className="sm:hidden">Debug</span>
      </Button>
    )
  }

  const typeCounts = essentials.reduce((acc, essential) => {
    acc[essential.type] = (acc[essential.type] || 0) + 1
    return acc
  }, {})

  return (
    <Card className="fixed bottom-3 sm:bottom-4 right-3 sm:right-4 w-72 sm:w-80 max-h-80 sm:max-h-96 overflow-y-auto z-50 shadow-xl">
      <CardHeader className="pb-2 px-3 sm:px-4 py-2 sm:py-3">
        <CardTitle className="text-xs sm:text-sm flex justify-between items-center">
          <span>Debug Info</span>
          <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)} className="h-6 w-6 p-0">
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>User Location:</strong>
          <br />
          {userLocation?.latitude.toFixed(4)}, {userLocation?.longitude.toFixed(4)}
        </div>

        <div>
          <strong>Total Places:</strong> {essentials.length}
        </div>

        <div>
          <strong>By Type:</strong>
          <ul className="ml-2">
            {Object.entries(typeCounts).map(([type, count]) => (
              <li key={type}>
                {type}: {count}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <strong>First 5 Places:</strong>
          <ul className="ml-2">
            {essentials.slice(0, 5).map((place) => (
              <li key={place.id} className="truncate">
                {place.name} ({place.type}) - {place.distance.toFixed(1)}km
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
