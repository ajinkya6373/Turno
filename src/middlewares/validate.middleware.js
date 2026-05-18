import { validationResult } from 'express-validator'
import { send } from '../utils/response.js'

export const runValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return send(res, 400, false, errors.array()[0].msg, null)
  }
  next()
}
