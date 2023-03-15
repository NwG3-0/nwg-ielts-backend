import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { ViewNewsModel } from '../models/ViewNews'

dayjs.extend(utc)

export const getViewNews = async (req, res, _next) => {
  try {
    const { newsId } = req.query

    if (!newsId) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid news id' })
      return
    }

    const totalRecords = await ViewNewsModel.countDocuments({
      News: newsId,
    })

    if (totalRecords) {
      res.status(StatusCodes.OK).json({
        success: true,
        data: totalRecords,
      })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: null,
        message: '',
      })
    }
  } catch (error) {
    console.log('[View] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const addViewNews = async (req, res, next) => {
  try {
    const { newsId, userId } = req.body

    if (!newsId) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid news id' })
      return
    }

    if (!userId) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid user id' })
      return
    }

    const currentTimestamp = dayjs.utc().unix()

    const response = await ViewNewsModel.create({
      News: newsId,
      User: userId,
      CreatedAt: currentTimestamp,
      UpdatedAt: currentTimestamp,
    })

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You create views successfully' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You create news fail' })
    }
  } catch (error) {
    console.log('[Add view] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const checkViewNews = async (req, res, _next) => {
  try {
    const { newsId, userId } = req.query

    if (!newsId) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid news id' })
      return
    }

    if (!userId) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid user id' })
      return
    }

    const response = await ViewNewsModel.find({
      User: userId,
      News: newsId,
    })

    if (response.length > 0) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Have view it' })
    } else {
      res.status(StatusCodes.OK).json({ success: false, data: null, message: 'Have not view it' })
    }
  } catch (error) {
    console.log('[Add view] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
