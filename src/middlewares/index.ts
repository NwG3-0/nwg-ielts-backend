import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'

export const adminMiddleWare = (req, res, next) => {
  try {
    const authorizationHeader = req.headers?.authorization
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1]
      if (token) {
        jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY as string, function (err, decoded) {
          if (err) throw err

          if (!decoded.IsRole === false) {
            res
              .status(StatusCodes.BAD_REQUEST)
              .json({ success: false, data: null, message: 'This is not admin account' })
          }
        })
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
