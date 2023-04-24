import mongoose from 'mongoose'

export interface VipCodeDataResponse {
  _id: mongoose.Schema.Types.ObjectId
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
