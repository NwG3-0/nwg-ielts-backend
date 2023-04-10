import express from 'express'
import rateLimit from 'express-rate-limit'

import * as authController from '../controllers/authentication.controller'
import * as randomController from '../controllers/randomCard.controller'
import * as postStatsController from '../controllers/stats.controller'
import * as messageController from '../controllers/message.controller'
import * as resultTestController from '../controllers/resultTest.controller'
import * as viewNewsController from '../controllers/viewNews.controller'
import * as likeController from '../controllers/like.controller'

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const router = express.Router()

// Api log out
router.post('/api/auth/logout', authController.logout)

// Api random card
router.get('/api/random', limiter, randomController.randomCard)
router.post('/api/setup', randomController.setup)
router.get('/api/check-random/:userId', randomController.checkRandomCardUser)
router.post('/api/update-setup', randomController.updateSetUp)

// Api get stats
router.get('/api/post-stats', postStatsController.getPostStats)

// Api message
router.post('/api/message/send-msg', messageController.sendMsg)
router.post('/api/message/received-msg', messageController.receivedMsg)
router.post('/api/message/add-msg-group', messageController.addMessageGroup)
router.post('/api/message/get-msg-group', messageController.getMessageGroup)
router.post('/api/message/update-msg-group', messageController.updateMessageGroup)
router.post('/api/message/update-unseen-msg-group', messageController.updateUnSeenMessageGroup)

// Api result exam
router.get('/api/result-test', resultTestController.getResultTest)
router.post('/api/result-test/add', resultTestController.addResultTest)

router.get('/api/news/check-views', viewNewsController.checkViewNews)
router.post('/api/view-news/create', viewNewsController.addViewNews)

router.get('/api/news/check-like', likeController.checkLikeNews)
router.post('/api/like-news/create', likeController.addViewNews)

router.get('/api/post/check-like', likeController.checkLikePost)
router.post('/api/like-post/create', likeController.addViewPost)

export default router
