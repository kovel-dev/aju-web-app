import moment from 'moment'

export const OrderConfirmation = (data) => {
  return {
    from: `'"${process.env.NOTIFICATION_NAME}" <${process.env.NOTIFICATION_EMAIL}>'`,
    to: data.email,
    subject: 'Maven Order Confirmation',
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
        <h1 style="text-align: center; font-size: 24px; border-top: 1px solid #979797; border-bottom: 1px solid #979797; color: #084E85; padding: 15px 0; margin: 40px auto; max-width: 460px;">Thank you for your registration.</h1>
      </div>

      <h2 style="color: #084E85; font-size: 20px; margin-top: 40px;">Hi ${
        data.name
      },</h2>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">We have received your registration. Below you’ll find details about your registration and how to access the programs you have enrolled in. If you need further support, please feel free to contact <a href="mailto:mavensupport@aju.edu">mavensupport@aju.edu</a>.</p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Please access the program via this Zoom link or by logging into your Maven profile and going to the program page.</p>
      
      <h3 style="color: #084E85; font-size: 20px; margin-top: 40px;">Order Summary</h3>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Price: ${
        data.order.price
      }</p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Promo Code: ${
        data.order.discount
      }</p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Subtotal: ${
        data.order.subtotal
      }</p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Total: ${
        data.order.total
      }</p>
      ${
        data.promoCodesUsed.length > 0
          ? `<p style="color: #161D25; font-size: 16px; line-height: 30px;">Promo Code(s) used: ${data.promoCodesUsed.join(
              ', '
            )}</p>`
          : ''
      }
      ${
        data.genPromoCodes.length > 0
          ? `<p style="color: #161D25; font-size: 16px; line-height: 30px;">Discount Code(s) you can use on your next purchase: ${data.genPromoCodes.join(
              ', '
            )}</p>`
          : ''
      }
      
      <h3 style="color: #084E85; font-size: 20px; margin-top: 40px;">How to Join</h3>
      ${data.cart
        .map((item, index) => {
          return `<p style="color: #161D25; font-size: 16px; line-height: 30px;"><a href="${
            process.env.NEXT_PUBLIC_FRONTEND_API_URL
          }/events-classes/program/${item.slug}" target="_blank">${
            item.name
          }</a></p>

          ${
            item.address.length > 0
              ? `<p style="color: #161D25; font-size: 16px; line-height: 30px;">Address: ${item.address}</p>`
              : ''
          }
          <p style="color: #161D25; font-size: 16px; line-height: 30px;">Start Datetime: ${moment(
            item.startDt
          ).format('dddd, MMMM DD, YYYY hh:mm A')}</p>
          
          
          ${
            ['class', 'event'].indexOf(item.type) > -1 && item.link.length > 0
              ? `<p style="color: #161D25; font-size: 16px; line-height: 30px;">Link: <a href="${
                  item.link.indexOf('http://') > -1 ||
                  item.link.indexOf('https://') > -1
                    ? item.link.trim()
                    : '//' + item.link.trim()
                }" target="_blank">Go to Zoom Link</a></p>`
              : ''
          }
          
          ${
            item.type == 'series' && item.seriesMeta.length > 0
              ? item.seriesMeta
                  .map((item, index) => {
                    let seriesItem = item[0]
                    return `<p style="color: #161D25; font-size: 16px; line-height: 30px;">Watch <a href="${
                      seriesItem.link.indexOf('http://') > -1 ||
                      seriesItem.link.indexOf('https://') > -1
                        ? seriesItem.link.trim()
                        : '//' + seriesItem.link.trim()
                    }" target="_blank">${seriesItem.title}</a></p>`
                  })
                  .join('')
              : ''
          }
          `
        })
        .join('')}
      
      <h2 style="color: #084E85; font-size: 20px; margin-top: 40px;">About Us</h2>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Maven delivers immersive experiential learning that captures and delivers the insights of guest speakers and AJU faculty to advance ideas, dialogue and debate. </p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">As an online Jewish learning hub, we offer online, in-person and on-demand classes on Jewish thought, art, culture, literature and more.</p>
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
        <h1 style="text-align: center; font-size: 24px; border-top: 1px solid #979797; border-bottom: 1px solid #979797; color: #084E85; padding: 15px 0; margin: 40px auto; max-width: 460px;">Thank you for your registration.</h1>
      </div>

      <h2 style="color: #084E85; font-size: 20px; margin-top: 40px;">Hi ${
        data.name
      },</h2>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">We have received your registration. Below you’ll find details about your registration and how to access the programs you have enrolled in. If you need further support, please feel free to contact <a href="mailto:mavensupport@aju.edu">mavensupport@aju.edu</a>.</p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Please access the program via this Zoom link or by logging into your Maven profile and going to the program page.</p>
      
      <h3 style="color: #084E85; font-size: 20px; margin-top: 40px;">Order Summary</h3>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Price: ${
        data.order.price
      }</p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Promo Code: ${
        data.order.discount
      }</p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Subtotal: ${
        data.order.subtotal
      }</p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Total: ${
        data.order.total
      }</p>
      ${
        data.promoCodesUsed.length > 0
          ? `<p style="color: #161D25; font-size: 16px; line-height: 30px;">Promo Code(s) used: ${data.promoCodesUsed.join(
              ', '
            )}</p>`
          : ''
      }
      ${
        data.genPromoCodes.length > 0
          ? `<p style="color: #161D25; font-size: 16px; line-height: 30px;">Discount Code(s) you can use on your next purchase: ${data.genPromoCodes.join(
              ', '
            )}</p>`
          : ''
      }
      
      <h3 style="color: #084E85; font-size: 20px; margin-top: 40px;">How to Join</h3>
      ${data.cart
        .map((item, index) => {
          return `<p style="color: #161D25; font-size: 16px; line-height: 30px;"><a href="${
            process.env.NEXT_PUBLIC_FRONTEND_API_URL
          }/events-classes/program/${item.slug}" target="_blank">${
            item.name
          }</a></p>

          ${
            item.address.length > 0
              ? `<p style="color: #161D25; font-size: 16px; line-height: 30px;">Address: ${item.address}</p>`
              : ''
          }
          <p style="color: #161D25; font-size: 16px; line-height: 30px;">Start Datetime: ${moment(
            item.startDt
          ).format('dddd, MMMM DD, YYYY hh:mm A')}</p>
          
          
          ${
            ['class', 'event'].indexOf(item.type) > -1 && item.link.length > 0
              ? `<p style="color: #161D25; font-size: 16px; line-height: 30px;">Link: <a href="${
                  item.link.indexOf('http://') > -1 ||
                  item.link.indexOf('https://') > -1
                    ? item.link.trim()
                    : '//' + item.link.trim()
                }" target="_blank">Go to Zoom Link</a></p>`
              : ''
          }
          
          ${
            item.type == 'series' && item.seriesMeta.length > 0
              ? item.seriesMeta
                  .map((item, index) => {
                    let seriesItem = item[0]
                    return `<p style="color: #161D25; font-size: 16px; line-height: 30px;">Watch <a href="${
                      seriesItem.link.indexOf('http://') > -1 ||
                      seriesItem.link.indexOf('https://') > -1
                        ? seriesItem.link.trim()
                        : '//' + seriesItem.link.trim()
                    }" target="_blank">${seriesItem.title}</a></p>`
                  })
                  .join('')
              : ''
          }
          `
        })
        .join('')}
      
      <h2 style="color: #084E85; font-size: 20px; margin-top: 40px;">About Us</h2>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">Maven delivers immersive experiential learning that captures and delivers the insights of guest speakers and AJU faculty to advance ideas, dialogue and debate. </p>
      <p style="color: #161D25; font-size: 16px; line-height: 30px;">As an online Jewish learning hub, we offer online, in-person and on-demand classes on Jewish thought, art, culture, literature and more.</p>
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
