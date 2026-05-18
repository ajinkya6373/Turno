import jwt from 'jsonwebtoken'
import { send } from '../utils/response.js'

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return send(res, 401, false, 'No token provided', null)
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return send(res, 401, false, 'Invalid or expired token', null)
  }
}

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return send(res, 403, false, 'Admin access required', null)
  }
  next()
}
