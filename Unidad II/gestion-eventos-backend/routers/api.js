import { Router } from "express";
import eventosRouter from "./eventsRouter.js";
import { Home } from "../controllers/apiController.js";
import usersRouter from "./usersRouter.js";

const apiRouter = Router();

apiRouter.get("/", Home);

apiRouter.use('/events', eventosRouter);
apiRouter.use('/users', usersRouter)

export default apiRouter;
