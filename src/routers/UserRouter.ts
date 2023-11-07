const express = require("express");
const UserRouter = express.Router();
const {
    loginController,
    onlineController
} = require("../controllers/UserController");

UserRouter.post("/login", loginController);
UserRouter.get("/online", onlineController);

export default UserRouter;
