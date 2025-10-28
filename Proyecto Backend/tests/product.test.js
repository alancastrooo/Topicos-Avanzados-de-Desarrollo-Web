// product.test.js
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../src/config/app.js";
import { Product } from "../src/models/productModel.js";

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

describe("Product API", () => {
  // ========== CREATE PRODUCT ==========
  describe("POST /products", () => {
    it("Debe crear un producto correctamente", async () => {
      const res = await request(app).post("/products").send({
        name: "Laptop Dell",
        category: "Electrónica",
        price: 15000,
        stock: 10,
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.name).toBe("Laptop Dell");
      expect(res.body.category).toBe("Electrónica");
      expect(res.body.price).toBe(15000);
      expect(res.body.stock).toBe(10);
    });

    it("Debe retornar error 400 si falta el campo 'name'", async () => {
      const res = await request(app).post("/products").send({
        category: "Electrónica",
        price: 15000,
        stock: 10,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("obligatorios");
    });

    it("Debe retornar error 400 si falta el campo 'category'", async () => {
      const res = await request(app).post("/products").send({
        name: "Laptop",
        price: 15000,
        stock: 10,
      });

      expect(res.statusCode).toBe(400);
    });

    it("Debe retornar error 400 si falta el campo 'price'", async () => {
      const res = await request(app).post("/products").send({
        name: "Laptop",
        category: "Electrónica",
        stock: 10,
      });

      expect(res.statusCode).toBe(400);
    });

    it("Debe retornar error 400 si falta el campo 'stock'", async () => {
      const res = await request(app).post("/products").send({
        name: "Laptop",
        category: "Electrónica",
        price: 15000,
      });

      expect(res.statusCode).toBe(400);
    });

    it("Debe retornar error 400 si se envía un body vacío", async () => {
      const res = await request(app).post("/products").send({});

      expect(res.statusCode).toBe(400);
    });
  });

  // ========== GET ALL PRODUCTS ==========
  describe("GET /products", () => {
    it("Debe retornar un array vacío si no hay productos", async () => {
      const res = await request(app).get("/products");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it("Debe listar todos los productos", async () => {
      await Product.create([
        { name: "Mouse", category: "Accesorios", price: 200, stock: 50 },
      ]);
      await Product.create([
        { name: "Teclado", category: "Accesorios", price: 500, stock: 30 },
      ]);

      const res = await request(app).get("/products");

      console.log(res.body)

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0].name).toBe("Mouse");
      expect(res.body[1].name).toBe("Teclado");
    });
  });

  // ========== FIND PRODUCTS (find) ==========
  describe("GET /products/find", () => {
    beforeEach(async () => {
      await Product.create([
        { name: "Laptop HP", category: "Electrónica", price: 12000, stock: 5 },
        {
          name: "Laptop Dell",
          category: "Electrónica",
          price: 15000,
          stock: 3,
        },
        {
          name: "Mouse Logitech",
          category: "Accesorios",
          price: 300,
          stock: 20,
        },
        {
          name: "Teclado Mecánico",
          category: "Accesorios",
          price: 800,
          stock: 15,
        },
      ]);
    });

    it("Debe buscar productos por categoría", async () => {
      const res = await request(app)
        .get("/products/find")
        .query({ category: "Electrónica" });

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.every((p) => p.category === "Electrónica")).toBe(true);
    });

    it("Debe buscar productos por nombre", async () => {
      const res = await request(app)
        .get("/products/find")
        .query({ name: "Laptop" });

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.every((p) => p.name.includes("Laptop"))).toBe(true);
    });

    it("Debe buscar productos por nombre y categoría combinados", async () => {
      const res = await request(app)
        .get("/products/find")
        .query({ name: "Laptop", category: "Electrónica" });

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it("Debe ser case-insensitive en la búsqueda por categoría", async () => {
      const res = await request(app)
        .get("/products/find")
        .query({ category: "electrónica" });

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it("Debe ser case-insensitive en la búsqueda por nombre", async () => {
      const res = await request(app)
        .get("/products/find")
        .query({ name: "laptop" });

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it("Debe retornar array vacío si no encuentra coincidencias", async () => {
      const res = await request(app)
        .get("/products/find")
        .query({ name: "Xbox" });

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(0);
    });

    it("Debe retornar todos los productos si no se envían parámetros", async () => {
      const res = await request(app).get("/products/find");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(4);
    });
  });

  // ========== UPDATE PRODUCT ==========
  describe("PUT /products/:id", () => {
    it("Debe actualizar un producto correctamente", async () => {
      const product = await Product.create({
        name: "Viejo Nombre",
        category: "Vieja Categoría",
        price: 1000,
        stock: 5,
      });

      const res = await request(app).put(`/products/${product._id}`).send({
        name: "Nuevo Nombre",
        category: "Nueva Categoría",
        price: 2000,
        stock: 10,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("Nuevo Nombre");
      expect(res.body.category).toBe("Nueva Categoría");
      expect(res.body.price).toBe(2000);
      expect(res.body.stock).toBe(10);
    });

    it("Debe actualizar solo los campos enviados", async () => {
      const product = await Product.create({
        name: "Producto",
        category: "Categoría",
        price: 1000,
        stock: 5,
      });

      const res = await request(app)
        .put(`/products/${product._id}`)
        .send({ price: 2000 });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("Producto");
      expect(res.body.price).toBe(2000);
    });

    it("Debe retornar error 400 si el ID es inválido", async () => {
      const res = await request(app)
        .put("/products/id-invalido")
        .send({ name: "Nuevo" });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("inválido");
    });

    it("Debe retornar error 404 si el producto no existe", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/products/${fakeId}`)
        .send({ name: "Nuevo" });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toContain("no encontrado");
    });
  });

  // ========== DELETE PRODUCT ==========
  describe("DELETE /products/:id", () => {
    it("Debe eliminar un producto correctamente", async () => {
      const product = await Product.create({
        name: "A Borrar",
        category: "Test",
        price: 100,
        stock: 1,
      });

      const res = await request(app).delete(`/products/${product._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Producto eliminado correctamente");

      // Verificar que realmente se eliminó
      const found = await Product.findById(product._id);
      expect(found).toBeNull();
    });

    it("Debe retornar error 400 si el ID es inválido", async () => {
      const res = await request(app).delete("/products/id-invalido");

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("inválido");
    });

    it("Debe retornar error 404 si el producto no existe", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app).delete(`/products/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toContain("no encontrado");
    });
  });
});
