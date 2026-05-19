import { prisma } from '../prisma/client.js'
import { send } from '../utils/response.js'

export const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      include: { vehicle: true },
      orderBy: { createdAt: 'desc' }
    })
    return send(res, 200, true, 'Bookmarks fetched', bookmarks)
  } catch (err) {
    console.error('getBookmarks error:', err.message)
    return send(res, 500, false, 'Failed to fetch bookmarks', null)
  }
}

export const addBookmark = async (req, res) => {
  const vehicleId = parseInt(req.body.vehicleId)

  if (isNaN(vehicleId)) {
    return send(res, 400, false, 'Invalid vehicleId', null)
  }

  try {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } })
    if (!vehicle) {
      return send(res, 404, false, 'Vehicle not found', null)
    }

    const bookmark = await prisma.bookmark.create({
      data: { userId: req.user.id, vehicleId },
      include: { vehicle: true }
    })

    return send(res, 201, true, 'Vehicle bookmarked', bookmark)
  } catch (err) {
    // P2002 = unique constraint violation
    if (err.code === 'P2002') {
      return send(res, 409, false, 'Vehicle already bookmarked', null)
    }
    console.error('addBookmark error:', err.message)
    return send(res, 500, false, 'Failed to bookmark vehicle', null)
  }
}

export const removeBookmark = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return send(res, 400, false, 'Invalid bookmark ID', null)
  }

  try {
    const bookmark = await prisma.bookmark.findUnique({ where: { id } })

    if (!bookmark) {
      return send(res, 404, false, 'Bookmark not found', null)
    }

    if (bookmark.userId !== req.user.id) {
      return send(res, 403, false, 'You can only remove your own bookmarks', null)
    }

    await prisma.bookmark.delete({ where: { id } })
    return send(res, 200, true, 'Bookmark removed', null)
  } catch (err) {
    console.error('removeBookmark error:', err.message)
    return send(res, 500, false, 'Failed to remove bookmark', null)
  }
}
