import express from 'express'
import * as postController from '../controllers/post.controller'
import * as newsController from '../controllers/news.controller'

const router = express.Router()

router.get('/api/post', postController.index)
router.get('/api/post/detail', postController.detailPost)

router.get('/api/news/detail', newsController.detailNews)
router.get('/api/news-type', newsController.getNewsByType)
router.get('/api/news', newsController.index)
router.get('/api/news/highest-views', newsController.getFiveHighestViewNews)

export default router
