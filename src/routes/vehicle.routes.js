import { Router } from 'express'
import { body } from 'express-validator'
import {
  getVehicles,
  getVehicleSummary,
  getVehicleById,
  addVehicle
} from '../controllers/vehicle.controller.js'
import { protect, adminOnly } from '../middlewares/auth.middleware.js'
import { runValidation } from '../middlewares/validate.middleware.js'

const router = Router()

// public routes
router.get('/', getVehicles)
router.get('/summary', getVehicleSummary)
router.get('/:id', getVehicleById)

// admin only
router.post(
  '/',
  protect,
  adminOnly,
  [
    body('brand').notEmpty().withMessage('Brand is required'),
    body('name').notEmpty().withMessage('Vehicle name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('fuelType')
      .isIn(['Petrol', 'Diesel', 'Electric'])
      .withMessage('Fuel type must be Petrol, Diesel, or Electric')
  ],
  runValidation,
  addVehicle
)

export default router
