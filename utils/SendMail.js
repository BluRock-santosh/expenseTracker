import nodemailer from 'nodemailer';

import env from 'dotenv';
env.config();


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });


// Define a function to send an email
export const sendEmail = async (email, emailContent) => {
  try {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw new Error('Email not sent');
  }
};
