import { Router } from "express";
import { Home } from "../controllers/apiController.js";
import eventosRouter from "./eventsRouter.js";
import usersRouter from "./usersRouter.js";
import productsRouter from "./productsRouter.js";
import projectsRouter from "./projectsRouter.js";

const apiRouter = Router();

apiRouter.get("/", Home);

apiRouter.use('/events', eventosRouter);
apiRouter.use('/products', productsRouter)
apiRouter.use('/projects', projectsRouter)
apiRouter.use('/users', usersRouter)

export default apiRouter;
