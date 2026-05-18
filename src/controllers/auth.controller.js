import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../prisma/client.js'
import { send } from '../utils/response.js'

export const signup = async (req, res) => {
  const { name, email, password } = req.body

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return send(res, 409, false, 'Email already registered', null)
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    })

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    return send(res, 201, true, 'Account created successfully', { token, user })
  } catch (err) {
    console.error('signup error:', err.message)
    return send(res, 500, false, 'Something went wrong', null)
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return send(res, 401, false, 'Invalid email or password', null)
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return send(res, 401, false, 'Invalid email or password', null)
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    const { password: _pw, ...safeUser } = user
    return send(res, 200, true, 'Login successful', { token, user: safeUser })
  } catch (err) {
    console.error('login error:', err.message)
    return send(res, 500, false, 'Something went wrong', null)
  }
}
