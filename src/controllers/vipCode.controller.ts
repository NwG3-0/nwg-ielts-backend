import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { CheckoutBillModel } from '../models/CheckoutBill'
import { VipCodeDataResponse } from '../types/vipCode'
import { generateRedeemCode } from '../utils/common'
import { sendRedeemCode } from '../utils/mail'
import { VipCodeModel } from '../models/VipCode'
import { UserModel } from '../models/User'
import { ROLE } from '../types/role'

export const sendCode = async (req, res, next) => {
  try {
    const { billId, userId, email } = req.body

    if (!billId && billId === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Bill' })
      return
    }

    if (!email && email === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Email' })
      return
    }

    const transaction = (await CheckoutBillModel.findOne({
      TransactionCode: billId,
    })) as VipCodeDataResponse

    if (!transaction) {
      res.status(StatusCodes.OK).json({ success: false, data: null, message: 'This Bill had not exist' })

      return
    }

    if (transaction && transaction.GetCode) {
      res.status(StatusCodes.OK).json({ success: false, data: null, message: 'This Bill have been used' })

      return
    } else {
      const vipCode = generateRedeemCode() as string

      const addCode = await VipCodeModel.create({
        Code: vipCode,
        User: userId,
      })

      if (addCode) {
        if (!sendRedeemCode(email, vipCode)) {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You send email failed' })

          return
        }

        res
          .status(StatusCodes.OK)
          .json({ success: false, data: null, message: 'You send email successfully! Please check your email' })
      } else {
        res
          .status(StatusCodes.OK)
          .json({ success: false, data: null, message: 'You send email successfully! Please check your email' })
      }
    }
  } catch (error) {
    console.log('[send code] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })

    return next(error)
  }
}

export const activeUser = async (req, res, next) => {
  try {
    const { code, userId } = req.body

    if (!code && code === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Email' })
      return
    }

    const deleteVipCode = await VipCodeModel.findOneAndDelete({
      Code: code,
      User: userId,
    })

    if (deleteVipCode) {
      await UserModel.findByIdAndUpdate(userId, {
        Role: ROLE.VIP_MEMBER,
      })

      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Welcome to be a Vip Member' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Code' })
    }
  } catch (error) {
    console.log('[active user] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })

    return next(error)
  }
}
