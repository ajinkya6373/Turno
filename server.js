import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './src/routes/auth.routes.js'
import vehicleRoutes from './src/routes/vehicle.routes.js'
import bookmarkRoutes from './src/routes/bookmark.routes.js'
import bookingRoutes from './src/routes/booking.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    // allow requests with no origin (mobile, postman, curl)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json())

app.use((req, res, next) => {
  const date = new Date();
  console.log(`> {request} : ${req.method} ;  {path}: ${req.path} ;  {time}: ${date.toLocaleString()} ; {ip}: ${req.ip}`);
  next()
  return
})

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Turno Vehicle Store API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/bookmarks', bookmarkRoutes)
app.use('/api/bookings', bookingRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', data: null })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: 'Internal server error', data: null })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
