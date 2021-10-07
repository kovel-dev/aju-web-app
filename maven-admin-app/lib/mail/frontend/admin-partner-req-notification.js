import PartnerRequest from '../../models/partner-request'

export const AdminPartnerReqNotification = (data) => {
  let partnerReq = new PartnerRequest({})
  let addOnTypes = partnerReq.getAddOnTypes()

  return {
    from: `'"${process.env.NOTIFICATION_NAME}" <${process.env.NOTIFICATION_EMAIL}>'`,
    to: process.env.ADMIN_RECIPIENTS.split(','),
    subject: 'New Partner Request Submission Notification',
    text: `
    <p>New Partner Request Submission from ${data.name} with email of ${
      data.contact_email
    }.</p>
    <p>Add On: ${addOnTypes[data.add_on]}</p>
    <p>Name: ${data.name}</p>
    <p>Number of seats reserved: ${data.seats_reserved}</p>
    <p>Details: ${data.details}</p>
    <p>Organization: ${data.organization}</p>
    <p>Phone: ${data.phone}</p>
    <p>Email: ${data.contact_email}</p>
    <p>Contact By Phone?: ${data.prefer_phone ? 'Yes' : 'No'}</p>
    <p>Requested Event: <a href="${data.link}" target="_blank">${
      data.event_name
    }</p>

    <p><a href="${
      process.env.NEXT_PUBLIC_APP_URL
    }" target="_blank">Go to AJU Maven Admin</a></p>
    `,
    html: `
    <p>New Partner Request Submission from ${data.name} with email of ${
      data.contact_email
    }.</p>
    <p>Add On: ${addOnTypes[data.add_on]}</p>
    <p>Name: ${data.name}</p>
    <p>Number of seats reserved: ${data.seats_reserved}</p>
    <p>Details: ${data.details}</p>
    <p>Organization: ${data.organization}</p>
    <p>Phone: ${data.phone}</p>
    <p>Email: ${data.contact_email}</p>
    <p>Contact By Phone?: ${data.prefer_phone ? 'Yes' : 'No'}</p>
    <p>Requested Event: <a href="${data.link}" target="_blank">${
      data.event_name
    }</p>

    <p><a href="${
      process.env.NEXT_PUBLIC_APP_URL
    }" target="_blank">Go to AJU Maven Admin</a></p>
    `,
  }
}
