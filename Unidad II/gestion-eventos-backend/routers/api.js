import { Router } from "express";
import eventosRouter from "./eventosRouter.js";
import { Home } from "../controllers/apiController.js";

const apiRouter = Router();

apiRouter.get("/", Home);

apiRouter.use('/eventos', eventosRouter);

export default apiRouter;
