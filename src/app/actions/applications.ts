"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getTrackedApplications() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    include: { listing: true },
    orderBy: { statusUpdatedAt: 'desc' },
  })

  return applications
}

export async function trackApplication(listingId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    const existing = await prisma.application.findUnique({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId: listingId,
        }
      }
    })

    if (existing) {
      return { success: false, error: "Already tracking this application." }
    }

    await prisma.application.create({
      data: {
        userId: session.user.id,
        listingId: listingId,
        status: "Saved",
      }
    })
    
    revalidatePath("/")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to track application." }
  }
}

export async function updateApplicationStatus(applicationId: string, newStatus: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  await prisma.application.update({
    where: { 
      id: applicationId,
      userId: session.user.id // Ensure they own it
    },
    data: {
      status: newStatus,
      statusUpdatedAt: new Date()
    }
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function updateApplicationNotes(applicationId: string, notes: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  await prisma.application.update({
    where: { 
      id: applicationId,
      userId: session.user.id // Ensure they own it
    },
    data: { notes }
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteTrackedApplication(applicationId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  await prisma.application.delete({
    where: { 
      id: applicationId,
      userId: session.user.id // Ensure they own it
    }
  })

  revalidatePath("/dashboard")
  return { success: true }
}
