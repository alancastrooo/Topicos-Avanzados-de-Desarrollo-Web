import { Router } from "express";
import { createUser, getUsers } from "../controllers/usersController.js";
import { authenticateToken, verifyAdmin } from "../middlewares/auth.js";

const usersRouter = Router()

// api_url/api/users
usersRouter.get('', authenticateToken, verifyAdmin, getUsers);
usersRouter.post('', authenticateToken, verifyAdmin, createUser);


export default usersRouter;