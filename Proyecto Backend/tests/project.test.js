import request from "supertest";
import mongoose from "mongoose";

import app from "../src/config/app.js";
import { Project } from "../src/models/projectModel.js";

import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Limpia la colección entre pruebas
afterEach(async () => {
  await Project.deleteMany({});
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
    expect(res.statusCode).toBe(204);
  });
});
