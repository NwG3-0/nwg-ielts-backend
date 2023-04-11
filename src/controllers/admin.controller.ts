import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import bcrypt from 'bcryptjs'
import { AdminModel } from '../models/Admin'
import jwt from 'jsonwebtoken'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'

dayjs.extend(utc)
const ONE_DAY_IN_SECOND = 86400

// User Register
export const register = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(StatusCodes.NOT_FOUND).json({ success: false, data: null, message: 'Email & password are required' })

      return
    }

    const existEmail = await AdminModel.findOne({ Email: email })
    if (existEmail) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, data: null, message: 'Manager email has already existed' })

      return
    }

    const hashedPassword = await bcrypt.hash(password, Number(process.env.AUTH_SALT_VALUE))

    const currentTimestamp = dayjs.utc().unix()
    const userInfo = await AdminModel.create({
      Email: email.toLowerCase(),
      HashedPassword: hashedPassword,
      CreatedAt: currentTimestamp,
      UpdatedAt: currentTimestamp,
    })

    res.status(StatusCodes.OK).json({
      success: true,
      data: { id: userInfo._id, email, role: userInfo.Role },
    })
  } catch (error) {
    console.log('[register] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(StatusCodes.NOT_FOUND).json({ success: false, data: null, message: 'Email & password are required' })

      return
    }

    const userInfo = await AdminModel.findOne({ Email: email })

    if (!userInfo) {
      res.status(StatusCodes.NOT_FOUND).json({ success: false, data: null, message: 'Invalid login attempt' })

      return
    }

    const isValidManagerPassword = bcrypt.compareSync(password, userInfo.HashedPassword)

    if (!isValidManagerPassword) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid login attempt' })

      return
    }

    const jwtToken = jwt.sign(
      { manager_id: userInfo._id, email, hobbies: userInfo.Hobbies, role: userInfo.Role },
      process.env.JWT_SECRET_ADMIN_KEY ?? '',
      {
        expiresIn: Number(process.env.JWT_EXPIRATION_DURATION ?? ONE_DAY_IN_SECOND),
      },
    )

    res.status(StatusCodes.OK).json({ success: true, data: { id: userInfo._id, email, token: jwtToken } })
  } catch (error) {
    console.log('[login] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
