import { server } from '../config/server'

export const PartnerEmailVerificationDetails = (data) => {
  return {
    from: `'"${process.env.NOTIFICATION_NAME}" <${process.env.NOTIFICATION_EMAIL}>'`,
    to: data.email,
    subject: 'Successfully AJU Account Verification for ' + data.first_name,
    text: `Your account successfully verified. you can access your account using created email and password.`,
    html:
      `<p>Hi ` +
      data.first_name +
      `,<br>
    Your Account on AJU Maven is successfully verified. you can access your account using created email and password.<br><br>
    </p>`,
  }
}
