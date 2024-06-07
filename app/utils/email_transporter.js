const nodemailer = require("nodemailer");
// run dotenv
require('dotenv').config()

const fs = require('fs');
const path = require('path');
const minuteExpired = process.env.OTP_EXPIRED // in minute

const getHtmlTemplate = async (otp, username) => {
    try {
        const templatePath = path.join(__dirname, '../../public/index.html'); // Correct path to index.html
        let html = fs.readFileSync(templatePath, 'utf8');
        html = html.replace('{{OTP}}', otp);
        html = html.replace('{{USERNAME}}', username);
        html = html.replace('{{MINUTES}}', minuteExpired);
        return html;
    } catch (error) {
        console.error('Error reading HTML template:', error);
        throw error;
    }
};

const sendOTPToEmail = async (email, otp, username) => {
    try {
        const htmlContent = await getHtmlTemplate(otp, username);

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        
        const mailOptions = {
            from: {
                name: "Glory Katri Putra",
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Password reset OTP',
            html: htmlContent,
        }

        await transporter.sendMail(mailOptions);
        console.log("email sent sucessfully");
        return
    } catch (error) {
        return error;
    }
};

module.exports = {sendOTPToEmail};