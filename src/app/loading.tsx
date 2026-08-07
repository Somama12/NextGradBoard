export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50 dark:bg-gray-950">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 shadow-sm"></div>
      <p className="text-gray-500 font-medium text-sm animate-pulse">Loading listings...</p>
    </div>
  )
}
