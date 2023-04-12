import mongoose from 'mongoose'

export type SubtitleType = {
  Text: string
  Start: number
  LearningVideo: mongoose.Schema.Types.ObjectId
  Duration: number
  Translate: string
  CreatedAt: number
  UpdatedAt: number
}

const SubtitleSchema = new mongoose.Schema(
  {
    Text: {
      type: String,
      required: true,
    },
    Start: {
      type: Number,
      required: true,
    },
    LearningVideo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningVideo',
      required: true,
    },
    Duration: {
      type: String,
      required: true,
    },
    Translate: {
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
    collection: 'Subtitle',
    versionKey: false,
  },
)

export const SubtitleModel = mongoose.model<SubtitleType>('Subtitle', SubtitleSchema)
