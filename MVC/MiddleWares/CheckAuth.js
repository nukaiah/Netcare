import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();





export const checkAuth = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized request - No token" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized request - Token missing" });
    }
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verify._id;
    req.roleId = verify.roleId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized request",
      error: error.message,
    });
  }
};

