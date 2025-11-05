import { Router } from "express";
import { Home } from "../controllers/apiController.js";
import eventosRouter from "./eventsRouter.js";
import usersRouter from "./usersRouter.js";
import productsRouter from "./productsRouter.js";
import projectsRouter from "./projectsRouter.js";
import patientsRouter from "./patientsRouter.js";
import authRouter from "./authRouter.js";

const apiRouter = Router();

apiRouter.get("/", Home);

apiRouter.use('/auth', authRouter);
apiRouter.use('/events', eventosRouter);
apiRouter.use('/patients', patientsRouter)
apiRouter.use('/products', productsRouter)
apiRouter.use('/projects', projectsRouter)
apiRouter.use('/users', usersRouter)

export default apiRouter;
