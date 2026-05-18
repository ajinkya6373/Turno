import { prisma } from '../prisma/client.js'
import { send } from '../utils/response.js'

export const getVehicles = async (req, res) => {
  const { brand, fuelType, minPrice, maxPrice } = req.query

  const where = {}

  if (brand) where.brand = brand
  if (fuelType) where.fuelType = fuelType
  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = parseFloat(minPrice)
    if (maxPrice) where.price.lte = parseFloat(maxPrice)
  }

  try {
    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })
    return send(res, 200, true, 'Vehicles fetched', vehicles)
  } catch (err) {
    console.error('getVehicles error:', err.message)
    return send(res, 500, false, 'Failed to fetch vehicles', null)
  }
}

export const getVehicleSummary = async (req, res) => {
  try {
    const byBrand = await prisma.vehicle.groupBy({
      by: ['brand'],
      _count: { id: true },
      orderBy: { brand: 'asc' }
    })

    const byFuelType = await prisma.vehicle.groupBy({
      by: ['fuelType'],
      _count: { id: true }
    })

    const summary = {
      byBrand: byBrand.map(b => ({ brand: b.brand, count: b._count.id })),
      byFuelType: byFuelType.map(f => ({ fuelType: f.fuelType, count: f._count.id }))
    }

    return send(res, 200, true, 'Summary fetched', summary)
  } catch (err) {
    console.error('getVehicleSummary error:', err.message)
    return send(res, 500, false, 'Failed to fetch summary', null)
  }
}

export const getVehicleById = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return send(res, 400, false, 'Invalid vehicle ID', null)
  }

  try {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } })
    if (!vehicle) {
      return send(res, 404, false, 'Vehicle not found', null)
    }
    return send(res, 200, true, 'Vehicle fetched', vehicle)
  } catch (err) {
    console.error('getVehicleById error:', err.message)
    return send(res, 500, false, 'Failed to fetch vehicle', null)
  }
}

export const addVehicle = async (req, res) => {
  const { brand, name, price, fuelType, description, imageUrl } = req.body

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        brand,
        name,
        price: parseFloat(price),
        fuelType,
        description: description || null,
        imageUrl: imageUrl || null
      }
    })
    return send(res, 201, true, 'Vehicle added', vehicle)
  } catch (err) {
    console.error('addVehicle error:', err.message)
    return send(res, 500, false, 'Failed to add vehicle', null)
  }
}
