import mongoose from 'mongoose'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export type LikeNewsType = {
  News: mongoose.Schema.Types.ObjectId
  User: mongoose.Schema.Types.ObjectId
  CreatedAt: number
  UpdatedAt: number
}

const LikeNewsSchema = new mongoose.Schema(
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
    collection: 'LikeNews',
  },
)

export const LikeNewsModel = mongoose.model<LikeNewsType>('LikeNews', LikeNewsSchema)
