import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { LearningVideoModel } from '../models/LearningVideo'

const DEFAULT_START_PAGE = 1
const DEFAULT_ITEM_PER_PAGE = 10

dayjs.extend(utc)

export const getLearningVideo = async (req, res) => {
  const queryString = req.query

  const startPage = Number((queryString.page || DEFAULT_START_PAGE) - 1)
  const limit = Number(queryString.limit || DEFAULT_ITEM_PER_PAGE)
  const keyword = queryString.keyword || ''
  let startDate = queryString.startDate
  let endDate = queryString.endDate

  if (startPage < 0) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid start page option' })
    return
  }

  if (Number.isNaN(limit)) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid limit option' })
    return
  }

  if (typeof startDate === 'undefined' || typeof endDate === 'undefined') {
    startDate = startDate ?? dayjs.utc().subtract(2, 'months').startOf('month').unix()
    endDate = endDate ?? dayjs.utc().endOf('month').unix()
  }

  try {
    const totalRecords = await LearningVideoModel.countDocuments({
      CreatedAt: { $gte: Number(startDate), $lte: Number(endDate) },
      Title: { $regex: keyword },
    })

    const totalPages = Math.ceil(totalRecords / limit)

    const news = await LearningVideoModel.find(
      {
        CreatedAt: { $gte: Number(startDate), $lte: Number(endDate) },
      },
      null,
      { skip: startPage * limit, limit },
    )
      .sort({ CreatedAt: -1 })
      .lean()
      .transform((docs) =>
        docs.map((doc) => ({
          id: doc._id,
          title: doc.Title,
          image: doc.Image,
          subtitles: doc.SubTitles,
          like: doc.Like,
          view: doc.View,
          day: doc.CreatedAt,
        })),
      )

    if (news) {
      res.status(StatusCodes.OK).json({
        success: true,
        data: news,
        pagination: { startPage: startPage + 1, limit: Number(limit), totalPages, totalRecords },
      })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: null })
    }
  } catch (error) {
    console.log('[post] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const create = async (req, res, next) => {
  try {
    const { title, type, link, subtitles, image } = req.body

    console.log({ title, type, link, subtitles, image })
    if (!title || title === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Title is required' })

      return
    }

    if (!image || image === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Image is required' })

      return
    }

    if (!subtitles || subtitles === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Image is required' })

      return
    }

    if (!type || type === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Image is required' })

      return
    }

    if (!link || link === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Image is required' })

      return
    }

    const currentTimestamp = dayjs.utc().unix()

    const response = await LearningVideoModel.create({
      Title: title,
      Image: image,
      Link: link,
      SubTitles: subtitles,
      View: 0,
      Like: 0,
      Type: type,
      CreatedAt: currentTimestamp,
      UpdatedAt: currentTimestamp,
    })

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You create news successfully' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You create news fail' })
    }
  } catch (error) {
    console.log('[create post] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
