import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config(); 

// create reusable transporter object

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });


async function sendEmail(data) {

  try {
    let mailOptions = {
    from: process.env.SMTP_USER,
    to: data,
    subject: "Test Email from Node.js",
    text: "Hello! This is a test email from Node.js via Outlook.",
    html: "<b>Hello!</b> This is a test email from Node.js via Outlook."
  };
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function sendBulkEmails(emailList) {
  const batchSize = 10;

  for (let i = 0; i < emailList.length; i += batchSize) {
    const batch = emailList.slice(i, i + batchSize);
    await Promise.all(batch.map(email => sendEmail(email)));
  }
}


export {sendEmail,sendBulkEmails};



