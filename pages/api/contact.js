// import sendgrid from '@sendgrid/mail';

// sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(req, res) {
    const isHuman = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: `secret=${process.env.RECAPTCHA_SERVER_KEY}&response=${req.body.recaptcha}`,
      },
    )
      .then((res) => res.json())
      .then((json) => json.success)
      .catch((err) => {
        return res.status(err.statusCode || 500).send({ err: error.message });
      });
  
    if (!isHuman) {
      return res.status(400).send({ err: "You're not a human" });
    }
  
    let nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      port: '465',
      host: 'mail.privateemail.com',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      secure: true,
    });
  
    const emailData = {
      to: process.env.EMAIL_RECEPIENT, // Your email where you'll receive emails
      from: process.env.SMTP_USER, // your website email address here
      subject: `[From My Portfolio] : ${req.body.subject}`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html lang="en">
        <head>
          <meta charset="utf-8">
        </head>
        
        <body>
          <h3>You've got a new mail from ${req.body.name}, their email is: ✉️${req.body.email} </h3>
          <p>Message:</p>
          <p>${req.body.message}</p>
        </body>
        </html>`,
    };
  
    transporter.sendMail(emailData, function (err, info) {
      if (err) {
        return res.status(err.statusCode || 500).send({ err: error.message });
      } else {
        return res.status(200).send();
      }
    });
    return res.status(200).send();
  }
  
  export default sendEmail;
  