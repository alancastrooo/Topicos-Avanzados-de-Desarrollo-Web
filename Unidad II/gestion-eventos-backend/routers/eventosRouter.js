import { Router } from "express";
import { createEvento, deleteEvento, getEventoId, getEventos, updateEvento } from "../controllers/eventosController.js";

const eventosRouter = Router()

eventosRouter.get('', getEventos);
eventosRouter.get('/:id', getEventoId);
eventosRouter.post('', createEvento);
eventosRouter.put('/:id', updateEvento);
eventosRouter.delete('/:id', deleteEvento);


export default eventosRouter;