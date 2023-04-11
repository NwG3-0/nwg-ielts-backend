import mongoose from 'mongoose'

export type AdminType = {
  Email: string
  Hobbies: string
  HashedPassword: string
  CreatedAt: number
  UpdatedAt: number
  DeleteAt: number
  OtpCode: number
  IsActivated: boolean
  Role: number
}

const AdminSchema = new mongoose.Schema(
  {
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    HashedPassword: {
      type: String,
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
    collection: 'Admin',
    versionKey: false,
  },
)

export const AdminModel = mongoose.model<AdminType>('Admin', AdminSchema)
