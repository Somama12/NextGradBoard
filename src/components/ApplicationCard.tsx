"use client"

import { useState } from "react"
import { Building2, MapPin, Calendar, ExternalLink, Trash2, Edit3, Save } from "lucide-react"
import { updateApplicationStatus, updateApplicationNotes, deleteTrackedApplication } from "@/app/actions/applications"

const STATUS_COLORS: Record<string, string> = {
  Saved: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  Applied: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  Interviewing: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  Offer: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
}

const STATUS_OPTIONS = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"]

export function ApplicationCard({ application }: { application: any }) {
  const { listing } = application
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notes, setNotes] = useState(application.notes || "")
  const [status, setStatus] = useState(application.status)
  
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    await updateApplicationStatus(application.id, newStatus)
  }

  const handleSaveNotes = async () => {
    await updateApplicationNotes(application.id, notes)
    setIsEditingNotes(false)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to stop tracking this role?")) {
      await deleteTrackedApplication(application.id)
    }
  }

  return (
    <div className="flex flex-col p-5 bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-gray-700/50 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[17px] font-semibold text-gray-900 dark:text-white">
            {listing.title}
          </h3>
          <div className="flex items-center text-gray-500 dark:text-gray-400 space-x-2 mt-1">
            <Building2 className="w-4 h-4" />
            <span className="font-medium text-sm">{listing.company}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select 
            value={status}
            onChange={handleStatusChange}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer appearance-none outline-none focus:ring-2 focus:ring-blue-500 ${STATUS_COLORS[status] || STATUS_COLORS.Saved}`}
          >
            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-white text-gray-900">{opt}</option>)}
          </select>
          <button onClick={handleDelete} className="p-1.5 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 dark:bg-gray-700/50 dark:hover:bg-red-900/30 rounded-md transition-colors" title="Remove">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          <span>{listing.location || "Location unlisted"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          Last updated: {new Date(application.statusUpdatedAt).toLocaleDateString()}
        </div>
      </div>

      <div className="mt-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 border border-gray-100 dark:border-gray-700/50 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</span>
          {!isEditingNotes ? (
            <button onClick={() => setIsEditingNotes(true)} className="text-gray-400 hover:text-blue-500"><Edit3 className="w-3.5 h-3.5" /></button>
          ) : (
             <button onClick={handleSaveNotes} className="text-blue-600 dark:text-blue-400 hover:text-blue-700"><Save className="w-3.5 h-3.5" /></button>
          )}
        </div>
        {isEditingNotes ? (
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Add interview details, recruiter names, etc."
            className="w-full h-20 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-gray-800 dark:text-gray-200"
          />
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-300 min-h-[50px] whitespace-pre-wrap">
            {notes || "No notes yet. Click the edit icon to add some."}
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <a 
          href={listing.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors"
        >
          View Original Posting
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  )
}
