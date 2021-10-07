import Suggestion from '../../models/suggestion'

export const AdminSuggestionNotification = (data) => {
  let suggestion = new Suggestion({})
  let types = suggestion.getTypes()

  return {
    from: `'"${process.env.NOTIFICATION_NAME}" <${process.env.NOTIFICATION_EMAIL}>'`,
    to: process.env.ADMIN_RECIPIENTS.split(','),
    subject: 'New Suggestion Submission Notification',
    text: `
    <p>New Suggestion Submission from ${data.name} with email of ${
      data.contact_email
    }.</p>
    <p>Type: ${types[data.type]}</p>
    <p>Name: ${data.name}</p>
    <p>Details: ${data.details}</p>
    <p>Email: ${data.contact_email}</p>
    <p>Phone: ${data.phone}</p>
    <p>Contact By Phone?: ${data.prefer_phone ? 'Yes' : 'No'}</p>
    <p><a href="${
      process.env.NEXT_PUBLIC_APP_URL
    }" target="_blank">Go to AJU Maven Admin</a></p>
    `,
    html: `
    <p>New Suggestion Submission from ${data.name} with email of ${
      data.contact_email
    }.</p>
    <p>Type: ${types[data.type]}</p>
    <p>Name: ${data.name}</p>
    <p>Details: ${data.details}</p>
    <p>Email: ${data.contact_email}</p>
    <p>Phone: ${data.phone}</p>
    <p>Contact By Phone?: ${data.prefer_phone ? 'Yes' : 'No'}</p>
    <p><a href="${
      process.env.NEXT_PUBLIC_APP_URL
    }" target="_blank">Go to AJU Maven Admin</a></p>
    `,
  }
}
