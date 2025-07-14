import { Loader2 } from "lucide-react"

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  )
}
