import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('=== EMAIL DEBUG MODE (SMTP not configured) ===');
        console.log('To:', options.email);
        console.log('Subject:', options.subject);
        console.log('OTP/Message:', options.message);
        console.log('==============================================');
        // Return successfully for testing purposes when SMTP is not configured
        return { success: true, debug: true };
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use 'gmail' or your SMTP host
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
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