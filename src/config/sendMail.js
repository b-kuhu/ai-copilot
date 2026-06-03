import {createTransport} from 'nodemailer';

const sendEmail = async(email, subject, html) => {
    const transport = createTransport({
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        },
        host: process.env.EMAIL_HOST,
    });
     await transport.sendMail({
        from : process.env.SMTP_USER,
        to: email,
        subject,
        html
     })
}
export default sendEmail;