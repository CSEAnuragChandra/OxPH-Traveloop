import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DestinationsSection from "@/components/DestinationsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=85";

function formatNumber(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

function getDestinationTag(count: number) {
  if (count >= 5) {
    return { tag: "Trending", tagColor: "bg-orange-500" };
  }
  if (count >= 3) {
    return { tag: "Popular", tagColor: "bg-violet-500" };
  }
  return { tag: "Hidden gem", tagColor: "bg-teal-500" };
}

function getRating(count: number) {
  const score = 4.2 + Math.min(count, 5) * 0.1;
  return Number(score.toFixed(1));
}

export default async function HomePage() {
  const publicTrips = await prisma.trip.findMany({
    where: { isPublic: true },
    select: {
      id: true,
      coverPhoto: true,
      stops: {
        select: { cityName: true, country: true },
        take: 1,
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  const totalTrips = await prisma.trip.count({ where: { isPublic: true } });
  const uniqueCountries = await prisma.stop.findMany({
    where: { trip: { isPublic: true } },
    select: { country: true },
  });
  const uniqueCountryCount = new Set(
    uniqueCountries.map((stop) => stop.country).filter(Boolean)
  ).size;
  const totalStops = await prisma.stop.count({ where: { trip: { isPublic: true } } });

  const destinationMap = new Map<string, { name: string; country: string; count: number; image: string }>();

  publicTrips.forEach((trip) => {
    const stop = trip.stops[0];
    if (!stop?.cityName || !stop?.country) {
      return;
    }
    const key = `${stop.cityName}-${stop.country}`;
    const existing = destinationMap.get(key);
    const image = trip.coverPhoto || FALLBACK_IMAGE;

    if (!existing) {
      destinationMap.set(key, {
        name: stop.cityName,
        country: stop.country,
        count: 1,
        image,
      });
    } else {
      destinationMap.set(key, {
        ...existing,
        count: existing.count + 1,
        image: existing.image || image,
      });
    }
  });

  const destinations = Array.from(destinationMap.values())
    .sort((a, b) => b.count - a.count)
    .map((dest) => {
      const { tag, tagColor } = getDestinationTag(dest.count);
      return {
        name: dest.name,
        country: dest.country,
        image: dest.image || FALLBACK_IMAGE,
        rating: getRating(dest.count),
        tag,
        trips: `${formatNumber(dest.count)} trips`,
        tagColor,
      };
    });

  const heroStats = [
    { value: formatNumber(totalTrips), label: "Trips planned" },
    { value: formatNumber(uniqueCountryCount), label: "Countries covered" },
    { value: formatNumber(totalStops), label: "Stops mapped" },
  ];

  return (
    <main className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection stats={heroStats} />
      <FeaturesSection />
      <DestinationsSection destinations={destinations} />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
