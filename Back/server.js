import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js"; // Assuming you have this file

// --- Import Routes ---
import userRoutes from "./routes/userRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import deliveryAgentRoutes from "./routes/deliveryAgentRoutes.js";

// --- App Config ---
dotenv.config(); // Load environment variables from .env file
const app = express();
const port = process.env.PORT || 4000;

// --- Middleware ---
app.use(express.json()); // To parse JSON bodies
app.use(cors()); // To allow cross-origin requests

// --- DB Connection ---
connectDB();

// --- API Endpoints ---
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes); 
app.use("/api/orders", orderRoutes);
app.use("/api/delivery-agents", deliveryAgentRoutes);
app.use("/api/reviews", reviewRoutes); 


app.get("/", (req, res) => {
  res.send("SnapDish API is running...");
});

app.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`);
});