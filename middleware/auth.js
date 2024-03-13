import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const app = express();

app.use(express.urlencoded({ extended: true }));

dotenv.config();
const secret = process.env.SECRET;

export function authMiddleware(requiredRoles) {
  return (req, res, next) => {
    const token = req.session.token;
    if (!token) {
      res.status(401).json({ error: "Authentication error: Missing token" });
      return;
    }

    try {
      const decodedToken = jwt.verify(token, secret);
      const { userId, type } = decodedToken;

      if (!requiredRoles.includes(type)) {
        res.status(403).json({ error: "Authentication error: Unauthorized" });
        return;
      }

      req.userId = userId;
      req.type = type;
    } catch (err) {
      res
        .status(401)
        .json({ error: `Authentication error: Invalid token: ${err}` });
      return;
    }
    next();
  };
}
