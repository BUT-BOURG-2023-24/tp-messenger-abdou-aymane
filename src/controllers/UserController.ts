import { Request, Response } from "express";
import { IUser } from "../database/Mongo/Models/UserModel";
import { pickRandom } from "../pictures";
const jwt = require("jsonwebtoken");
import config from "../config";
import {
  createUser,
  getUserByName,
  getUsersByIds,
  getAllUsers,
} from "../services/UserService";

async function loginController(req: Request, res: Response) {
  const { username, password } = req.body; // Use req.body for POST requests
  try {
    let existingUser: IUser | null = await getUserByName(username);
    if (existingUser) {
      if (existingUser.password === password) {
        // Successful login
        const token = jwt.sign(
          { userId: existingUser._id },
          config.SECRET_KEY,
          { expiresIn: config.TOKEN_EXP }
        );
        res
          .status(200)
          .json({ user: existingUser, token: token, isNewUser: false });
      } else {
        // Incorrect password
        return res.status(400).json({ error: "Mot de passe incorrect" });
      }
    } else {
      const { user, error } = await createUser(
        username,
        password,
        pickRandom()
      );

      if (error) {
        // Error creating user
        return res.status(500).json({ error });
      }

      // Successful user creation
      if (user) {
        const token = jwt.sign({ userId: user._id }, config.SECRET_KEY, {
          expiresIn: config.TOKEN_EXP,
        });
        res.status(201).json({ user: user, token: token, isNewUser: false });
      }
    }
  } catch (error) {
    // Server error
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function onlineController(req: Request, res: Response) {
  try {
    const UsersOnline = req.app.locals.sockerController.SocketIdToUserId;
    const users = await getUsersByIds(UsersOnline);
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function allController(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export { loginController, onlineController, allController };
