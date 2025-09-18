import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import restaurantRouter from "./routes/restaurantRoutes.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 4000;

// --- Middleware ---
app.use(express.json()); // To parse JSON bodies
app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`); // Add the port here
});


// --- DB Connection ---
connectDB();

// --- API Endpoints ---
app.use("/api/users", userRoutes);
app.use("/api/restaurant", restaurantRouter);



app.get("/", (req, res) => {
  res.send("SnapDish API is running...");
});
