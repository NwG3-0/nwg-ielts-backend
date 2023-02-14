import mongoose from 'mongoose'

export type EarliestPostType = {
  User: mongoose.Schema.Types.ObjectId
  Posts: mongoose.Schema.Types.ObjectId[]
  CreatedAt: number
  UpdatedAt: number
}

const EarliestPostSchema = new mongoose.Schema(
  {
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    Posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
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
    collection: 'EarliestPost',
    versionKey: false,
  },
)

export const EarliestPostModel = mongoose.model<EarliestPostType>('EarliestPost', EarliestPostSchema)
