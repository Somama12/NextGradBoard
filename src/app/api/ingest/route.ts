import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Example target: using Pitt CSC or similarly structured summer internship markdown tables
export async function GET(req: NextRequest) {
  // Simple auth gate for the cron trigger
  const authHeader = req.headers.get("authorization");
  if (
    process.env.NODE_ENV === "production" && 
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // We simulate fetching a well-known markdown file. Since the 2027 repo doesn't exist yet, 
    // we use a known format from past Pitt CSC repos or similar tech job aggregators.
    const TARGET_URL = "https://raw.githubusercontent.com/pittcsc/Summer2024-Internships/dev/README.md";
    const response = await fetch(TARGET_URL);
    if (!response.ok) throw new Error("Failed to fetch markdown source");
    const markdown = await response.text();

    /* 
     * Extractor Logic: 
     * Markdown tables often look like: | Company | Role | Location | Application Link | Date Posted |
     */
    const regex = /\|\s*\*\*(.*?)\*\*\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|/g;
    let match;
    let addedCount = 0;
    
    // De-duplication set to prevent multiple DB queries for identical rows during a single run
    const seenUrls = new Set<string>();

    while ((match = regex.exec(markdown)) !== null) {
      if (match[1] === "Company") continue; // Skip header

      const company = match[1].trim();
      const title = match[2].replace(/<[^>]*>?/gm, '').trim(); // Remove basic HTML tags from title
      const location = match[3].replace(/<[^>]*>?/gm, '').trim();
      
      // Parse link safely (often looks like <a href="url">...</a> or [Apply](url))
      const linkMatchHref = match[4].match(/href=["'](.*?)["']/);
      const linkMatchMd = match[4].match(/\[.*?\]\((.*?)\)/);
      let url = (linkMatchHref ? linkMatchHref[1] : (linkMatchMd ? linkMatchMd[1] : null));
      
      if (!url || url.includes("🔒") || seenUrls.has(url)) continue;
      
      seenUrls.add(url);

      try {
        await prisma.listing.upsert({
          where: { url },
          update: {
            title,
            location,
            updatedAt: new Date()
          },
          create: {
            company,
            title,
            location,
            url,
            category: "Internship", // Given the source repo
            isActive: true,
          }
        });
        addedCount++;
      } catch (err) {
        console.error("Failed to upsert listing:", company, title, err);
      }
    }

    return NextResponse.json({ success: true, processed: addedCount });
  } catch (error) {
    console.error("Ingestion error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
