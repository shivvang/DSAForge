import nodemailer from "nodemailer";
import logger from "../utils/logger.js";


const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // Use true for port 465
    auth: {
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS,
    },
});

/**
 * Sends an email to the specified recipient.
 * @param {string} toEmail - Recipient's email address.
 * @param {string} body - Email content in HTML format.
 */
export const sendMail = async (toEmail, body) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM_USER,
            to: toEmail,
            subject: "Chief, you're supposed to revise this problem!",
            html: body,
        });

        logger.info(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
        logger.error("Failed to send email:", error);
        console.log("now tell mw whats wrong in here",error)
    }
};