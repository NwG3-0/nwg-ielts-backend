import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { CheckoutBillModel } from '../models/CheckoutBill'

dayjs.extend(utc)

export const createCheckoutBill = async (req, res, next) => {
  try {
    const { transactionCode, orderCode, amount, currency, userId, bankCode, bankName, method, merchantFee } = req.body

    if (!transactionCode && transactionCode === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Transaction Code' })
      return
    }

    if (!orderCode && orderCode === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Order Code' })
      return
    }

    if (!amount && amount === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Amount' })
      return
    }

    if (!currency && currency === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Currency' })
      return
    }

    if (!userId && userId === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid User Id' })
      return
    }

    if (!bankCode && bankCode === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Bank Code' })
      return
    }

    if (!bankName && bankName === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Bank Name' })
      return
    }

    if (!method && method === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Method' })
      return
    }

    if (!merchantFee && merchantFee === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Merchant Fee' })
      return
    }

    const currentTimestamp = dayjs.utc().unix()

    const response = await CheckoutBillModel.create({
      TransactionCode: transactionCode,
      OrderCode: orderCode,
      Amount: amount,
      Currency: currency,
      UserId: userId,
      BankCode: bankCode,
      BankName: bankName,
      Method: method,
      MerchantFee: merchantFee,
      GetCode: false,
      CreatedAt: currentTimestamp,
      UpdatedAt: currentTimestamp,
    })

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You create checkout bill successfully' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You create checkout bill fail' })
    }
  } catch (error) {
    console.log('[create checkout bill] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })

    return next(error)
  }
}
