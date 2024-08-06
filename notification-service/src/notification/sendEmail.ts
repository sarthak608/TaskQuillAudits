import nodemailer from 'nodemailer';
import {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
  } from '../config/constants';

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,  
    port: parseInt(SMTP_PORT || '587'),  
    secure: SMTP_PORT === '465', 
    auth: {
        user: SMTP_USER,  
        pass: SMTP_PASS, 
    },
});


async function sendEmailAlert(subject: string, body: string, toEmail: string[]) {
    const mailOptions = {
        from: SMTP_USER,
        to: toEmail.join(', '),
        subject: subject,
        text: body,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
}

export default {
    sendEmailAlert
  };