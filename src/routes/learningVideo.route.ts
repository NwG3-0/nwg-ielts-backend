import express from 'express'
import * as learningController from '../controllers/learningVideo.controller'

const router = express.Router()

router.get('/api/learning-video', learningController.getLearningVideo)
router.get('/api/learning-video-detail', learningController.detailLearningVideo)

export default router
