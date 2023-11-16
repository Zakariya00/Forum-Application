import express from "express";
import { register, login, logout} from "./controller/user.controller";

export const userRouter = express.Router();

/* User router */

// For registering a user
userRouter.post("/register", register);

// For logging in
userRouter.post("/login", login);

// For logging out
userRouter.delete("/logout", logout);
