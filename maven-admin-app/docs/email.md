[Go Back to Table of Contents](../README.md)

# Email Configuration

## Install plugins

Install Nodemailer
```
npm install nodemailer --save
```

Install Sendgrid nodemailer transport

```
npm install nodemailer-sendgrid --save
```

## Environment Configuration

Add the following to your .env file

```
# EMAIL SETTINGS (mailtrap/sendgrid)
CURRENT_EMAIL_TRANSPORT=sendgrid
NOTIFICATION_NAME=<name (example: AJU Notification)>
NOTIFICATION_EMAIL=<email (example: noreply@aju.com)>

# MAILTRAP
MAILTRAP_HOST="smtp.mailtrap.io"
MAILTRAP_PORT="2525"
MAILTRAP_USERNAME="<username>"
MAILTRAP_PASSWORD="<password>"

# SENDGRID
SENDGRID_API_KEY="<api key>"
SENDGRID_FROM_NAME=<name (example: AJU Notification)>
SENDGRID_FROM="<email (must be the one you've set on the sendgrid)>"
```

## Files and Purpose

### **lib/mail/mail.js**

This file contains the sendMail() method where you will set the type and data to do your email request.

* **type**: what template to use to send to the recipient
* **data**: the data needed in the template and mail to do your email request

### **lib/mail**

This folder will contain the main.js and the email templates. Template example is the email-verification.js

## References
* https://blog.logrocket.com/how-to-send-emails-with-node-js-using-sendgrid/
* https://www.npmjs.com/package/nodemailer-sendgrid
* https://mailtrap.io/blog/sending-emails-with-nodemailer/
* https://nodemailer.com/smtp/

<br />

[Go Back to Table of Contents](../README.md)