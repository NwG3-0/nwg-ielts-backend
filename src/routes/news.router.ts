import express from 'express'
import * as newsController from '../controllers/news.controller'

const router = express.Router()

router.post('/api/news/create', newsController.create)
router.post('/api/news/delete', newsController.deleteNews)
router.post('/api/news/update', newsController.updateNews)
router.post('/api/news/update-views', newsController.addViewNews)

export default router
