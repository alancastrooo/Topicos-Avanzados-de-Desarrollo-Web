import { Router } from "express";
import { createUser, getUsers } from "../controllers/usersController.js";

const usersRouter = Router()

usersRouter.get('', getUsers);
usersRouter.post('', createUser);


export default usersRouter;