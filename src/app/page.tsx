import { getListings } from "@/app/actions/listings"
import { ListingCard } from "@/components/ListingCard"
import Link from "next/link"
import { Search } from "lucide-react"
import { auth } from "@/auth"

export default async function Home(props: {
  searchParams: Promise<{ page?: string; q?: string; category?: string; sponsorship?: string }>
}) {
  const searchParams = await props.searchParams
  const pageParam = Number(searchParams.page) || 1
  const q = searchParams.q || ""
  const categoryParam = searchParams.category || "All"
  const sponsorshipParam = searchParams.sponsorship || "All"
  
  const session = await auth()

  const { listings, totalPages, error, requiresAuth } = await getListings({
    page: pageParam,
    searchQuery: q,
    category: categoryParam,
    sponsorship: sponsorshipParam
  })

  return (
    <main className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pb-20">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900 dark:text-white">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">N</div>
            NextGradBoard
          </div>
          <div className="flex items-center gap-4">
            {session?.user ? (
               <Link href="/dashboard" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600">Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600">Log in</Link>
                <Link href="/register" className="text-sm font-medium px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Grad Role</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The curated board for 2027 New Grad and Summer 2027 Tech Internships.
          </p>
        </div>

        {/* Search & Filters */}
        <form className="max-w-3xl mx-auto mb-10 space-y-4">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search companies or roles..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-4">
              <select name="category" defaultValue={categoryParam} className="px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer">
                <option value="All">All Categories</option>
                <option value="Internship">Internship</option>
                <option value="New Grad">New Grad</option>
              </select>
              <select name="sponsorship" defaultValue={sponsorshipParam} className="px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer">
                <option value="All">Any Sponsorship</option>
                <option value="Available">H1B Available</option>
                <option value="Unavailable">H1B Unavailable</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
            <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm whitespace-nowrap">
              Apply Filters
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}

          {listings.length === 0 && !requiresAuth && (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-gray-500 dark:text-gray-400">No listings found matching your criteria.</p>
            </div>
          )}

          {requiresAuth && (
            <div className="mt-8 text-center p-10 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You've reached the free limit.</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Create a free account to unlock hundreds of more New Grad and Internship listings.</p>
              <Link href="/register" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all">
                Sign Up for Free
              </Link>
              <p className="mt-4 text-sm text-gray-500">
                Already have an account? <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">Log in</Link>
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!requiresAuth && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            {pageParam > 1 && (
              <Link href={`/?page=${pageParam - 1}${q ? `&q=${q}` : ''}${categoryParam !== 'All' ? `&category=${categoryParam}` : ''}${sponsorshipParam !== 'All' ? `&sponsorship=${sponsorshipParam}` : ''}`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 transition-colors">
                Previous
              </Link>
            )}
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 px-4">
              Page {pageParam} of {totalPages}
            </span>
            {pageParam < totalPages && (
              <Link href={`/?page=${pageParam + 1}${q ? `&q=${q}` : ''}${categoryParam !== 'All' ? `&category=${categoryParam}` : ''}${sponsorshipParam !== 'All' ? `&sponsorship=${sponsorshipParam}` : ''}`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 transition-colors">
                Next
              </Link>
            )}
            {!session?.user && pageParam === 1 && totalPages > 1 && (
              <Link href={`/?page=2${q ? `&q=${q}` : ''}${categoryParam !== 'All' ? `&category=${categoryParam}` : ''}${sponsorshipParam !== 'All' ? `&sponsorship=${sponsorshipParam}` : ''}`} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
