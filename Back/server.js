import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import menuItemRouter from "./routes/menuItemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 4000;

// --- Middleware ---
app.use(express.json()); // Parse JSON bodies
const allowedOrigins = [
  "http://localhost:5173", // local dev
 // backend
  "https://snap-dish-xi.vercel.app",
   // replace with actual frontend
];

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

// --- Serve uploaded images ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API Routes ---
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/menu", menuItemRouter);
// --- Test Route ---
app.get("/", (req, res) => {
  res.send("SnapDish API is running...");
});

// --- Connect DB and start server ---
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Failed:", err);
  });
