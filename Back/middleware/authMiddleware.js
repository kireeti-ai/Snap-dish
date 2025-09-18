import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js"; // Fixed import

export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userModel.findById(decoded.id).select("-password");
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
      
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
};