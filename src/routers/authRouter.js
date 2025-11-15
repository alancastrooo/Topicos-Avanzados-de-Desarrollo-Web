import { Router } from "express";
import { checkStatus, login, register } from "../controllers/authController.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/authValidators.js";
import { authenticateToken } from "../middlewares/auth.js";

const authRouter = Router();

// api_url/api/auth
authRouter.post("/login", loginValidator, login);
authRouter.post("/register", registerValidator, register);
authRouter.get("/check-status", authenticateToken, checkStatus);

export default authRouter;
