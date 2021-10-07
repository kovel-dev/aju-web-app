export const AdminSponsorshipReqNotification = (data) => {
  const tiers = {
    'program-series': 'Program Series',
    'single-event': 'Single Event',
    'vip-event': 'VIP Event',
  }

  return {
    from: `'"${process.env.NOTIFICATION_NAME}" <${process.env.NOTIFICATION_EMAIL}>'`,
    to: process.env.ADMIN_RECIPIENTS.split(','),
    subject: 'Sponsorship Request Submission Notification',
    text: `
    <p>New Sponsorship Request Submission from ${data.name} with email of ${
      data.email
    }.</p>
    <p>Name: ${data.name}</p>
    <p>Email: ${data.email}</p>
    <p>Phone: ${data.mobile_number}</p>
    <p>Contact By Phone?: ${data.method_of_contact_phone ? 'Yes' : 'No'}</p>
    <p>Tier: ${tiers[data.tier]}</p>
    <p>Message: ${data.details}</p>
    <p><a href="${
      process.env.NEXT_PUBLIC_APP_URL
    }" target="_blank">Go to AJU Maven Admin</a></p>
    `,
    html: `
    <p>New Sponsorship Request Submission from ${data.name} with email of ${
      data.email
    }.</p>
    <p>Name: ${data.name}</p>
    <p>Email: ${data.email}</p>
    <p>Phone: ${data.mobile_number}</p>
    <p>Contact By Phone?: ${data.method_of_contact_phone ? 'Yes' : 'No'}</p>
    <p>Tier: ${tiers[data.tier]}</p>
    <p>Message: ${data.details}</p>
    <p><a href="${
      process.env.NEXT_PUBLIC_APP_URL
    }" target="_blank">Go to AJU Maven Admin</a></p>
    `,
  }
}
