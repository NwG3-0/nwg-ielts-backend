import mongoose from 'mongoose'
import { NEWS } from '../types/news'

export type LeaningVideosType = {
  Title: string
  Image: string
  Like: number
  Link: string
  SubTitles: string
  View: number
  Type: NEWS
  CreatedAt: number
  UpdatedAt: number
}

const LearningVideoSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Image: {
      type: String,
      required: true,
    },
    SubTitles: {
      type: String,
      required: true,
    },
    Link: {
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
    collection: 'LearningVideo',
    versionKey: false,
  },
)

export const LearningVideoModel = mongoose.model<LeaningVideosType>('LearningVideo', LearningVideoSchema)
