import nodemailer from 'nodemailer'
import nodemailerSendgrid from 'nodemailer-sendgrid'
import { EmailVerificationDetails } from './email-verification'
import { AdminContactUsNotification } from './frontend/admin-contact-us-notification'
import { AdminHostReqNotification } from './frontend/admin-host-req-notification'
import { AdminNewsletterNotification } from './frontend/admin-newsletter-notification'
import { AdminOrgRequestNotification } from './frontend/admin-org-req-notification'
import { AdminSponsorshipReqNotification } from './frontend/admin-sponsorship-req-notification'
import { ForgotPasswordNotification } from './frontend/fe-forgot-password-notification'
import { VerifiedUserNotification } from './frontend/fe-verified-user-notification'
import { IndividualEmailVerificationDetails } from './frontend/individual-email-verification'
import { PartnerEmailVerificationDetails } from './partner-email-verification'
import { OrganizationReqResponseEmail } from './frontend/organization-reg-request'
import { OrderConfirmation } from './frontend/fe-order-confirmation'
import { AdminPartnerReqNotification } from './frontend/admin-partner-req-notification'
import { AdminSuggestionNotification } from './frontend/admin-suggestion-notification'
import { JoinWaitlistConfirmation } from './frontend/fe-join-waitlist-confirmation'
import { FEHostReqNotification } from './frontend/fe-host-req-notification'
import { FESuggestionNotification } from './frontend/fe-suggestion-notification'
import { FEPartnerReqNotification } from './frontend/fe-partner-req-notification'
import { FEContactUsNotification } from './frontend/fe-contact-us-notification'
import { FESponsorshipNotification } from './frontend/fe-sponsorship-notification'

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

    // frontend mail
    case 'fe-user-verification':
      mailOptions = IndividualEmailVerificationDetails(data)
      break
    case 'partner-verification':
      mailOptions = PartnerEmailVerificationDetails(data)
      break
    case 'fe-organization-registration':
      mailOptions = OrganizationReqResponseEmail(data)
      break
    case 'fe-verified-user':
      mailOptions = VerifiedUserNotification(data)
      break
    case 'fe-forgot-password-user':
      mailOptions = ForgotPasswordNotification(data)
      break
    case 'fe-order-confirmation':
      mailOptions = OrderConfirmation(data)
      break
    case 'fe-join-waitlist':
      mailOptions = JoinWaitlistConfirmation(data)
      break
    case 'fe-suggestions':
      mailOptions = FESuggestionNotification(data)
      break
    case 'fe-partner-request':
      mailOptions = FEPartnerReqNotification(data)
      break
    case 'fe-contact-us':
      mailOptions = FEContactUsNotification(data)
      break
    case 'fe-host-req':
      mailOptions = FEHostReqNotification(data)
      break
    case 'fe-sponsorship-req':
      mailOptions = FESponsorshipNotification(data)
      break

    // admin notification
    case 'fe-admin-org-req':
      mailOptions = AdminOrgRequestNotification(data)
      break
    case 'fe-admin-contact-us':
      mailOptions = AdminContactUsNotification(data)
      break
    case 'fe-admin-newsletter':
      mailOptions = AdminNewsletterNotification(data)
      break
    case 'fe-admin-sponsorship-req':
      mailOptions = AdminSponsorshipReqNotification(data)
      break
    case 'fe-admin-host-req':
      mailOptions = AdminHostReqNotification(data)
      break
    case 'fe-admin-partner-request':
      mailOptions = AdminPartnerReqNotification(data)
      break
    case 'fe-admin-suggestions':
      mailOptions = AdminSuggestionNotification(data)
      break
  }

  if (process.env.CURRENT_EMAIL_TRANSPORT !== 'mailtrap') {
    mailOptions.from = `'"${process.env.SENDGRID_FROM_NAME}" <${process.env.SENDGRID_FROM}>'`
  }

  let result = true
  if (mailOptions) {
    return new Promise((resolve, reject) => {
      emailTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
          // @Note: Create a log here to save the issue
          reject(false)
          console.log(error)
        }

        // @Note: Create a log here to save the success email
        resolve(true)
      })
    })
  }

  return result
}
