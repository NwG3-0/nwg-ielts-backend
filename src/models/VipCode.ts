import mongoose from 'mongoose'

export type VipCodeType = {
  Code: string
  User: mongoose.Schema.Types.ObjectId
  CreatedAt: number
  UpdatedAt: number
}

const VipCodeSchema = new mongoose.Schema(
  {
    Code: {
      type: String,
      required: true,
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    collection: 'VipCode',
    versionKey: false,
  },
)

export const VipCodeModel = mongoose.model<VipCodeType>('VipCode', VipCodeSchema)
