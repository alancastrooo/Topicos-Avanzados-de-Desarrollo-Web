import { Event } from "../models/eventModel.js";

// Obtener todos los eventos
export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    next(error)
  }
};

// Obtener un evento por id

export const getEventId = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id) || !id) {
      return res.status(400).json({ error: "El id debe ser un número válido" });
    }

    const evento = await Event.findOne({ id });

    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });
    res.status(200).json(evento);
  } catch (error) {
    next(error)
  }
};

// Crear un nuevo evento
export const createEvent = async (req, res, next) => {
  try {
    const { name, date } = req.body;
    if (!name || !date) {
      return res.status(400).json({ error: "Nombre y fecha son obligatorios" });
    }

    const nuevoEvento = new Event({ name, date });
    await nuevoEvento.save();

    res.status(201).json(nuevoEvento);
  } catch (error) {
    next(error)
  }
};

// Actualizar un evento existente
export const updateEvent = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || !id) {
      return res.status(400).json({ error: "El id debe ser un número válido" });
    }

    const { name, date } = req.body;
    if (!name || !date) {
      return res.status(400).json({ error: "Nombre y fecha son obligatorios" });
    }

    const eventoActualizado = await Event.findOneAndUpdate(
      { id },
      { name, date },
      { new: true }
    );

    if (!eventoActualizado) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    res.json(eventoActualizado);
  } catch (error) {
    next(error)
  }
};

// Eliminar un evento
export const deleteEvent = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || !id) {
      return res.status(400).json({ error: "El id debe ser un número válido" });
    }

    const eventoEliminado = await Event.findOneAndDelete({ id });

    if (!eventoEliminado) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    res.json({ mensaje: "Evento eliminado" });
  } catch (error) {
    next(error)
  }
};
