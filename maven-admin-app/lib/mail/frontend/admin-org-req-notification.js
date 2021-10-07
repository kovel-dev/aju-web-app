export const AdminOrgRequestNotification = (data) => {
  return {
    from: `'"${process.env.NOTIFICATION_NAME}" <${process.env.NOTIFICATION_EMAIL}>'`,
    to: process.env.ADMIN_RECIPIENTS.split(','),
    subject: 'Organization Registration Request Notification',
    text: `
    <p>New Organization Registration Request from ${data.first_name} with email of ${data.email}.</p> 
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL}" target="_blank">Go to AJU Maven Admin</a></p>
    `,
    html: `
    <p>New Organization Registration Request from ${data.first_name} with email of ${data.email}.</p> 
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL}" target="_blank">Go to AJU Maven Admin</a></p>
    `,
  }
}
