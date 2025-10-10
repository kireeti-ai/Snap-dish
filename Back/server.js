import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import { connectDB } from "./config/db.js";

// Import routes
import menuItemRouter from "./routes/menuItemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";
import orderRouter from './routes/orderRoute.js';
import addressRoutes from "./routes/addressRoutes.js";
import creatorApplicationRoutes from './routes/creatorApplicationRoutes.js';
import deliveryRouter from './routes/deliveryRoute.js';
import restaurantDashboardRouter from './routes/restaurantDashboardRoutes.js';
import adminRouter from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app and create HTTP server
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;

// Socket.io setup with security configurations
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL].filter(Boolean)
      : ["http://localhost:5174", "http://localhost:5173", "http://localhost:5175"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Directory creation utility
const createUploadDirs = () => {
  const dirs = [
    'uploads/avatars',
    'uploads/foods',
    'uploads/restaurants'
  ];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};
createUploadDirs();

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  "http://localhost:5174", 
  "http://localhost:5173",
  "http://localhost:5175",
  "https://snap-dish-xi.vercel.app", 
  "https://snap-dish-qulq.vercel.app", 
  "https://snap-dish-d5y5.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-TOKEN']
}));

// Attach io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Security middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Error handling middleware
app.use((error, req, res, next) => {
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
});

// Static files
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use("/api/address", addressRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/menu", menuItemRouter);
app.use("/api/order", orderRouter);
app.use('/api/creator-application', creatorApplicationRoutes);
app.use("/api/delivery", deliveryRouter);
app.use("/api/restaurant/dashboard", restaurantDashboardRouter);
app.use("/api/admin", adminRouter);

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Delivery agent management
  socket.on('agentOnline', () => {
    socket.join('delivery_agents');
    console.log(`Agent ${socket.id} joined delivery_agents room`);
  });

  // Order tracking
  socket.on('joinOrderRoom', (orderId) => {
    if (!orderId) return;
    socket.join(orderId.toString());
    console.log(`Socket ${socket.id} joined order room: ${orderId}`);
  });

  socket.on('leaveOrderRoom', (orderId) => {
    if (!orderId) return;
    socket.leave(orderId.toString());
    console.log(`Socket ${socket.id} left order room: ${orderId}`);
  });

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "healthy",
    message: "SnapDish API is running",
    version: process.env.npm_package_version || "1.0.0"
  });
});

// Database connection and server startup
const startServer = async () => {
  try {
    await connectDB();
    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

export { io };