import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config(); 

async function sendEmail() {
  // create reusable transporter object
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // use TLS
    auth: {
      user: "bluhealth@bluecloudsoftech.com", // your Outlook email
      pass: "gqvzqbkjphfrwvmx" // Outlook password / app password
    }
  });

  // email options
  let mailOptions = {
    from: 'bluhealth@bluecloudsoftech.com', // sender
    to: "yskyadav03@gmail.com", // list of recipients
    subject: "Test Email from Node.js", // Subject line
    text: "Hello! This is a test email from Node.js via Outlook.", // plain text
    html: "<b>Hello!</b> This is a test email from Node.js via Outlook." // HTML body
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export default sendEmail;


