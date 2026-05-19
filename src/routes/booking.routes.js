import { Router } from 'express'
import { body } from 'express-validator'
import { createBooking, getBookings } from '../controllers/booking.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { runValidation } from '../middlewares/validate.middleware.js'

const router = Router()

router.use(protect)

router.get('/', getBookings)

router.post(
  '/',
  [
    body('vehicleId').notEmpty().withMessage('vehicleId is required'),
    body('customerName').notEmpty().withMessage('Customer name is required'),
    body('customerEmail').isEmail().withMessage('Valid customer email is required'),
    body('bookingDate').isISO8601().withMessage('bookingDate must be a valid ISO date (YYYY-MM-DD)')
  ],
  runValidation,
  createBooking
)

export default router
