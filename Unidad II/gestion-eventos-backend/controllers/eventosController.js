let eventos = [
  { id: 1, nombre: "Concierto de Rock", fecha: "2024-07-10" },

  { id: 2, nombre: "Feria de Libros", fecha: "2024-08-05" },
];

// Obtener todos los eventos
export const getEventos = async (req, res) => {
  res.json(eventos);
};

// Obtener un evento por id

export const getEventoId = async (req, res) => {
  const id = parseInt(req.params.id);

  const evento = eventos.find((e) => e.id === id);

  if (!evento) {
    return res.status(404).json({ error: "Evento no encontrado" });
  }

  res.json(evento);
}

// Crear un nuevo evento

export const createEvento = async (req, res) => {
  const { nombre, fecha } = req.body;

  if (!nombre || !fecha) {
    return res.status(400).json({ error: "Nombre y fecha son obligatorios" });
  }

  const nuevoEvento = {
    id: eventos.length ? eventos[eventos.length - 1].id + 1 : 1,

    nombre,

    fecha,
  };

  eventos.push(nuevoEvento);

  res.status(201).json(nuevoEvento);
}

// Actualizar un evento existente

export const updateEvento = async (req, res) => {
  const id = parseInt(req.params.id);

  const eventoIndex = eventos.findIndex((e) => e.id === id);

  if (eventoIndex === -1) {
    return res.status(404).json({ error: "Evento no encontrado" });
  }

  const { nombre, fecha } = req.body;

  if (!nombre || !fecha) {
    return res.status(400).json({ error: "Nombre y fecha son obligatorios" });
  }

  eventos[eventoIndex] = { id, nombre, fecha };

  res.json(eventos[eventoIndex]);
}

// Eliminar un evento

export const deleteEvento = async (req, res) => {
  const id = parseInt(req.params.id);

  const eventoIndex = eventos.findIndex((e) => e.id === id);

  if (eventoIndex === -1) {
    return res.status(404).json({ error: "Evento no encontrado" });
  }

  eventos.splice(eventoIndex, 1);

  res.json({ mensaje: "Evento eliminado" });
}
