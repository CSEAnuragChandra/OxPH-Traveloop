import { NextRequest, NextResponse } from "next/server";

// Mocked activity/place data for the Explore page
// In production this could call Google Places, Foursquare, etc.
const MOCK_ACTIVITIES = [
  // Paris
  { id: "exp-1", title: "Eiffel Tower", city: "Paris", country: "France", category: "Sightseeing", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600&q=80", description: "Iconic iron lattice tower on the Champ de Mars.", duration: 120, cost: 28 },
  { id: "exp-2", title: "Louvre Museum", city: "Paris", country: "France", category: "Culture", rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80", description: "World's largest art museum and historic monument.", duration: 180, cost: 17 },
  { id: "exp-3", title: "Café de Flore", city: "Paris", country: "France", category: "Food", rating: 4.5, imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", description: "Legendary Parisian café on the Boulevard Saint-Germain.", duration: 60, cost: 20 },

  // Tokyo
  { id: "exp-4", title: "Senso-ji Temple", city: "Tokyo", country: "Japan", category: "Culture", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80", description: "Ancient Buddhist temple in Asakusa.", duration: 90, cost: 0 },
  { id: "exp-5", title: "Shibuya Crossing", city: "Tokyo", country: "Japan", category: "Sightseeing", rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&q=80", description: "World's busiest pedestrian crossing.", duration: 30, cost: 0 },
  { id: "exp-6", title: "Tsukiji Outer Market", city: "Tokyo", country: "Japan", category: "Food", rating: 4.6, imageUrl: "https://images.unsplash.com/photo-1611315764763-6a15f7441476?w=600&q=80", description: "Famous seafood market, perfect for sushi breakfast.", duration: 90, cost: 30 },

  // New York
  { id: "exp-7", title: "Central Park", city: "New York", country: "USA", category: "Adventure", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80", description: "Iconic urban park in the heart of Manhattan.", duration: 120, cost: 0 },
  { id: "exp-8", title: "MoMA", city: "New York", country: "USA", category: "Culture", rating: 4.6, imageUrl: "https://images.unsplash.com/photo-1510125594188-5a12f9ae3a7c?w=600&q=80", description: "World's premier modern art museum.", duration: 150, cost: 25 },
  { id: "exp-9", title: "Katz's Deli", city: "New York", country: "USA", category: "Food", rating: 4.5, imageUrl: "https://images.unsplash.com/photo-1619158401201-8fa95e0c0f01?w=600&q=80", description: "Legendary deli known for its pastrami sandwiches.", duration: 60, cost: 25 },

  // Bali
  { id: "exp-10", title: "Uluwatu Temple", city: "Bali", country: "Indonesia", category: "Culture", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", description: "Balinese sea temple perched on a cliff above the ocean.", duration: 90, cost: 10 },
  { id: "exp-11", title: "Tegalalang Rice Terrace", city: "Bali", country: "Indonesia", category: "Sightseeing", rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80", description: "Beautiful terraced rice fields north of Ubud.", duration: 60, cost: 5 },
  { id: "exp-12", title: "Surf Lesson at Kuta Beach", city: "Bali", country: "Indonesia", category: "Adventure", rating: 4.6, imageUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80", description: "Learn to surf on one of Bali's most famous beaches.", duration: 120, cost: 35 },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.toLowerCase() ?? "";
  const category = searchParams.get("category") ?? "All";
  const city = searchParams.get("city") ?? "";

  let results = MOCK_ACTIVITIES;

  if (query) {
    results = results.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.city.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
    );
  }

  if (category !== "All") {
    results = results.filter((a) => a.category === category);
  }

  if (city) {
    results = results.filter((a) => a.city.toLowerCase().includes(city.toLowerCase()));
  }

  return NextResponse.json(results);
}
