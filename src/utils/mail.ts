require('dotenv').config()

import nodemailer from 'nodemailer'

const MAX = 1000000
const MIN = 100000

export interface MailConfig {
  MAILER: string | undefined
  HOST: string | undefined
  PORT: string | undefined
  USERNAME: string | undefined
  PASSWORD: string | undefined
  ENCRYPTION: string | undefined
  FROM_ADDRESS: string | undefined
  FROM_NAME: string | undefined
}

export const mailConfig: any = {
  MAILER: process.env.MAIL_MAILER,
  HOST: process.env.MAIL_HOST || undefined,
  PORT: process.env.MAIL_PORT,
  USERNAME: process.env.MAIL_USERNAME,
  PASSWORD: process.env.MAIL_PASSWORD,
  ENCRYPTION: process.env.MAIL_ENCRYPTION,
  FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
  FROM_NAME: process.env.MAIL_FROM_NAME,
}

export const sendOtpMail = async (email: string, otpCode: number) => {
  const transport = nodemailer.createTransport({
    host: mailConfig.HOST,
    port: mailConfig.PORT,
    secure: false,
    auth: {
      user: mailConfig.USERNAME,
      pass: mailConfig.PASSWORD,
    },
    from: mailConfig.FROM_ADDRESS,
  })

  const options = {
    from: mailConfig.FROM_ADDRESS,
    to: email,
    subject: 'OTP Code to verify your account',
    html: `<div>
      <div>Please check your OTP Code</div>
      <div>OTP Code: <span style="text-decoration: 'underlined';color= 'red'">${otpCode}</span></div>
    </div>`,
  }

  return transport.sendMail(options, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

export const generateCode = () => {
  return Math.round(Math.random() * (MAX - MIN) + MIN)
}

export const sendRedeemCode = async (email: string, codeRedeem: string) => {
  const transport = nodemailer.createTransport({
    host: mailConfig.HOST,
    port: mailConfig.PORT,
    secure: false,
    auth: {
      user: mailConfig.USERNAME,
      pass: mailConfig.PASSWORD,
    },
    from: mailConfig.FROM_ADDRESS,
  })

  const options = {
    from: mailConfig.FROM_ADDRESS,
    to: email,
    subject: 'Redeem Code',
    html: `<div>
      <div>Please check your OTP Code</div>
      <div>Redeem Code: <span style="text-decoration: 'underlined';color= 'red'">${codeRedeem}</span></div>
    </div>`,
  }

  return transport.sendMail(options, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}
