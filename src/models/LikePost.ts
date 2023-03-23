import mongoose from 'mongoose'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export type LikePostType = {
  News: mongoose.Schema.Types.ObjectId
  User: mongoose.Schema.Types.ObjectId
  CreatedAt: number
  UpdatedAt: number
}

const LikePostSchema = new mongoose.Schema(
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
    collection: 'LikePost',
  },
)

export const LikePostModel = mongoose.model<LikePostType>('LikePost', LikePostSchema)
