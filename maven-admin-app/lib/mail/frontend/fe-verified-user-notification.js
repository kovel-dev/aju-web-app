export const VerifiedUserNotification = (data) => {
  return {
    from: `'"${process.env.NOTIFICATION_NAME}" <${process.env.NOTIFICATION_EMAIL}>'`,
    to: data.email,
    subject: 'Welcome to Maven!',
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
        <h1 style="text-align: center; font-size: 24px; border-top: 1px solid #979797; border-bottom: 1px solid #979797; color: #084E85; padding: 15px 0; margin: 40px auto; max-width: 460px;">You are on your journey to becoming a Maven</h1>
      </div>
      <h2 style="color: #084E85; font-size: 20px; margin-top: 40px;">Hi ${data.first_name},</h2>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">You have successfully created your Maven profile. You now have access to our extensive library of online, in-person and on-demand classes and events to explore the world of Jewish learning, advance ideas, and engage in dialogue and debate.</p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Browse our featured events and classes: <a href="https://maven.aju.edu/events-classes">https://maven.aju.edu/events-classes</a></p>
      <h2 style="color: #084E85; font-size: 20px; margin-top: 40px;">See More</h2>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Discover our on-demand content library: <a href="https://maven.aju.edu/on-demand">https://maven.aju.edu/on-demand</a></p>
      <h2 style="color: #084E85; font-size: 20px; margin-top: 40px;">Learn More</h2>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">If you have any questions, please feel free to contact <a href="mailto:mavensupport@aju.edu">mavensupport@aju.edu.</a></p>
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
        <h1 style="text-align: center; font-size: 24px; border-top: 1px solid #979797; border-bottom: 1px solid #979797; color: #084E85; padding: 15px 0; margin: 40px auto; max-width: 460px;">You are on your journey to becoming a Maven</h1>
      </div>
      <h2 style="color: #084E85; font-size: 20px; margin-top: 40px;">Hi ${data.first_name},</h2>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">You have successfully created your Maven profile. You now have access to our extensive library of online, in-person and on-demand classes and events to explore the world of Jewish learning, advance ideas, and engage in dialogue and debate.</p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Browse our featured events and classes: <a href="https://maven.aju.edu/events-classes">https://maven.aju.edu/events-classes</a></p>
      <h2 style="color: #084E85; font-size: 20px; margin-top: 40px;">See More</h2>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Discover our on-demand content library: <a href="https://maven.aju.edu/on-demand">https://maven.aju.edu/on-demand</a></p>
      <h2 style="color: #084E85; font-size: 20px; margin-top: 40px;">Learn More</h2>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">If you have any questions, please feel free to contact <a href="mailto:mavensupport@aju.edu">mavensupport@aju.edu.</a></p>
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
