import { Resend } from 'resend';

const sendEmail = async (options) => {
    // Debug mode if no API key is set
    if (!process.env.RESEND_API_KEY) {
        console.log('=== EMAIL DEBUG MODE (no RESEND_API_KEY set) ===');
        console.log('To:', options.email);
        console.log('Subject:', options.subject);
        console.log('Message:', options.message);
        console.log('================================================');
        return { success: true, debug: true };
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'SnapDish <onboarding@resend.dev>',
            to: options.email,
            subject: options.subject,
            html: options.message,
        });

        if (error) {
            console.error('Email send failed:', error.message);
            return { success: false, error: error.message };
        }

        console.log('Email sent successfully:', data.id);
        return { success: true, messageId: data.id };
    } catch (error) {
        console.error('Email send failed:', error.message);
        return { success: false, error: error.message };
    }
};

export default sendEmail;