import { Router } from "express";
import { Home } from "../controllers/apiController.js";

import usersRouter from "./usersRouter.js";
import productsRouter from "./productsRouter.js";
import projectsRouter from "./projectsRouter.js";
import patientsRouter from "./patientsRouter.js";
import authRouter from "./authRouter.js";
import eventsRouter from "./eventsRouter.js";
import conProjectRouter from "./consProjectRouter.js";
import vehiclesRouter from "./vehiclesRouter.js";
import reportsRouter from "./reportsRouter.js";

const apiRouter = Router();

//  '/api'
apiRouter.get("/", Home);

apiRouter.use("/auth", authRouter);
apiRouter.use("/cons-projects", conProjectRouter);
apiRouter.use("/events", eventsRouter);
apiRouter.use("/patients", patientsRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/reports", reportsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/vehicles", vehiclesRouter);

export default apiRouter;
