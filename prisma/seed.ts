import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd())

async function main() {
  const { prisma } = await import('../lib/prisma')
  
  console.log('Seeding database with India-specific travel data...')

  // Pre-hashed 'password123'
  const passwordHash = '$2b$10$EP/kRih.kC5x4W85w4y3IOfbLIdO4/f4q68V5rXg3PZqE4XjM28i2'

  // Create a user
  const user = await prisma.user.upsert({
    where: { email: 'indian.explorer@example.com' },
    update: {},
    create: {
      email: 'indian.explorer@example.com',
      name: 'Riya Sharma',
      passwordHash,
      languagePref: 'en',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    },
  })

  // Create Trips
  
  // Trip 1: Golden Triangle
  const trip1 = await prisma.trip.create({
    data: {
      title: 'Golden Triangle Tour',
      description: 'A classic journey through Delhi, Agra, and Jaipur exploring the rich heritage and culture.',
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-10-08'),
      coverPhoto: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80', // Taj Mahal
      isPublic: true,
      publicSlug: 'golden-triangle-' + Date.now(),
      totalBudget: 45000,
      userId: user.id,
      stops: {
        create: [
          {
            cityName: 'New Delhi',
            country: 'India',
            arrivalDate: new Date('2026-10-01'),
            departureDate: new Date('2026-10-03'),
            orderIndex: 0,
            activities: {
              create: [
                { title: 'Red Fort Visit', type: 'Sightseeing', cost: 500, duration: 180 },
                { title: 'Chandni Chowk Food Walk', type: 'Food', cost: 1500, duration: 120 },
              ]
            }
          },
          {
            cityName: 'Agra',
            country: 'India',
            arrivalDate: new Date('2026-10-03'),
            departureDate: new Date('2026-10-05'),
            orderIndex: 1,
            activities: {
              create: [
                { title: 'Taj Mahal Sunrise', type: 'Sightseeing', cost: 250, duration: 180 },
                { title: 'Agra Fort', type: 'Sightseeing', cost: 200, duration: 120 },
              ]
            }
          },
          {
            cityName: 'Jaipur',
            country: 'India',
            arrivalDate: new Date('2026-10-05'),
            departureDate: new Date('2026-10-08'),
            orderIndex: 2,
            activities: {
              create: [
                { title: 'Amer Fort', type: 'Sightseeing', cost: 500, duration: 240 },
                { title: 'Chokhi Dhani Traditional Dinner', type: 'Food', cost: 1200, duration: 180 },
              ]
            }
          }
        ]
      },
      expenses: {
        create: [
          { category: 'Transport', amount: 8000, description: 'Flights and Intercity Cabs' },
          { category: 'Stay', amount: 15000, description: 'Heritage Hotels' },
          { category: 'Activities', amount: 3650, description: 'Tickets and Tours' },
        ]
      },
      checklist: {
        create: [
          { content: 'Comfortable walking shoes', category: 'Clothing', isPacked: true },
          { content: 'Camera with extra batteries', category: 'Electronics', isPacked: true },
          { content: 'Sunscreen and sunglasses', category: 'Health', isPacked: false },
        ]
      }
    }
  })

  // Trip 2: Kerala Backwaters
  const trip2 = await prisma.trip.create({
    data: {
      title: 'Kerala Backwaters Retreat',
      description: 'Relaxing amidst the lush greenery and serene backwaters of God\'s Own Country.',
      startDate: new Date('2026-12-10'),
      endDate: new Date('2026-12-15'),
      coverPhoto: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80', // Kerala
      isPublic: true,
      publicSlug: 'kerala-retreat-' + Date.now(),
      totalBudget: 35000,
      userId: user.id,
      stops: {
        create: [
          {
            cityName: 'Kochi',
            country: 'India',
            arrivalDate: new Date('2026-12-10'),
            departureDate: new Date('2026-12-12'),
            orderIndex: 0,
            activities: {
              create: [
                { title: 'Fort Kochi Walking Tour', type: 'Culture', cost: 300, duration: 150 },
                { title: 'Kathakali Performance', type: 'Culture', cost: 800, duration: 120 },
              ]
            }
          },
          {
            cityName: 'Alleppey',
            country: 'India',
            arrivalDate: new Date('2026-12-12'),
            departureDate: new Date('2026-12-15'),
            orderIndex: 1,
            activities: {
              create: [
                { title: 'Houseboat Stay', type: 'Accommodation', cost: 12000, duration: 1440 },
                { title: 'Ayurvedic Massage', type: 'Health', cost: 2500, duration: 90 },
              ]
            }
          }
        ]
      },
      expenses: {
        create: [
          { category: 'Stay', amount: 16000, description: 'Houseboat and Hotel' },
          { category: 'Food', amount: 5000, description: 'Seafood and local cuisine' },
        ]
      }
    }
  })

  // Trip 3: Goan Getaway
  const trip3 = await prisma.trip.create({
    data: {
      title: 'Goan Beach Getaway',
      description: 'Sun, sand, and seafood in North and South Goa.',
      startDate: new Date('2026-11-05'),
      endDate: new Date('2026-11-10'),
      coverPhoto: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80', // Goa Beach
      isPublic: true,
      publicSlug: 'goa-getaway-' + Date.now(),
      totalBudget: 28000,
      userId: user.id,
      stops: {
        create: [
          {
            cityName: 'North Goa',
            country: 'India',
            arrivalDate: new Date('2026-11-05'),
            departureDate: new Date('2026-11-08'),
            orderIndex: 0,
            activities: {
              create: [
                { title: 'Baga Beach Watersports', type: 'Adventure', cost: 2000, duration: 180 },
                { title: 'Anjuna Flea Market', type: 'Shopping', cost: 500, duration: 120 },
              ]
            }
          },
          {
            cityName: 'South Goa',
            country: 'India',
            arrivalDate: new Date('2026-11-08'),
            departureDate: new Date('2026-11-10'),
            orderIndex: 1,
            activities: {
              create: [
                { title: 'Palolem Beach Relaxation', type: 'Sightseeing', cost: 0, duration: 240 },
                { title: 'Dudhsagar Waterfalls Trip', type: 'Adventure', cost: 1500, duration: 360 },
              ]
            }
          }
        ]
      }
    }
  })

  console.log('Seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
