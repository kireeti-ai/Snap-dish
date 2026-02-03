import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('=== EMAIL DEBUG MODE ===');
        console.log('To:', options.email);
        console.log('Subject:', options.subject);
        console.log('Message:', options.message);
        console.log('=======================');
        return { success: true, debug: true };
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true, // IMPORTANT for cloud platforms
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

    return { success: true };
};

export default sendEmail;