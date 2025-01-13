import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "your-email@example.com", 
        pass: "your-password" 
    }
});


// Send Mail Function
const sendMail = async (fromUser, toUser, subject, body) => {
    try {
        await transporter.sendMail({
            from: fromUser,
            to: toUser,
            subject: subject,
            html: `<p><b>Problem Title:</b> ${body.problemTitle}</p>
                   <p><b>Problem Description:</b> ${body.problemDescription}</p>`
        });
        logger.info(`Email sent to ${toUser}`);
    } catch (error) {
        logger.error(`Failed to send email to ${toUser}: ${error.message}`);
    }
};
export default sendMail;