import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import { NewsModel } from '../models/News'

dayjs.extend(utc)

const DEFAULT_START_PAGE = 1
const DEFAULT_ITEM_PER_PAGE = 10

export const index = async (req, res) => {
  const queryString = req.query

  const startPage = Number((queryString.page || DEFAULT_START_PAGE) - 1)
  const limit = Number(queryString.limit || DEFAULT_ITEM_PER_PAGE)
  const keyword = queryString.keyword || ''
  const device = queryString.device || 'web'
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
    startDate = startDate ?? dayjs.utc().startOf('month').unix()
    endDate = endDate ?? dayjs.utc().endOf('month').unix()
  }

  try {
    const totalRecords = await NewsModel.countDocuments({
      CreatedAt: { $gte: Number(startDate), $lte: Number(endDate) },
      Device: device,
    })

    const totalPages = Math.ceil(totalRecords / limit)

    const news = await NewsModel.find(
      {
        CreatedAt: { $gte: Number(startDate), $lte: Number(endDate) },
        Title: { $regex: keyword },
        Device: device,
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
          content: doc.Content,
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

export const create = async (req, res) => {
  try {
    const { title, type, image, content, device } = req.body

    if (!title || title === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Title is required' })

      return
    }

    if (!image || image === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Image is required' })

      return
    }

    if (!content || content === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Image Title is required' })

      return
    }

    const currentTimestamp = dayjs.utc().unix()

    const response = await NewsModel.create({
      Title: title,
      Image: image,
      Content: content,
      Device: device,
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

export const deleteNews = async (req, res) => {
  try {
    const { news_id } = req.body

    if (!news_id) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'News ID is required' })

      return
    }

    const response = await NewsModel.findByIdAndDelete(news_id).catch(() => {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You delete the news fail' })
    })

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You delete the news successfully' })
    }
  } catch (error) {
    console.log('[create news] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const detailNews = (req, res) => {
  try {
    const { news_id } = req.query

    NewsModel.findById(news_id, function (err, docs) {
      if (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Can find this news' })
      } else {
        res.status(StatusCodes.OK).json({ success: false, data: docs, message: '' })
      }
    })
  } catch (error) {
    console.log('[detail news] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const updateNews = async (req, res) => {
  try {
    const { title, image, content, news_id } = req.body

    if (!title || title === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Title is required' })

      return
    }

    if (!image || image === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Image Title is required' })

      return
    }

    if (!content || content === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Image Title is required' })

      return
    }

    if (!news_id) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'News ID is required' })

      return
    }

    const currentTimestamp = dayjs.utc().unix()

    NewsModel.findByIdAndUpdate(news_id, {
      Title: title,
      Image: image,
      Content: content,
      UpdatedAt: currentTimestamp,
    }).catch(() => {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You update the news fail' })
    })

    res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You update the news successful' })
  } catch (error) {
    console.log('[update news] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const getNewsByType = async (req, res, next) => {
  const queryString = req.query

  const startPage = Number((queryString.page || DEFAULT_START_PAGE) - 1)
  const limit = Number(queryString.limit || DEFAULT_ITEM_PER_PAGE)
  const keyword = queryString.keyword || ''
  const device = queryString.device || 'web'
  const types = queryString.type
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
    startDate = startDate ?? dayjs.utc().startOf('month').unix()
    endDate = endDate ?? dayjs.utc().endOf('month').unix()
  }

  const typesArray = types.split(',')

  try {
    const totalRecords = await NewsModel.countDocuments({
      CreatedAt: { $gte: Number(startDate), $lte: Number(endDate) },
      Device: device,
      $and: typesArray.map((type) => ({
        Type: type,
      })),
    })

    const totalPages = Math.ceil(totalRecords / limit)

    const news = await NewsModel.find(
      {
        CreatedAt: { $gte: Number(startDate), $lte: Number(endDate) },
        Title: { $regex: keyword },
        Device: device,
        $and: typesArray.map((type) => ({
          Type: type,
        })),
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
          content: doc.Content,
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
