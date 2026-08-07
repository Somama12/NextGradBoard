"use client"

import { Calendar, MapPin, Building2, ExternalLink, BookmarkPlus } from "lucide-react"

export function ListingCard({ listing }: { listing: any }) {
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
              {listing.datePosted ? new Date(listing.datePosted).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric'
              }) : 'Recently'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-5 md:mt-0 md:ml-6 flex items-center md:flex-row w-full md:w-auto h-full space-x-3">
        {/* Save button (placeholder functionality for now) */}
        <button className="p-2.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 dark:bg-gray-700 dark:hover:bg-blue-900/30 rounded-lg transition-colors border border-transparent dark:border-gray-600 box-border">
          <BookmarkPlus className="w-5 h-5" />
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
