import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { SubtitleModel } from '../models/Subtitle'

dayjs.extend(utc)

export const getSubtitleByVideo = async (req, res, next) => {
  try {
    const { learning_video_id } = req.query

    if (!learning_video_id) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Learning Video Id' })
      return
    }

    const subtitles = await SubtitleModel.find(
      {
        LearningVideo: learning_video_id,
      },
      null,
      {},
    )
      .lean()
      .transform((docs) =>
        docs.map((doc) => ({
          id: doc._id,
          text: doc.Text,
          start: doc.Start,
          duration: doc.Duration,
          translate: doc.Translate,
          day: doc.CreatedAt,
        })),
      )

    if (subtitles) {
      res.status(StatusCodes.OK).json({
        success: true,
        data: subtitles,
      })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: null })
    }
  } catch (error) {
    console.log('[post] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })

    return next
  }
}

export const addSubtitle = async (req, res, _next) => {
  try {
    const { text, start, translate, duration, learning_video_id } = req.body

    if (!learning_video_id) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Learning Video Id' })
      return
    }

    if (!text) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Text' })
      return
    }

    if (!start) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Start Time' })
      return
    }

    if (!translate) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Translate' })
      return
    }

    if (!duration) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Duration' })
      return
    }

    const currentTimestamp = dayjs.utc().unix()

    const response = await SubtitleModel.create({
      Text: text,
      Start: start,
      Duration: duration,
      Translate: translate,
      LearningVideo: learning_video_id,
      CreatedAt: currentTimestamp,
      UpdatedAt: currentTimestamp,
    })

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You create subtitle successfully' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You create subtitle fail' })
    }
  } catch (error) {
    console.log('[post] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
