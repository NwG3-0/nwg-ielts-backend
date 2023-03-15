import mongoose from 'mongoose'
import { DEVICES } from '../utils/common'
import { NEWS } from '../types/news'

export type NewsType = {
  Title: string
  Image: string
  Content: string
  Like: number
  View: number
  Type: NEWS
  Device: typeof DEVICES
  CreatedAt: number
  UpdatedAt: number
}

const NewsSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Image: {
      type: String,
      required: true,
    },
    Type: {
      type: String,
      required: true,
    },
    Like: {
      type: Number,
      required: true,
    },
    View: {
      type: Number,
      required: true,
    },
    Content: {
      type: String,
      required: true,
    },
    Device: {
      type: String,
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
    collection: 'News',
    versionKey: false,
  },
)

export const NewsModel = mongoose.model<NewsType>('News', NewsSchema)
