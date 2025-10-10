import csrf from 'csurf';
import { Router } from 'express';

const csrfProtection = csrf({ 
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }
});

const router = Router();

// Apply CSRF protection to all admin routes
router.use('/api/admin/*', csrfProtection);

// Provide CSRF token
router.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Error handler for CSRF errors
router.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).json({
            success: false,
            message: 'Invalid CSRF token'
        });
    } else {
        next(err);
    }
});

export default router;