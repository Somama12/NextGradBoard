import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Database...')
  const companies = ['Google', 'Meta', 'Amazon', 'Netflix', 'Apple', 'Microsoft', 'Stripe', 'Airbnb', 'Uber', 'Lyft']
  const roles = ['Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'Fullstack Engineer', 'Data Scientist', 'Product Manager']
  const locations = ['San Francisco, CA', 'New York, NY', 'Remote', 'Seattle, WA', 'Austin, TX', 'London, UK']
  const categories = ['Internship', 'New Grad']
  const sponsorshipOptions = ['Available', 'Unavailable', 'Unknown']

  // Clean existing listings
  await prisma.listing.deleteMany()

  // Generate 45 dummy listings
  for (let i = 0; i < 45; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)]
    const role = roles[Math.floor(Math.random() * roles.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const sponsorship = sponsorshipOptions[Math.floor(Math.random() * sponsorshipOptions.length)]
    
    // Spread postings across the last 30 days
    const datePosted = new Date()
    datePosted.setDate(datePosted.getDate() - Math.floor(Math.random() * 30))

    await prisma.listing.create({
      data: {
        company,
        title: `${category === 'New Grad' ? '2027 New Grad' : 'Summer 2027'} - ${role}`,
        location,
        category,
        sponsorship,
        url: `https://example.com/jobs/${company.toLowerCase().replace(' ', '-')}-${i}`,
        datePosted,
        isActive: true,
      },
    })
  }
  
  console.log('Database successfully seeded with 45 dummy listings.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
