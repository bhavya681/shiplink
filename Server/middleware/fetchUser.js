import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const fetchUser = async (req, res, next) => {
  try {
    const token = req.header("auth-token");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authenticate using valid token" });
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = id;

    next();
  } catch (error) {
    console.error("JWT Authentication Error:", error);
    return res.status(401).json({
      success: false,
      message: "Authenticate Using a Valid JWT Token",
    });
  }
};

export default fetchUser;
