import { Request, Response } from "express";
import { IUser } from "../database/Mongo/Models/UserModel";
import { pickRandom } from "../pictures";
import {
  createUser,
  getUserByName,
} from "../services/UserService";
import * as bcrypt from "bcrypt"; // Import bcrypt library
import * as jwt from "jsonwebtoken"; // Import jsonwebtoken library
// Load environment variables from .env file
import config from "../config";

async function loginController(req: Request, res: Response) {
  const { username, password } = req.body;

  try {
    let existingUser: IUser | null = await getUserByName(username);
    if (existingUser) {
      const passwordCorrect = await bcrypt.compare(password, existingUser.password);

      if (!passwordCorrect) {
        return res.status(400).json({ error: "Mot de passe incorrect" });
      }

      // Generate and sign a JWT token
      const token = jwt.sign({ userId: existingUser._id }, config.SECRET_KEY, {
        expiresIn: config.TOKEN_EXP,
      });

      return res.status(200).json({ user: existingUser, token });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const { user, error } = await createUser(username, hashedPassword, pickRandom());

      if (error) {
        return res.status(500).json({ error });
      }

      return res.status(201).json({ user });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function onlineController(req: Request, res: Response) {
  try {
    const onlineUsers = undefined; // Replace with your logic
    return res.status(200).json({ onlineUsers });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export { loginController, onlineController };
