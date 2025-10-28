// project.test.js
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../src/config/app.js";
import { Project } from "../src/models/projectModel.js";

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
  // Limpia TODAS las colecciones, incluyendo las de counters de mongoose-sequence
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("Project API", () => {
  it("Debe crear un proyecto (POST /projects)", async () => {
    const res = await request(app)
      .post("/projects")
      .send({
        title: "Proyecto Jest",
        description: "Proyecto de prueba con Jest",
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Proyecto Jest");
  });

  it("Debe retornar error si faltan campos obligatorios", async () => {
    const res = await request(app).post("/projects").send({});
    expect(res.statusCode).toBe(400);
  });

  it("Debe listar proyectos (GET /projects)", async () => {
    await Project.create({ title: "Test 1", description: "desc" });
    const res = await request(app).get("/projects");
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("Debe obtener un proyecto por ID", async () => {
    const project = await Project.create({
      title: "Test ID",
      description: "desc",
    });
    
    const res = await request(app).get(`/projects/${project._id}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Test ID");
  });

  it("Debe actualizar un proyecto (PUT /projects/:id)", async () => {
    const project = await Project.create({
      title: "Viejo",
      description: "desc",
    });
    
    const res = await request(app)
      .put(`/projects/${project._id}`)
      .send({ title: "Nuevo" });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Nuevo");
  });

  it("Debe eliminar un proyecto (DELETE /projects/:id)", async () => {
    const project = await Project.create({
      title: "A borrar",
      description: "desc",
    });
    
    const res = await request(app).delete(`/projects/${project._id}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Proyecto eliminado correctamente")
  });
});