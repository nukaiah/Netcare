import admin from "../config/firebase.js";

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const token = authHeader.split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken; // contains uid, email, etc.
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Firebase token",
      error: error.message,
    });
  }
};
