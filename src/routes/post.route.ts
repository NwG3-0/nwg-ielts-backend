import express from 'express'
import * as postController from '../controllers/post.controller'
import { adminMiddleWare } from '../middlewares'

const router = express.Router()

router.post('/api/post/create', adminMiddleWare, postController.create)
router.post('/api/post/delete', adminMiddleWare, postController.deletePost)
router.post('/api/post/update', adminMiddleWare, postController.updatePost)
router.get('/api/earliest-post', postController.getEarliestPost)
router.post('/api/earliest-post/update', postController.updateEarliestPost)

export default router
