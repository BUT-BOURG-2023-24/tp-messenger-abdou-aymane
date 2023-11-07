const jwt = require("jsonwebtoken");
import config from "./config";
import { Request, Response, NextFunction} from "express";


function checkAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Need a token!" });
  }
  try {
    const decodedToken = jwt.verify(token, config.SECRET_KEY);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      return res.status(401).json({ error: "Invalid token!" });
    }
  } catch (error) {
    return res.status(401).json({ error: "Expired token!" });
  }
  next();
}

module.exports = {
  checkAuth: checkAuth,
};
