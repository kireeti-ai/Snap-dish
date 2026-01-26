import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use 'gmail' or your SMTP host
        auth: {
            user: process.env.SMTP_USER, // Add this to your .env file
            pass: process.env.SMTP_PASS, // Add this to your .env file
        },
    });

    const mailOptions = {
        from: `"SnapDish Security" <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;