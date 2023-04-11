import express from 'express'
import { adminMiddleWare } from '../middlewares'

import * as adminController from '../controllers/admin.controller'
import * as learningController from '../controllers/learningVideo.controller'
import * as postController from '../controllers/post.controller'
import * as newsController from '../controllers/news.controller'
import * as syncController from '../controllers/sync.controller'
import * as topicDeckController from '../controllers/topicDeck.controller'

const router = express.Router()

router.post('/api/admin/register', adminController.register)
router.post('/api/admin/login', adminController.login)

// Action to update data chart Api
router.get('/api/sync/post-stats', adminMiddleWare, syncController.syncPostAmountStats)

// Action to Post Api
router.post('/api/post/create', adminMiddleWare, postController.create)
router.post('/api/post/delete', adminMiddleWare, postController.deletePost)
router.post('/api/post/update', adminMiddleWare, postController.updatePost)

// Action to News Api
router.post('/api/news/create', adminMiddleWare, newsController.create)
router.post('/api/news/delete', adminMiddleWare, newsController.deleteNews)
router.post('/api/news/update', adminMiddleWare, newsController.updateNews)

// Action to Topic Deck Api
router.post('/api/topic-deck/create', adminMiddleWare, topicDeckController.create)
router.post('/api/topic-deck/delete', adminMiddleWare, topicDeckController.deleteTopicDeck)

// Action to Learning Video Api
router.post('/api/learning-video/create', adminMiddleWare, learningController.create)

export default router
