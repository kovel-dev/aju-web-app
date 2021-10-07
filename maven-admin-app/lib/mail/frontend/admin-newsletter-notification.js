export const AdminNewsletterNotification = (data) => {
  return {
    from: `'"${process.env.NOTIFICATION_NAME}" <${process.env.NOTIFICATION_EMAIL}>'`,
    to: process.env.ADMIN_RECIPIENTS.split(','),
    subject: 'Newsletter Submission Notification',
    text: `
    <p>New Newsletter Submission from ${data.first_name} with email of ${data.email}.</p>
    <p>First Name: ${data.first_name}</p>
    <p>Last Name: ${data.last_name}</p>
    <p>Email: ${data.email}</p>
    <p>Registered on page url: ${data.url}</p>
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL}" target="_blank">Go to AJU Maven Admin</a></p>
    `,
    html: `
    <p>New Newsletter Submission from ${data.first_name} with email of ${data.email}.</p>
    <p>First Name: ${data.first_name}</p>
    <p>Last Name: ${data.last_name}</p>
    <p>Email: ${data.email}</p>
    <p>Registered on page url: ${data.url}</p>
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL}" target="_blank">Go to AJU Maven Admin</a></p>
    `,
  }
}
