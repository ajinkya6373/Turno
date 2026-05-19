import { prisma } from '../prisma/client.js'
import { send } from '../utils/response.js'

export const createBooking = async (req, res) => {
  const { vehicleId, customerName, customerEmail, bookingDate } = req.body

  const vid = parseInt(vehicleId)
  if (isNaN(vid)) {
    return send(res, 400, false, 'Invalid vehicleId', null)
  }

  try {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vid } })
    if (!vehicle) {
      return send(res, 404, false, 'Vehicle not found', null)
    }

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        vehicleId: vid,
        customerName,
        customerEmail,
        bookingDate: new Date(bookingDate)
      },
      include: { vehicle: true }
    })

    return send(res, 201, true, 'Booking created successfully', booking)
  } catch (err) {
    console.error('createBooking error:', err.message)
    return send(res, 500, false, 'Failed to create booking', null)
  }
}

export const getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: { vehicle: true },
      orderBy: { createdAt: 'desc' }
    })
    return send(res, 200, true, 'Bookings fetched', bookings)
  } catch (err) {
    console.error('getBookings error:', err.message)
    return send(res, 500, false, 'Failed to fetch bookings', null)
  }
}
