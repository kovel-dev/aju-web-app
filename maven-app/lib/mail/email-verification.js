import { server } from '../config/server'

export const EmailVerificationDetails = (data) => {
  return {
    from: `'"${process.env.NOTIFICATION_NAME}" <${process.env.NOTIFICATION_EMAIL}>'`,
    to: data.email,
    subject: 'Email Verification for ' + data.first_name,
    text: `Click here for email verification: <a href="${server}/verify/${data.verification_token}">Verify your email address</a>`,
    html: `Click here for email verification: <a href="${server}/verify/${data.verification_token}">Verify your email address</a>`,
  }
}
