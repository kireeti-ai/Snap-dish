import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";
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
import adminRouter from './routes/adminRoutes.js';
import restaurantDashboardRouter from './routes/restaurantDashboardRoutes.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 4000;

// Create HTTP + Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // For dev; restrict in production
  }
});

// Create upload directories
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

app.use(express.json());

// CORS setup
const allowedOrigins = [
  "http://localhost:5174", "http://localhost:5173","http://localhost:5175",
  "https://snap-dish-xi.vercel.app", "https://snap-dish-qulq.vercel.app", "https://snap-dish-d5y5.vercel.app",
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
}));

// **CRITICAL FIX: Attach io to request object**
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Maximum size is 5MB' });
  }
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ success: false, message: 'Only image files are allowed' });
  }
  next(error);
});

// Routes
app.use('/images', express.static(path.join(__dirname, 'uploads')));
app.use("/api/address", addressRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/menu", menuItemRouter);
app.use("/api/order", orderRouter);
app.use('/api/creator-application', creatorApplicationRoutes);
app.use("/api/delivery", deliveryRouter);
app.use("/api/admin", adminRouter);

app.use("/api/restaurant/dashboard", restaurantDashboardRouter);
// Socket.io setup
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // When a delivery agent goes online
  socket.on('agentOnline', () => {
    socket.join('delivery_agents');
    console.log(`Agent ${socket.id} joined delivery_agents room`);
  });

  // When a user/agent wants to track a specific order
  socket.on('joinOrderRoom', (orderId) => {
    socket.join(orderId.toString());
    console.log(`Socket ${socket.id} joined order room: ${orderId}`);
  });

  // When a user/agent leaves an order room
  socket.on('leaveOrderRoom', (orderId) => {
    socket.leave(orderId.toString());
    console.log(`Socket ${socket.id} left order room: ${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

app.get("/", (req, res) => {
  res.send("SnapDish API is running...");
});

// Connect DB and start server
connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("DB Connection Failed:", err);
  });

export { io };