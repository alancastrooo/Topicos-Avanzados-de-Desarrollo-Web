import { Router } from "express";
import eventosRouter from "./eventosRouter.js";
import { Home } from "../controllers/apiController.js";
import usersRouter from "./usersRouter.js";

const apiRouter = Router();

apiRouter.get("/", Home);

apiRouter.use('/eventos', eventosRouter);
apiRouter.use('/usuarios', usersRouter)

export default apiRouter;
