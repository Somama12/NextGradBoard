export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-transparent">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 shadow-sm"></div>
      <p className="text-gray-500 font-medium text-sm animate-pulse">Loading dashboard...</p>
    </div>
  )
}
