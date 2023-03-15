import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { client } from '..'

export const logoutMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers?.authorization
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1]
      if (token) {
        const result = await client.get(token)
        if (result === 'blacklisted') {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'JWT is expired' })
          return
        }
      }
    }

    // no token found -> this is authentication API
    return next()
  } catch (error) {
    console.error('[Verify JWT] Error: ', error)
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.UNAUTHORIZED) })
    return
  }
}
