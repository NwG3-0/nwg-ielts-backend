import mongoose from 'mongoose'
import { DEVICES } from '../utils/common'

export type PostType = {
  Title: string
  ImageTitle: string
  Description: string
  Device: typeof DEVICES
  CreatedAt: number
  UpdatedAt: number
}

const PostSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    ImageTitle: {
      type: String,
      required: true,
    },
    Description: {
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
    collection: 'Post',
    versionKey: false,
  },
)

export const PostModel = mongoose.model<PostType>('Post', PostSchema)
