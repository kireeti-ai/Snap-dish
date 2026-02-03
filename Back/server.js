import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from "./config/db.js";
import menuItemRouter from "./routes/menuItemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";
import orderRouter from './routes/orderRoute.js';
import addressRoutes from "./routes/addressRoutes.js";
import creatorApplicationRoutes from './routes/creatorApplicationRoutes.js';
import deliveryRouter from './routes/deliveryRoute.js';
import restaurantDashboardRouter from './routes/restaurantDashboardRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import {
  corsMiddleware,
  socketMiddleware,
  securityHeadersMiddleware,
  rateLimiter,
  errorHandlerMiddleware,
  cookieParser
} from './middleware/serverMiddleware.js';


dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;

app.set("trust proxy", 1);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "https://snap-dish-xi.vercel.app",
        "https://snap-dish-qulq.vercel.app",
        "https://snap-dish-d5y5.vercel.app",
        process.env.FRONTEND_URL
      ].filter(Boolean);

      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin matches allowed origins or is a Vercel preview URL
      if (allowedOrigins.includes(origin) || origin.match(/^https:\/\/snap-dish.*\.vercel\.app$/)) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});


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

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);
app.use(socketMiddleware(io));
app.use(securityHeadersMiddleware);
app.use('/api/', rateLimiter);
app.use(errorHandlerMiddleware);

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