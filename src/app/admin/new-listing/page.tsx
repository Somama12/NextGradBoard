import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

async function createListing(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session?.user) redirect("/login")

  const company = formData.get("company") as string
  const title = formData.get("title") as string
  const location = formData.get("location") as string
  const category = formData.get("category") as string
  const sponsorship = formData.get("sponsorship") as string
  const url = formData.get("url") as string

  if (!company || !title || !url) return

  await prisma.listing.create({
    data: {
      company,
      title,
      location,
      category,
      sponsorship,
      url,
      datePosted: new Date(),
      isActive: true,
    }
  })

  redirect("/")
}

export default async function NewListingPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900 dark:text-white">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">N</div>
            NextGradBoard
          </Link>
          <Link href="/" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600">
            ← Back to listings
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">Add a New Listing</h1>
          <p className="text-gray-500 dark:text-gray-400">Manually submit a job posting to the board.</p>
        </div>

        <form action={createListing} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Company *</label>
              <input name="company" required placeholder="e.g. Google" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Role Title *</label>
              <input name="title" required placeholder="e.g. Software Engineer Intern" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Location</label>
              <input name="location" placeholder="e.g. San Francisco, CA or Remote" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select name="category" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer">
                <option value="Internship">Internship</option>
                <option value="New Grad">New Grad</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">H1B Sponsorship</label>
              <select name="sponsorship" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer">
                <option value="Unknown">Unknown</option>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Application URL *</label>
              <input name="url" required type="url" placeholder="https://careers.google.com/..." className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Link href="/" className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors">
              Cancel
            </Link>
            <button type="submit" className="px-8 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
              Publish Listing
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
