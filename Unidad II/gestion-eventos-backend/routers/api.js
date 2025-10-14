import { Router } from "express";
import eventosRouter from "./eventsRouter.js";
import { Home } from "../controllers/apiController.js";
import usersRouter from "./usersRouter.js";
import productsRouter from "./productsRouter.js";

const apiRouter = Router();

apiRouter.get("/", Home);

apiRouter.use('/events', eventosRouter);
apiRouter.use('/users', usersRouter)
apiRouter.use('/products', productsRouter)

export default apiRouter;
