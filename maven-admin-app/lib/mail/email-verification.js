import { server } from '../config/server'

export const EmailVerificationDetails = (data) => {
  return {
    from: `'"${process.env.NOTIFICATION_NAME}" <${process.env.NOTIFICATION_EMAIL}>'`,
    to: data.email,
    subject: 'AJU Account Verification for ' + data.first_name,
    text: `Click here for email verification: <a href="${server}/verify/${data.verification_token}">Verify your email address</a>`,
    html:
      `<p>Hi ` +
      data.first_name +
      `,<br>
    Your Account on AJU Maven is created. Please click below link to verify your email and set up a new password.<br><br>
    Verification Link: <a href="${server}/verify/${data.verification_token}">Verify your email address</a></p>`,
  }
}
