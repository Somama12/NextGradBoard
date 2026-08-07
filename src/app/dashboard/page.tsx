import { getTrackedApplications } from "@/app/actions/applications"
import { auth, signOut } from "@/auth"
import { ApplicationCard } from "@/components/ApplicationCard"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const applications = await getTrackedApplications()

  const stats = {
    total: applications.length,
    interviewing: applications.filter(a => a.status === 'Interviewing').length,
    applied: applications.filter(a => a.status === 'Applied').length,
    offers: applications.filter(a => a.status === 'Offer').length,
  }

  return (
    <main className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pb-20">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900 dark:text-white">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">N</div>
            NextGradBoard
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:inline-block">
              {session.user.name || session.user.email}
            </span>
            <Link href="/" className="text-sm font-medium px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/40 text-blue-700 dark:text-blue-300 rounded-lg transition-colors">
              Find Jobs
            </Link>
            <form action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}>
              <button type="submit" className="text-sm font-medium px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors shadow-sm">
                Log out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">My Applications</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage your internship and new grad opportunities.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Tracked</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-sm font-medium text-blue-500 mb-1">Applied</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.applied}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-sm font-medium text-purple-500 mb-1">Interviewing</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.interviewing}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-sm font-medium text-green-500 mb-1">Offers</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.offers}</div>
          </div>
        </div>

        {applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map(app => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No applications tracked</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">Start exploring the job board and save roles you are interested in.</p>
            <Link href="/" className="inline-flex justify-center items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm">
              Browse Listings
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
