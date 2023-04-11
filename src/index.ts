'use strict'

require('dotenv').config()

import { createClient } from 'redis'
import express from 'express'
import morgan from 'morgan'
import http from 'http'
import { Server } from 'socket.io'
import helmet from 'helmet'

import userRoutes from './routes/authentication.route'
import publicRoutes from './routes/public.route'
import privateRoutes from './routes/private.router'
import adminRoutes from './routes/admin.router'

import initializeDBConnection from './database'
import bodyParser from 'body-parser'
import { SOCKET_KEYS } from './types/socket'
import { cors } from './utils/cors'

const DEFAULT_SERVER_PORT = 4000
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : DEFAULT_SERVER_PORT

interface ICallUser {
  userToCall: any
  signalData: any
  from: string
  name: string
}

interface IAnswerUser {
  to: string
  signal: any
}

initializeDBConnection()

const app = express()
app.use(morgan('combined'))

export let client

// Check CORS for website
app.use(cors)
app.use(helmet())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

const users = {}

const socketToRoom = {}
const usersRoom = {}

io.on(SOCKET_KEYS.CONNECTION, (socket) => {
  socket.emit(SOCKET_KEYS.ME, socket.id)
  socket.on(SOCKET_KEYS.USERS, (data) => {
    socket.join(data)
  })

  socket.on(SOCKET_KEYS.CONNECT_CHAT, function (data) {
    for (const [key, value] of Object.entries(users)) {
      let address: any = value
      socket.to(address).emit(SOCKET_KEYS.ACTIVE_USER, true)
    }

    users[socket.id] = data
  })

  socket.on(SOCKET_KEYS.SEND_MESSAGE, (data) => {
    socket.to(data.to).emit(SOCKET_KEYS.RECEIVED_MESSAGE, data)
  })

  socket.on(SOCKET_KEYS.SEEN_CHAT, (data) => {
    console.log(users)
    for (const [key, value] of Object.entries(users)) {
      let address: any = key
      socket.to(address).emit(SOCKET_KEYS.SEEN_CHAT_RESPONSE, data)
    }
  })

  socket.on(SOCKET_KEYS.CHECK_ACTIVE, (data) => {
    for (const [key, value] of Object.entries(users)) {
      if (value === data.to) {
        socket.emit(SOCKET_KEYS.ACTIVE, true)
        break
      } else {
        socket.emit(SOCKET_KEYS.ACTIVE, false)
      }
    }
  })

  socket.on(SOCKET_KEYS.SEND_TYPING, (data) => {
    socket.to(data.to).emit(SOCKET_KEYS.IS_TYPING, data)
  })

  socket.on(SOCKET_KEYS.SEND_TYPING, (data) => {
    socket.to(data.to).emit(SOCKET_KEYS.IS_TYPING, data)
  })

  // Handle call video event
  socket.on(SOCKET_KEYS.CALL_USER, ({ userToCall, signalData, from, name }: ICallUser) => {
    io.to(userToCall).emit(SOCKET_KEYS.CALL_USER, { signal: signalData, from, name })
  })

  socket.on(SOCKET_KEYS.ANSWER_CALL, ({ to, signal }: IAnswerUser) => {
    io.to(to).emit(SOCKET_KEYS.ACCEPTED_CALL, { signal })
  })

  socket.on(SOCKET_KEYS.RESPONSE_CHAT, (data) => {
    const { to } = data
  })

  socket.on(SOCKET_KEYS.DISCONNECT, () => {
    delete users[socket.id]
    const roomID = socketToRoom[socket.id]
    let room = usersRoom[roomID]
    if (room) {
      room = room.filter((id) => id !== socket.id)
      usersRoom[roomID] = room
    }

    for (const [key, value] of Object.entries(users)) {
      let address: any = value
      socket.to(address).emit(SOCKET_KEYS.ACTIVE_USER, false)
    }

    // broadcast to other user for ending call
    socket.broadcast.emit(SOCKET_KEYS.END_CALL)
  })
})

// Check body response for api
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '30mb' }))

// Routes
app.use(userRoutes)
app.use(publicRoutes)
app.use(adminRoutes)
app.use(privateRoutes)

server.listen(SERVER_PORT, async () => {
  try {
    client = createClient({
      password: 'CSS1oCiwEiNcXmxAgNVQLotY1xrdtrP8',
      socket: {
        host: 'redis-16663.c292.ap-southeast-1-1.ec2.cloud.redislabs.com',
        port: 16663,
      },
    })

    client.on('error', () => {
      console.log('Redis Client has been connect error')
    })

    await client.connect()
    console.log('Connect to Redis server')
  } catch (error) {
    console.log(error)
  }
})
console.log(`Example app listening on port ${SERVER_PORT}`)
