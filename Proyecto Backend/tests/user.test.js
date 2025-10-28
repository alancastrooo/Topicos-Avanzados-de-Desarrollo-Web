// user.test.js
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../src/config/app.js";
import { User } from "../src/models/userModel.js";

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
  // Limpia TODAS las colecciones
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("User API", () => {
  // ========== CREATE USER ==========
  describe("POST /users", () => {
    it("Debe crear un usuario correctamente", async () => {
      const res = await request(app).post("/users").send({
        name: "Juan Pérez",
        email: "juan@example.com",
        age: 25,
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.name).toBe("Juan Pérez");
      expect(res.body.email).toBe("juan@example.com");
      expect(res.body.age).toBe(25);
    });

    it("Debe retornar error 400 si falta el campo 'name'", async () => {
      const res = await request(app).post("/users").send({
        email: "juan@example.com",
        age: 25,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("Faltan datos");
      expect(res.body.error).toContain("name");
    });

    it("Debe retornar error 400 si falta el campo 'email'", async () => {
      const res = await request(app).post("/users").send({
        name: "Juan Pérez",
        age: 25,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("Faltan datos");
      expect(res.body.error).toContain("email");
    });

    it("Debe retornar error 400 si falta el campo 'age'", async () => {
      const res = await request(app).post("/users").send({
        name: "Juan Pérez",
        email: "juan@example.com",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("Faltan datos");
      expect(res.body.error).toContain("age");
    });

    it("Debe retornar error 400 si se envía un body vacío", async () => {
      const res = await request(app).post("/users").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("Faltan datos");
    });

    it("Debe retornar error 400 si faltan múltiples campos", async () => {
      const res = await request(app).post("/users").send({ name: "Juan" });

      expect(res.statusCode).toBe(400);
    });

    it("Debe crear usuario con edad como número", async () => {
      const res = await request(app).post("/users").send({
        name: "María López",
        email: "maria@example.com",
        age: 30,
      });

      expect(res.statusCode).toBe(201);
      expect(typeof res.body.age).toBe("number");
      expect(res.body.age).toBe(30);
    });

    it("Debe crear usuario con edad como string numérico", async () => {
      const res = await request(app).post("/users").send({
        name: "Pedro García",
        email: "pedro@example.com",
        age: "28",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.age).toBe(28);
    });
  });

  // ========== GET ALL USERS ==========
  describe("GET /users", () => {
    it("Debe retornar un array vacío si no hay usuarios", async () => {
      const res = await request(app).get("/users");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it("Debe listar todos los usuarios", async () => {
      await User.create([
        { name: "Usuario 1", email: "user1@example.com", age: 20 },
        { name: "Usuario 2", email: "user2@example.com", age: 30 },
        { name: "Usuario 3", email: "user3@example.com", age: 40 },
      ]);

      const res = await request(app).get("/users");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
    });

    it("Debe retornar usuarios con todas sus propiedades", async () => {
      await User.create({
        name: "Ana Martínez",
        email: "ana@example.com",
        age: 25,
      });

      const res = await request(app).get("/users");

      expect(res.statusCode).toBe(200);
      expect(res.body[0]).toHaveProperty("_id");
      expect(res.body[0]).toHaveProperty("name");
      expect(res.body[0]).toHaveProperty("email");
      expect(res.body[0]).toHaveProperty("age");
      expect(res.body[0].name).toBe("Ana Martínez");
      expect(res.body[0].email).toBe("ana@example.com");
      expect(res.body[0].age).toBe(25);
    });

    it("Debe retornar usuarios en el orden correcto", async () => {
      await User.create({
        name: "Primer Usuario",
        email: "primero@example.com",
        age: 20,
      });
      await User.create({
        name: "Segundo Usuario",
        email: "segundo@example.com",
        age: 30,
      });

      const res = await request(app).get("/users");

      expect(res.statusCode).toBe(200);
      expect(res.body[0].name).toBe("Primer Usuario");
      expect(res.body[1].name).toBe("Segundo Usuario");
    });

    it("Debe retornar múltiples usuarios con datos diferentes", async () => {
      await User.create({
        name: "Joven",
        email: "joven@example.com",
        age: 18,
      });
      await User.create({
        name: "Adulto",
        email: "adulto@example.com",
        age: 45,
      });
      await User.create({
        name: "Senior",
        email: "senior@example.com",
        age: 70,
      });

      const res = await request(app).get("/users");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.map((u) => u.age)).toEqual([18, 45, 70]);
    });
  });
});
