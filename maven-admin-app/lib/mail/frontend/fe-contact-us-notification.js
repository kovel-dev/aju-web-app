export const FEContactUsNotification = (data) => {
  return {
    from: `'"${process.env.NOTIFICATION_NAME}" <${process.env.NOTIFICATION_EMAIL}>'`,
    to: data.email,
    subject: 'Contact Us Submission Notification',
    text: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You've been added to the waitlist</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,500;0,600;0,700;1,500;1,700&display=swap');
    p,
    h1,
    h2,
    h3,
    input,
    button,
    a {
      font-family: 'Montserrat', sans-serif;
    }
  </style>
</head>
<body style="max-width: 900px; margin: 0 auto;">
  <main style="border: 15px solid #E3E3E3;">
    <div style="padding: 50px 8%">
      <img src="https://maven.aju.edu/images/maven_logo2.png" alt="Maven logo" style="height: 50px; width: auto; margin: 0 auto; display: block;" />
      <div>
        <h1 style="text-align: center; font-size: 24px; border-top: 1px solid #979797; border-bottom: 1px solid #979797; color: #084E85; padding: 15px 0; margin: 40px auto; max-width: 460px;">Thank you for your submission</h1>
      </div>
      <h2 style="color: #084E85; font-size: 20px; margin-top: 40px;">Hi ${data.name},</h2>
      <h2 style="color: #084E85; font-size: 20px; margin-top: 40px;">Submission Details:</h2>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Email: ${data.email}</p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Phone: ${data.mobile_number}</p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Contact By Phone?: ${data.method_of_contact_phone}</p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Message: ${data.message}</p>

      <div style="margin: 40px 0;">
        <a href="https://maven.aju.edu/" target="_blank" style="background-color: #084E85; color: white; margin: 0 auto; text-decoration: none; padding: 34px 44px; font-weight: bold; display: block; width: 130px; font-size: 20px; text-align: center;">Visit Maven</a>
      </div>
    </div>
  </main>
  <footer style="background-color: #084E85; padding: 45px 0;">
    <p style="text-align: center; margin-top: 0;">
      <a href="https://www.instagram.com/americanjewishu/" style="color: white; padding: 0 8px; text-decoration: none;" target="_blank">
        <i class="fab fa-instagram" style="font-size: 18px;"></i>
      </a>
      <a href="https://www.facebook.com/AmericanJewishUniversity" style="color: white; padding: 0 8px; text-decoration: none;" target="_blank">
        <i class="fab fa-facebook-f" style="font-size: 18px;"></i></a>
      <a href="https://twitter.com/AmericanJewishU" style="color: white; padding: 0 8px; text-decoration: none;" target="_blank">
        <i class="fab fa-twitter" style="font-size: 18px;"></i>
      </a>
      <a href="https://www.youtube.com/user/AmericanJewishUniv" style="color: white; padding: 0 8px; text-decoration: none;" target="_blank">
        <i class="fab fa-youtube" style="font-size: 18px;"></i>
      </a>
    </p>
    <img src="https://maven.aju.edu/images/maven_logo_white.png" alt="Maven logo" style="height: 50px; min-height: 45px; max-height: 55px; width: auto; margin: 35px auto; display: block;">
    <p style="text-align: center; font-size: 12px;"><a style="color: white; text-align: center;" href="/">Unsubscribe</a></p>
    <p style="font-size: 12px; color: white; text-align: center;">Copyright 2021 © Maven</p>

  </footer>
  <script src="https://kit.fontawesome.com/67fd2d459f.js" crossorigin="anonymous"></script>
</body>
</html>
    `,
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You've been added to the waitlist</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,500;0,600;0,700;1,500;1,700&display=swap');
    p,
    h1,
    h2,
    h3,
    input,
    button,
    a {
      font-family: 'Montserrat', sans-serif;
    }
  </style>
</head>
<body style="max-width: 900px; margin: 0 auto;">
  <main style="border: 15px solid #E3E3E3;">
    <div style="padding: 50px 8%">
      <img src="https://maven.aju.edu/images/maven_logo2.png" alt="Maven logo" style="height: 50px; width: auto; margin: 0 auto; display: block;" />
      <div>
        <h1 style="text-align: center; font-size: 24px; border-top: 1px solid #979797; border-bottom: 1px solid #979797; color: #084E85; padding: 15px 0; margin: 40px auto; max-width: 460px;">Thank you for your submission</h1>
      </div>
      <h2 style="color: #084E85; font-size: 20px; margin-top: 40px;">Hi ${data.name},</h2>
      <h2 style="color: #084E85; font-size: 20px; margin-top: 40px;">Submission Details:</h2>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Email: ${data.email}</p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Phone: ${data.mobile_number}</p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Contact By Phone?: ${data.method_of_contact_phone}</p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Message: ${data.message}</p>

      <div style="margin: 40px 0;">
        <a href="https://maven.aju.edu/" target="_blank" style="background-color: #084E85; color: white; margin: 0 auto; text-decoration: none; padding: 34px 44px; font-weight: bold; display: block; width: 130px; font-size: 20px; text-align: center;">Visit Maven</a>
      </div>
    </div>
  </main>
  <footer style="background-color: #084E85; padding: 45px 0;">
    <p style="text-align: center; margin-top: 0;">
      <a href="https://www.instagram.com/americanjewishu/" style="color: white; padding: 0 8px; text-decoration: none;" target="_blank">
        <i class="fab fa-instagram" style="font-size: 18px;"></i>
      </a>
      <a href="https://www.facebook.com/AmericanJewishUniversity" style="color: white; padding: 0 8px; text-decoration: none;" target="_blank">
        <i class="fab fa-facebook-f" style="font-size: 18px;"></i></a>
      <a href="https://twitter.com/AmericanJewishU" style="color: white; padding: 0 8px; text-decoration: none;" target="_blank">
        <i class="fab fa-twitter" style="font-size: 18px;"></i>
      </a>
      <a href="https://www.youtube.com/user/AmericanJewishUniv" style="color: white; padding: 0 8px; text-decoration: none;" target="_blank">
        <i class="fab fa-youtube" style="font-size: 18px;"></i>
      </a>
    </p>
    <img src="https://maven.aju.edu/images/maven_logo_white.png" alt="Maven logo" style="height: 50px; min-height: 45px; max-height: 55px; width: auto; margin: 35px auto; display: block;">
    <p style="text-align: center; font-size: 12px;"><a style="color: white; text-align: center;" href="/">Unsubscribe</a></p>
    <p style="font-size: 12px; color: white; text-align: center;">Copyright 2021 © Maven</p>

  </footer>
  <script src="https://kit.fontawesome.com/67fd2d459f.js" crossorigin="anonymous"></script>
</body>
</html>
    `,
  }
}
