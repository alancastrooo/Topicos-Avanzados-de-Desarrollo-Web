// event.test.js
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../src/config/app.js";
import { Event } from "../src/models/eventModel.js";

let mongoServer;

beforeAll(async () => {
  // Desconecta cualquier conexión existente
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.connect(uri);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  // Limpia TODAS las colecciones, incluyendo la de counters del auto-increment
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("Event API", () => {
  // ========== CREATE EVENT ==========
  describe("POST /events", () => {
    it("Debe crear un evento correctamente", async () => {
      const res = await request(app)
        .post("/events")
        .send({
          name: "Conferencia de JavaScript",
          date: "2025-12-15"
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("id");
      expect(res.body.name).toBe("Conferencia de JavaScript");
      expect(res.body.date).toBeDefined();
    });

    it("Debe auto-incrementar el campo 'id' correctamente", async () => {
      const res1 = await request(app)
        .post("/events")
        .send({
          name: "Evento 1",
          date: "2025-12-15"
        });
      
      const res2 = await request(app)
        .post("/events")
        .send({
          name: "Evento 2",
          date: "2025-12-16"
        });
      
      const res3 = await request(app)
        .post("/events")
        .send({
          name: "Evento 3",
          date: "2025-12-17"
        });
      
      expect(res1.body.id).toBe(1);
      expect(res2.body.id).toBe(2);
      expect(res3.body.id).toBe(3);
    });

    it("Debe retornar error 400 si falta el campo 'name'", async () => {
      const res = await request(app)
        .post("/events")
        .send({
          date: "2025-12-15"
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("obligatorios");
    });

    it("Debe retornar error 400 si falta el campo 'date'", async () => {
      const res = await request(app)
        .post("/events")
        .send({
          name: "Evento sin fecha"
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("obligatorios");
    });

    it("Debe retornar error 400 si se envía un body vacío", async () => {
      const res = await request(app).post("/events").send({});
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("obligatorios");
    });

    it("Debe crear evento con fecha en formato ISO", async () => {
      const res = await request(app)
        .post("/events")
        .send({
          name: "Evento ISO",
          date: "2025-12-15T10:00:00.000Z"
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.date).toBeDefined();
    });

    it("Debe incluir timestamps (createdAt y updatedAt)", async () => {
      const res = await request(app)
        .post("/events")
        .send({
          name: "Evento con timestamps",
          date: "2025-12-15"
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("createdAt");
      expect(res.body).toHaveProperty("updatedAt");
    });
  });

  // ========== GET ALL EVENTS ==========
  describe("GET /events", () => {
    it("Debe retornar un array vacío si no hay eventos", async () => {
      const res = await request(app).get("/events");
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it("Debe listar todos los eventos ordenados por createdAt", async () => {
      await Event.create({ name: "Evento 1", date: "2025-12-15" });
      await Event.create({ name: "Evento 2", date: "2025-12-16" });
      await Event.create({ name: "Evento 3", date: "2025-12-17" });
      
      const res = await request(app).get("/events");
      
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body[0].name).toBe("Evento 1");
      expect(res.body[1].name).toBe("Evento 2");
      expect(res.body[2].name).toBe("Evento 3");
    });

    it("Debe incluir el campo 'id' auto-incrementado en cada evento", async () => {
      await Event.create({ name: "Evento A", date: "2025-12-15" });
      await Event.create({ name: "Evento B", date: "2025-12-16" });
      
      const res = await request(app).get("/events");
      
      expect(res.statusCode).toBe(200);
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[1]).toHaveProperty("id");
      expect(typeof res.body[0].id).toBe("number");
      expect(typeof res.body[1].id).toBe("number");
    });
  });

  // ========== GET EVENT BY ID ==========
  describe("GET /events/:id", () => {
    it("Debe obtener un evento por su id numérico", async () => {
      const event = await Event.create({
        name: "Evento Específico",
        date: "2025-12-15"
      });
      
      const res = await request(app).get(`/events/${event.id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(event.id);
      expect(res.body.name).toBe("Evento Específico");
    });

    it("Debe retornar error 400 si el id no es un número", async () => {
      const res = await request(app).get("/events/abc");
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("ID inválido o no proporcionado.");
    });

    it("Debe retornar error 400 si el id es 0", async () => {
      const res = await request(app).get("/events/0");
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("ID inválido o no proporcionado.");
    });

    it("Debe retornar error 400 si el id es negativo", async () => {
      const res = await request(app).get("/events/-5");
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("ID inválido o no proporcionado.");
    });

    it("Debe retornar error 404 si el evento no existe", async () => {
      const res = await request(app).get("/events/999");
      
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toContain("no encontrado");
    });

    it("Debe distinguir entre diferentes eventos por id", async () => {
      const event1 = await Event.create({ name: "Evento 1", date: "2025-12-15" });
      const event2 = await Event.create({ name: "Evento 2", date: "2025-12-16" });
      
      const res1 = await request(app).get(`/events/${event1.id}`);
      const res2 = await request(app).get(`/events/${event2.id}`);
      
      expect(res1.body.name).toBe("Evento 1");
      expect(res2.body.name).toBe("Evento 2");
      expect(res1.body.id).not.toBe(res2.body.id);
    });
  });

  // ========== UPDATE EVENT ==========
  describe("PUT /events/:id", () => {
    it("Debe actualizar un evento correctamente", async () => {
      const event = await Event.create({
        name: "Evento Original",
        date: "2025-12-15"
      });
      
      const res = await request(app)
        .put(`/events/${event.id}`)
        .send({
          name: "Evento Actualizado",
          date: "2025-12-20"
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(event.id);
      expect(res.body.name).toBe("Evento Actualizado");
    });

    it("Debe retornar error 400 si el id no es un número", async () => {
      const res = await request(app)
        .put("/events/abc")
        .send({
          name: "Evento",
          date: "2025-12-15"
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("ID inválido o no proporcionado.");
    });

    it("Debe retornar error 400 si falta el campo 'name'", async () => {
      const event = await Event.create({
        name: "Evento",
        date: "2025-12-15"
      });
      
      const res = await request(app)
        .put(`/events/${event.id}`)
        .send({
          date: "2025-12-20"
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("obligatorios");
    });

    it("Debe retornar error 400 si falta el campo 'date'", async () => {
      const event = await Event.create({
        name: "Evento",
        date: "2025-12-15"
      });
      
      const res = await request(app)
        .put(`/events/${event.id}`)
        .send({
          name: "Nuevo Nombre"
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("obligatorios");
    });

    it("Debe retornar error 404 si el evento no existe", async () => {
      const res = await request(app)
        .put("/events/999")
        .send({
          name: "Evento",
          date: "2025-12-15"
        });
      
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toContain("no encontrado");
    });

    it("No debe cambiar el id auto-incrementado al actualizar", async () => {
      const event = await Event.create({
        name: "Evento Original",
        date: "2025-12-15"
      });
      
      const originalId = event.id;
      
      const res = await request(app)
        .put(`/events/${event.id}`)
        .send({
          name: "Evento Actualizado",
          date: "2025-12-20"
        });
      
      expect(res.body.id).toBe(originalId);
    });

    it("Debe actualizar el timestamp 'updatedAt'", async () => {
      const event = await Event.create({
        name: "Evento",
        date: "2025-12-15"
      });
      
      const originalUpdatedAt = event.updatedAt;
      
      // Espera un poco para asegurar que el timestamp cambie
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const res = await request(app)
        .put(`/events/${event.id}`)
        .send({
          name: "Evento Actualizado",
          date: "2025-12-20"
        });
      
      expect(new Date(res.body.updatedAt).getTime()).toBeGreaterThan(
        new Date(originalUpdatedAt).getTime()
      );
    });
  });

  // ========== DELETE EVENT ==========
  describe("DELETE /events/:id", () => {
    it("Debe eliminar un evento correctamente", async () => {
      const event = await Event.create({
        name: "Evento a Eliminar",
        date: "2025-12-15"
      });
      
      const res = await request(app).delete(`/events/${event.id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Evento eliminado");
      
      // Verificar que realmente se eliminó
      const found = await Event.findOne({ id: event.id });
      expect(found).toBeNull();
    });

    it("Debe retornar error 400 si el id no es un número", async () => {
      const res = await request(app).delete("/events/abc");
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("ID inválido o no proporcionado.");
    });

    it("Debe retornar error 400 si el id es 0", async () => {
      const res = await request(app).delete("/events/0");
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("ID inválido o no proporcionado.");
    });

    it("Debe retornar error 404 si el evento no existe", async () => {
      const res = await request(app).delete("/events/999");
      
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toContain("no encontrado");
    });

    it("Debe eliminar solo el evento especificado", async () => {
      const event1 = await Event.create({ name: "Evento 1", date: "2025-12-15" });
      const event2 = await Event.create({ name: "Evento 2", date: "2025-12-16" });
      
      await request(app).delete(`/events/${event1.id}`);
      
      const allEvents = await Event.find();
      expect(allEvents.length).toBe(1);
      expect(allEvents[0].id).toBe(event2.id);
    });

    it("No debe afectar el auto-increment después de eliminar", async () => {
      const event1 = await Event.create({ name: "Evento 1", date: "2025-12-15" });
      await request(app).delete(`/events/${event1.id}`);
      
      const res = await request(app)
        .post("/events")
        .send({
          name: "Evento Nuevo",
          date: "2025-12-20"
        });
      
      // El nuevo evento debe tener id=2, no id=1
      expect(res.body.id).toBe(2);
    });
  });
});