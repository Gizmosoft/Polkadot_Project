import express from "express";
import * as authController from "../controllers/auth.js";

const authRouter = express.Router();

authRouter
    .route("/login")
    .get(authController.userLogin)

export default authRouter;