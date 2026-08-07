"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

const ITEMS_PER_PAGE = 20

export async function getListings({ page = 1, searchQuery = '' }: { page?: number, searchQuery?: string }) {
  const session = await auth()
  const skip = (page - 1) * ITEMS_PER_PAGE

  // The Gate: Limit unauthenticated users to the first page (first 20 listings)
  if (!session?.user && page > 1) {
    return {
      listings: [],
      totalPages: 1,
      error: "You must be logged in to view more listings.",
      requiresAuth: true
    }
  }

  const whereClause = {
    isActive: true,
    ...(searchQuery ? {
      OR: [
        { company: { contains: searchQuery, mode: 'insensitive' as const } },
        { title: { contains: searchQuery, mode: 'insensitive' as const } },
      ]
    } : {})
  }

  const totalListings = await prisma.listing.count({ where: whereClause })
  const totalPages = Math.ceil(totalListings / ITEMS_PER_PAGE)

  const listings = await prisma.listing.findMany({
    where: whereClause,
    skip,
    take: ITEMS_PER_PAGE,
    orderBy: { datePosted: 'desc' }
  })

  return { listings, totalPages, error: null, requiresAuth: false }
}
