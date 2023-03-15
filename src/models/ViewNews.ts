import mongoose from 'mongoose'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export type ViewNewsType = {
  News: mongoose.Schema.Types.ObjectId
  User: mongoose.Schema.Types.ObjectId
  CreatedAt: number
  UpdatedAt: number
}

const ViewNewsSchema = new mongoose.Schema(
  {
    News: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'News',
      required: true,
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    CreatedAt: {
      type: Number,
      default: dayjs.utc().unix(),
    },
    UpdatedAt: {
      type: Number,
      default: dayjs.utc().unix(),
    },
  },
  {
    collection: 'ViewNews',
  },
)

export const ViewNewsModel = mongoose.model<ViewNewsType>('ViewNews', ViewNewsSchema)
