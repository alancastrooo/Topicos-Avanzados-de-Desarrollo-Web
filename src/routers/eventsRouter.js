import { Router } from "express";
import { getEvents, getEventId, createEvent, updateEvent, deleteEvent } from "../controllers/eventsController.js";

const eventsRouter = Router()

// api_url/events
eventsRouter.get('', getEvents);
eventsRouter.get('/:id', getEventId);
eventsRouter.post('', createEvent);
eventsRouter.put('/:id', updateEvent);
eventsRouter.delete('/:id', deleteEvent);


export default eventsRouter;