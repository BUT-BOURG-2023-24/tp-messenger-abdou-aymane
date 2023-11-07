import express from "express";
const UserRouter = express.Router();
const {
    loginController,
    onlineController,
    allController
} = require("../controllers/UserController");

UserRouter.post("/login", loginController);
UserRouter.get("/online", onlineController);
UserRouter.get("/all", allController);

export default UserRouter;
