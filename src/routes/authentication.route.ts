import express from 'express'
import * as authenticationController from '../controllers/authentication.controller'
import { rateLimit } from 'express-rate-limit'

const router = express.Router()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2,
  message: 'Too many request',
})

router.post('/api/auth/register', authenticationController.register)
router.post('/api/auth/login', authenticationController.login)
router.post('/api/auth/verify', limiter, authenticationController.verify)
router.post('/api/auth/resend', authenticationController.resend)
router.get('/api/auth/get-list', authenticationController.getListUser)
router.post('/api/auth/logout', authenticationController.logout)

export default router
