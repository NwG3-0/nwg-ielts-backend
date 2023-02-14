import express from 'express'
import * as postController from '../controllers/post.controller'

const router = express.Router()

router.post('/api/post/create', postController.create)
router.post('/api/post/delete', postController.deletePost)
router.post('/api/post/update', postController.updatePost)
router.get('/api/earliest-post', postController.getEarliestPost)
router.post('/api/earliest-post/update', postController.updateEarliestPost)

export default router
