import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const vehicles = [
  {
    brand: 'Toyota',
    name: 'Camry 2024',
    price: 26000,
    fuelType: 'Petrol',
    description: 'Reliable mid-size sedan with great fuel economy and a smooth ride.',
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800'
  },
  {
    brand: 'Toyota',
    name: 'Corolla Cross',
    price: 23000,
    fuelType: 'Petrol',
    description: 'Compact crossover with Toyota safety features and a spacious interior.',
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800'
  },
  {
    brand: 'Toyota',
    name: 'Fortuner Legend',
    price: 42000,
    fuelType: 'Diesel',
    description: 'Rugged 7-seater SUV built for off-road adventures and family comfort.',
    imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800'
  },
  {
    brand: 'Honda',
    name: 'Civic Type R',
    price: 35000,
    fuelType: 'Petrol',
    description: 'High-performance hatchback with a turbocharged engine and sport tuning.',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'
  },
  {
    brand: 'Honda',
    name: 'City Hatchback',
    price: 17500,
    fuelType: 'Petrol',
    description: 'Smart urban car with a fuel-efficient engine and premium interior.',
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800'
  },
  {
    brand: 'Honda',
    name: 'CR-V e:HEV',
    price: 34000,
    fuelType: 'Petrol',
    description: 'Hybrid crossover with excellent efficiency and Honda Sensing safety suite.',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800'
  },
  {
    brand: 'Tesla',
    name: 'Model 3 RWD',
    price: 40990,
    fuelType: 'Electric',
    description: 'Entry-level Tesla with 358 km range, autopilot, and OTA updates.',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'
  },
  {
    brand: 'Tesla',
    name: 'Model Y Long Range',
    price: 57990,
    fuelType: 'Electric',
    description: 'Best-selling EV globally. Dual motor, 533 km range, and massive cargo space.',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'
  },
  {
    brand: 'Tesla',
    name: 'Model S Plaid',
    price: 108990,
    fuelType: 'Electric',
    description: 'Flagship sedan with 1,020 hp, 0–100 km/h in under 2 seconds.',
    imageUrl: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800'
  },
  {
    brand: 'Ford',
    name: 'Mustang GT',
    price: 47000,
    fuelType: 'Petrol',
    description: 'Iconic American muscle with a 5.0L V8 and classic pony car styling.',
    imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'
  },
  {
    brand: 'Ford',
    name: 'Explorer XLT',
    price: 38500,
    fuelType: 'Petrol',
    description: 'Full-size 7-seater SUV with Ford Co-Pilot360 driver assist tech.',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'
  },
  {
    brand: 'Ford',
    name: 'Ranger Wildtrak',
    price: 33000,
    fuelType: 'Diesel',
    description: 'Lifestyle pickup truck with a 2.0L bi-turbo diesel and terrain management.',
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800'
  },
  {
    brand: 'Hyundai',
    name: 'i20 N Line',
    price: 14000,
    fuelType: 'Petrol',
    description: 'Sporty compact hatchback with N Line styling and a punchy 1.0L turbo engine.',
    imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800'
  },
  {
    brand: 'Hyundai',
    name: 'Creta 2024',
    price: 22000,
    fuelType: 'Diesel',
    description: 'Feature-loaded compact SUV with panoramic sunroof and BlueLink connectivity.',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'
  },
  {
    brand: 'Hyundai',
    name: 'IONIQ 5 AWD',
    price: 56000,
    fuelType: 'Electric',
    description: 'Award-winning EV with 800V architecture and ultra-fast 18-minute charging.',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800'
  }
]

async function main() {
  console.log('Seeding database...')

  const adminPass = await bcrypt.hash('admin123', 10)
  const userPass = await bcrypt.hash('user123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@turno.com' },
    update: {},
    create: {
      name: 'Turno Admin',
      email: 'admin@turno.com',
      password: adminPass,
      role: 'ADMIN'
    }
  })

  const user = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      password: userPass,
      role: 'USER'
    }
  })

  console.log(`Created users: ${admin.email}, ${user.email}`)

  for (const v of vehicles) {
    await prisma.vehicle.create({ data: v })
  }

  console.log(`Seeded ${vehicles.length} vehicles`)
  console.log('Done!')
}

main()
  .catch(err => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
