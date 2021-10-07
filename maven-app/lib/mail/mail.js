import nodemailer from 'nodemailer'
import nodemailerSendgrid from 'nodemailer-sendgrid'
import { EmailVerificationDetails } from './email-verification'

const mailTrapTransport = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
})

const sendgridTransport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY,
  })
)

export async function sendEmail(type, data) {
  let emailTransport =
    process.env.CURRENT_EMAIL_TRANSPORT == 'mailtrap'
      ? mailTrapTransport
      : sendgridTransport
  let mailOptions = null

  switch (type) {
    case 'user-verification':
      mailOptions = EmailVerificationDetails(data)
      break
  }

  if (process.env.CURRENT_EMAIL_TRANSPORT !== 'mailtrap') {
    mailOptions.from = `'"${process.env.SENDGRID_FROM_NAME}" <${process.env.SENDGRID_FROM}>'`
  }

  let result = true
  if (mailOptions) {
    emailTransport.sendMail(mailOptions, (error, info) => {
      if (error) {
        // @Note: Create a log here to save the issue
        result = false
      }
    })
  }

  return result
}
