import { Router } from 'express'
import { body } from 'express-validator'
import { getBookmarks, addBookmark, removeBookmark } from '../controllers/bookmark.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { runValidation } from '../middlewares/validate.middleware.js'

const router = Router()

// all bookmark routes require auth
router.use(protect)

router.get('/', getBookmarks)

router.post(
  '/',
  [body('vehicleId').notEmpty().withMessage('vehicleId is required')],
  runValidation,
  addBookmark
)

router.delete('/:id', removeBookmark)

export default router
