import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("Auth Middleware is running for:", req.originalUrl);

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodeToken._id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Token has expired, please log in again." });
    }

   
  }
};
