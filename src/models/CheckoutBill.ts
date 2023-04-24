import mongoose from 'mongoose'

export type CheckoutBillType = {
  TransactionCode: string
  OrderCode: string
  Amount: string
  Currency: string
  UserId: mongoose.Schema.Types.ObjectId
  BankCode: string
  BankName: string
  Method: string
  MerchantFee: string
  GetCode: boolean
  CreatedAt: number
  UpdatedAt: number
}

const CheckoutBillSchema = new mongoose.Schema(
  {
    TransactionCode: {
      type: String,
      required: true,
    },
    OrderCode: {
      type: String,
      required: true,
    },
    Amount: {
      type: String,
      require: false,
    },
    Currency: {
      type: String,
      require: true,
    },
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    BankCode: {
      type: String,
      required: true,
    },
    BankName: {
      type: String,
      required: true,
    },
    Method: {
      type: String,
      required: true,
    },
    MerchantFee: {
      type: String,
      required: true,
    },
    GetCode: {
      type: Boolean,
      require: true,
    },
    CreatedAt: {
      type: Number,
      default: Math.floor(new Date().getTime() / 1000),
    },
    UpdatedAt: {
      type: Number,
      default: Math.floor(new Date().getTime() / 1000),
    },
  },
  {
    collection: 'CheckoutBill',
    versionKey: false,
  },
)

export const CheckoutBillModel = mongoose.model<CheckoutBillType>('CheckoutBill', CheckoutBillSchema)
