"use client"

import { Calendar, MapPin, Building2, ExternalLink, BookmarkPlus, CheckCircle2 } from "lucide-react"
import { trackApplication } from "@/app/actions/applications"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function ListingCard({ listing, isTracked = false }: { listing: any, isTracked?: boolean }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [tracked, setTracked] = useState(isTracked)
  const [loading, setLoading] = useState(false)

  const handleTrack = async () => {
    if (!session?.user) {
      router.push("/login")
      return
    }
    
    setLoading(true)
    const res = await trackApplication(listing.id)
    if (res.success) {
      setTracked(true)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 group">
      <div className="space-y-3 w-full">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-[17px] font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {listing.title}
            </h3>
            <div className="flex items-center text-gray-500 dark:text-gray-400 space-x-2">
              <Building2 className="w-4 h-4" />
              <span className="font-medium text-sm">{listing.company}</span>
              <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
              <span className="text-xs px-2.5 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 rounded-full font-medium tracking-wide">
                {listing.category}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{listing.location || "Location unlisted"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>
              {listing.datePosted ? new Date(listing.datePosted).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', timeZone: 'UTC'
              }) : 'Recently'}
            </span>
          </div>
           {listing.sponsorship && (
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
               listing.sponsorship === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
               listing.sponsorship === 'Unavailable' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
               'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              H1B: {listing.sponsorship}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-5 md:mt-0 md:ml-6 flex items-center md:flex-row w-full md:w-auto h-full space-x-3">
        {/* Save button */}
        <button 
          onClick={handleTrack}
          disabled={tracked || loading}
          className={`p-2.5 rounded-lg transition-colors border box-border ${
            tracked 
              ? 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800' 
              : 'text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 dark:bg-gray-700 dark:hover:bg-blue-900/30 border-transparent dark:border-gray-600'
          }`}
          title={tracked ? "Tracked" : "Track Application"}
        >
          {tracked ? <CheckCircle2 className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />}
        </button>

        <a 
          href={listing.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <span>Apply</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
