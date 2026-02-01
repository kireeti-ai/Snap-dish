import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import multer from "multer";

// Allowed origins for CORS
const allowedOrigins = [
    "http://localhost:5174",
    "http://localhost:5173",
    "http://localhost:5175",
    "http://localhost:5176",
    "https://snap-dish-xi.vercel.app",
    "https://snap-dish-qulq.vercel.app",
    "https://snap-dish-d5y5.vercel.app",
    process.env.FRONTEND_URL
].filter(Boolean);

// CORS configuration
export const corsMiddleware = cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // Check if origin matches allowed origins or is a Vercel preview URL
        if (allowedOrigins.includes(origin) || origin.match(/^https:\/\/snap-dish.*\.vercel\.app$/)) {
            return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-TOKEN']
});

// Socket.io middleware - attaches io instance to request
export const socketMiddleware = (io) => (req, res, next) => {
    req.io = io;
    next();
};

// Security headers middleware
export const securityHeadersMiddleware = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
};

// Rate limiter
export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

// Error handling middleware
export const errorHandlerMiddleware = (error, req, res, next) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 5MB'
        });
    }
    if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({
            success: false,
            message: 'Only image files are allowed'
        });
    }
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
};

// Cookie parser middleware
export { cookieParser };
