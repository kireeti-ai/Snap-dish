import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import menuItemRouter from "./routes/menuItemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import fs from "fs";
import addressRoutes from "./routes/addressRoutes.js";
import multer from "multer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 4000;

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

const allowedOrigins = [
  "http://localhost:5174","http://localhost:5173",
  "https://snap-dish-xi.vercel.app","https://snap-dish-qulq.vercel.app","https://snap-dish-d5y5.vercel.app",
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

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB'
      });
    }
  }
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed'
    });
  }
  next(error);
});

app.use('/images', express.static(path.join(__dirname, 'uploads')));


app.use("/api/address", addressRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/menu", menuItemRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("SnapDish API is running...");
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(` Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error(" DB Connection Failed:", err);
  });