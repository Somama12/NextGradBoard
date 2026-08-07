# NextGradBoard 🎓

NextGradBoard is a beautifully designed, full-stack job board mapping 2027 New Grad and Summer 2027 Tech Internship listings natively integrated with an applicant tracker.

## 🚀 Features

-   **Modern Tech Stack**: Next.js App Router, Tailwind CSS, Prisma, and unified Server Actions.
-   **Automated Ingestion Pipeline**: Scrapes known GitHub repos (like Pitt CSC) to ingest jobs fully automatically utilizing Vercel Cron jobs.
-   **Auth & Security**: Handled by Auth.js (NextAuth v5 beta) leveraging Google OAuth and Credential login.
-   **Pagination Gate**: The first 20 listings are open. Viewers are nudged to create a free account to browse deeper.
-   **Applicant Tracking Dashboard**: Integrated dashboard to save postings, transition statuses (Applied, Interviewing, Offer, etc.), and store private personal notes per posting.

## 🛠️ Local Setup

1.  **Clone the repository**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Copy `.env.example` to `.env` and fill the variables.
    ```bash
    DATABASE_URL="postgres://your_supabase_postgres_string"
    AUTH_SECRET="generate_random_secret"
    CRON_SECRET="your_cron_secret"
    ```
4.  **Database Migration & Seeding:**
    Sync Prisma to your Postgres database and optionally push 45 dummy listings to test pagination.
    ```bash
    npx prisma db push
    npm run prisma:seed
    ```
5.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## 🌍 Vercel Deployment

This repository is fully optimized to be deployed to Vercel stringently for free.

1. Create a [Vercel Project](https://vercel.com/new).
2. Create a [Supabase Postgres DB](https://supabase.com).
3. Under Environment Variables in Vercel, attach your `DATABASE_URL`, `AUTH_SECRET`, and `CRON_SECRET`.
4. Deploy! Vercel will automatically read `vercel.json` and provision the Daily Cron job for data ingestion.

Built with Next.js App Router & Tailwind CSS. Designed to be fast, responsive, and completely scalable.
