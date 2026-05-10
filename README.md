# Traveloop

Traveloop is a modern travel planning platform built with Next.js, Prisma, and PostgreSQL. It combines itinerary planning, budgeting, and collaboration with a polished UI for both public landing pages and authenticated dashboards.

## Vercel Deployment

- **Vercel Deployment Link:** [https://ox-ph-traveloop.vercel.app/]

## Highlights

- Dynamic landing page that reads destinations and trip stats from the database.
- Full profile management with editable details and Cloudinary avatar uploads.
- Trip management dashboard with upcoming, ongoing, and completed trips.
- Prisma-backed API routes for authentication, profile updates, and trips.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Prisma ORM + PostgreSQL
- NextAuth (Credentials provider)
- Tailwind CSS + shadcn/ui
- Framer Motion

## Project Structure

- `app/` - App Router pages and API routes
- `components/` - UI building blocks and page sections
- `lib/` - Auth helpers and Prisma client
- `prisma/` - Schema and seed data

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file at the project root (if not already present) with values like:

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-strong-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3) Generate Prisma client

```bash
npx prisma generate
```

### 4) Seed the database (optional)

```bash
npx tsx prisma/seed.ts
```

### 5) Start the dev server

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## Key Features

### Landing Page

- Hero stats and destination cards sourced from public trips.
- Smooth animations and modern section layout.

### Dashboard

- Personalized trip cards from the signed-in user and public trips.
- Top regional selections derived from trip stops.

### Profile

- Edit profile details and language preferences.
- Upload profile photo to Cloudinary and persist in the database.
- Change password flow for credentials-based accounts.

## Scripts

- `npm run dev` - start the development server
- `npm run build` - production build
- `npm run start` - start production server
- `npm run lint` - lint the codebase


