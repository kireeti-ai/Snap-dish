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

    try {
        // Determine SMTP configuration based on environment variables
        // Supports Gmail, Outlook, or custom SMTP (like SendGrid, Mailgun, etc.)
        const smtpConfig = {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            // Longer timeouts for cloud platforms
            connectionTimeout: 30000, // 30 seconds
            greetingTimeout: 30000,
            socketTimeout: 60000,
            // Required for some cloud platforms
            tls: {
                rejectUnauthorized: false,
                minVersion: 'TLSv1.2'
            },
            // Debug logging in development
            debug: process.env.NODE_ENV === 'development',
            logger: process.env.NODE_ENV === 'development'
        };

        const transporter = nodemailer.createTransport(smtpConfig);

        // Verify connection before sending
        await transporter.verify();
        console.log('SMTP connection verified successfully');

        const mailOptions = {
            from: process.env.SMTP_FROM || `"SnapDish" <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.message,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email send failed:', error.message);
        console.error('Error code:', error.code);
        return { success: false, error: error.message };
    }
};

export default sendEmail;