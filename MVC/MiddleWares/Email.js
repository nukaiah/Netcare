import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config(); 

async function sendEmail() {
  // create reusable transporter object
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.FROM_EMAIL_ID,
      pass: process.env.FROM_EMAIL_PASSWORD
    }
  });

  // email options
  let mailOptions = {
    from: process.env.FROM_EMAIL_ID,
    to: "yskyadav03@gmail.com",
    subject: "Test Email from Node.js",
    text: "Hello! This is a test email from Node.js via Outlook.",
    html: "<b>Hello!</b> This is a test email from Node.js via Outlook."
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export default sendEmail;


