import mongoose from 'mongoose'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export type ResultTestType = {
  ResultTest: string
  Topic: string
  User: mongoose.Schema.Types.ObjectId
  CreatedAt: number
  UpdatedAt: number
}

const ResultTestSchema = new mongoose.Schema(
  {
    ResultTest: {
      type: String,
      require: true,
    },
    Topic: {
      type: String,
      require: true,
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
    collection: 'ResultTest',
  },
)

export const ResultTestModel = mongoose.model<ResultTestType>('ResultTest', ResultTestSchema)
