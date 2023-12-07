import express from "express";
const UserRouter = express.Router();
const {
    loginController,
    onlineController,
    allController
} = require("../controllers/UserController");

import JoiValidator from "../middleware/joiValidator";

UserRouter.post("/login", JoiValidator, loginController);
UserRouter.get("/online", onlineController);
UserRouter.get("/all", allController);

export default UserRouter;
