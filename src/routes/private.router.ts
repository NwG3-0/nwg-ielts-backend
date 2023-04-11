import express from 'express'
import rateLimit from 'express-rate-limit'
import { privateMiddleware } from '../middlewares'

import * as authController from '../controllers/authentication.controller'
import * as randomController from '../controllers/randomCard.controller'
import * as postStatsController from '../controllers/stats.controller'
import * as messageController from '../controllers/message.controller'
import * as resultTestController from '../controllers/resultTest.controller'
import * as viewNewsController from '../controllers/viewNews.controller'
import * as likeController from '../controllers/like.controller'
import * as topicDeckController from '../controllers/topicDeck.controller'
import * as cardController from '../controllers/card.controller'
import * as newsController from '../controllers/news.controller'
import * as postController from '../controllers/post.controller'

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const router = express.Router()

// Api log out
router.post('/api/auth/logout', privateMiddleware, authController.logout)

// Api random card
router.get('/api/random', privateMiddleware, limiter, randomController.randomCard)
router.post('/api/setup', privateMiddleware, randomController.setup)
router.get('/api/check-random/:userId', privateMiddleware, randomController.checkRandomCardUser)
router.post('/api/update-setup', privateMiddleware, randomController.updateSetUp)

// Api get stats
router.get('/api/post-stats', privateMiddleware, postStatsController.getPostStats)

// Api message
router.post('/api/message/send-msg', privateMiddleware, messageController.sendMsg)
router.post('/api/message/received-msg', privateMiddleware, messageController.receivedMsg)
router.post('/api/message/add-msg-group', privateMiddleware, messageController.addMessageGroup)
router.post('/api/message/get-msg-group', privateMiddleware, messageController.getMessageGroup)
router.post('/api/message/update-msg-group', privateMiddleware, messageController.updateMessageGroup)
router.post('/api/message/update-unseen-msg-group', privateMiddleware, messageController.updateUnSeenMessageGroup)

// Api result exam
router.get('/api/result-test', privateMiddleware, resultTestController.getResultTest)
router.post('/api/result-test/add', privateMiddleware, resultTestController.addResultTest)

router.get('/api/news/check-views', privateMiddleware, viewNewsController.checkViewNews)
router.post('/api/view-news/create', privateMiddleware, viewNewsController.addViewNews)

router.get('/api/news/check-like', privateMiddleware, likeController.checkLikeNews)
router.post('/api/like-news/create', privateMiddleware, likeController.addViewNews)

router.get('/api/post/check-like', privateMiddleware, likeController.checkLikePost)
router.post('/api/like-post/create', privateMiddleware, likeController.addViewPost)

router.get('/api/topic-deck', privateMiddleware, topicDeckController.index)

router.post('/api/news/update-views', privateMiddleware, newsController.addViewNews)

// Api card for user
router.get('/api/card', privateMiddleware, cardController.index)
router.post('/api/card/create', privateMiddleware, cardController.addCard)
router.post('/api/card/delete', privateMiddleware, cardController.deleteCard)
router.get('/api/card/:cardId', privateMiddleware, cardController.detail)
router.post('/api/card/check', privateMiddleware, cardController.checkCard)

router.post('/api/earliest-post/update', postController.updateEarliestPost)

export default router
