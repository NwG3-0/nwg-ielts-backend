import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import jsonwebtoken, { TokenExpiredError } from 'jsonwebtoken'
import { client } from '..'

export const adminMiddleWare = (req, res, next) => {
  try {
    const authorizationHeader = req.headers?.authorization
    if (!authorizationHeader || authorizationHeader === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Underfined Authorization' })
      throw new Error('Underfined Authorization')
    }

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1]
      if (token) {
        jsonwebtoken.verify(token, process.env.JWT_SECRET_ADMIN_KEY as string, function (err, _decoded) {
          if (err) {
            if (err.name === TokenExpiredError.name) {
              res.status(StatusCodes.BAD_REQUEST).json({ success: false, result: null, message: err.message })

              throw new Error(err.message)
            } else {
              res.status(StatusCodes.BAD_REQUEST).json({ success: false, result: null, message: err.message })

              throw new Error(err.message)
            }
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

export const privateMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers?.authorization

    if (!authorizationHeader || authorizationHeader === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Underfined Authorization' })
      return
    }

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1]
      if (token) {
        const result = await client.get(token)
        if (result === 'blacklisted') {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'JWT is expired' })
          return
        }

        jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY as string, function (err, decoded) {
          if (err) {
            if (err.name === TokenExpiredError.name) {
              res.status(StatusCodes.BAD_REQUEST).json({ success: false, result: null, message: err.message })
            } else {
              res.status(StatusCodes.BAD_REQUEST).json({ success: false, result: null, message: err.message })
            }
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

export const vipMemberMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers?.authorization

    if (!authorizationHeader || authorizationHeader === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Underfined Authorization' })
      return
    }

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1]
      if (token) {
        const result = await client.get(token)
        if (result === 'blacklisted') {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'JWT is expired' })
          return
        }

        jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY as string, function (err, decoded) {
          if (err) {
            if (err.name === TokenExpiredError.name) {
              res.status(StatusCodes.BAD_REQUEST).json({ success: false, result: null, message: err.message })
            } else {
              res.status(StatusCodes.BAD_REQUEST).json({ success: false, result: null, message: err.message })
            }
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
