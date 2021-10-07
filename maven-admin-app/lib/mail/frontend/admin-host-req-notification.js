export const AdminHostReqNotification = (data) => {
  let speakers = data.speaker_meta.map((user) => user.name)
  speakers = speakers.join(', ')

  return {
    from: `'"${process.env.NOTIFICATION_NAME}" <${process.env.NOTIFICATION_EMAIL}>'`,
    to: process.env.ADMIN_RECIPIENTS.split(','),
    subject: 'Book a Speaker Submission Notification',
    text: `
    <p>New Book a Speaker Submission from ${data.name} with email of ${
      data.contact_email
    }.</p>
    <p>Name: ${data.name}</p>
    <p>Title: ${data.title}</p>
    <p>Organization: ${data.organization}</p>
    <p>Phone: ${data.phone}</p>
    <p>Email: ${data.contact_email}</p>
    <p>Contact By Phone?: ${data.prefer_phone ? 'Yes' : 'No'}</p>
    <p>Date: ${data.date}</p>
    <p>Type: ${data.type}</p>
    <p>Location: ${data.location}</p>
    <p>Speakers: ${speakers}</p>
    <p><a href="${
      process.env.NEXT_PUBLIC_APP_URL
    }" target="_blank">Go to AJU Maven Admin</a></p>
    `,
    html: `
    <p>New Book a Speaker Submission from ${data.name} with email of ${
      data.contact_email
    }.</p>
    <p>Name: ${data.name}</p>
    <p>Title: ${data.title}</p>
    <p>Organization: ${data.organization}</p>
    <p>Phone: ${data.phone}</p>
    <p>Email: ${data.contact_email}</p>
    <p>Contact By Phone?: ${data.prefer_phone ? 'Yes' : 'No'}</p>
    <p>Date: ${data.date}</p>
    <p>Type: ${data.type}</p>
    <p>Location: ${data.location}</p>
    <p>Speakers: ${speakers}</p>
    <p><a href="${
      process.env.NEXT_PUBLIC_APP_URL
    }" target="_blank">Go to AJU Maven Admin</a></p>
    `,
  }
}
