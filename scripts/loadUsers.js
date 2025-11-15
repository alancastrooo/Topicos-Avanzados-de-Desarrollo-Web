import mongoose from "mongoose";
import { User } from "../src/models/userModel.js";
import { connectMongo } from "../src/config/mongoDB.js"; 

const users = [
  {
    name: "Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    isActive: true,
  },
  {
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    password: "analyst123",
    role: "analyst",
    isActive: true,
  },
  {
    name: "Carlos Ramírez",
    email: "carlos.ramirez@example.com",
    password: "visitor123",
    role: "visitor",
    isActive: true,
  },
];

async function seedUsers() {
  try {
    await connectMongo();

    // Limpiar colección de usuarios (opcional - comenta esta línea si no quieres borrar datos existentes)
    await User.deleteMany({});
    console.log("🗑️  Usuarios existentes eliminados");

    // Insertar usuarios
    const createdUsers = await User.insertMany(users);
    console.log(`✅ ${createdUsers.length} usuarios creados exitosamente`);

    // Mostrar usuarios creados
    console.log("\n📋 Usuarios creados:");
    createdUsers.forEach((user) => {
      console.log(`  - ${user.name} (${user.email}) - Rol: ${user.role}`);
    });

    console.log("\n🎉 Seed de usuarios completado!");
  } catch (error) {
    console.error("❌ Error al crear usuarios:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada");
  }
}

// Ejecutar el seed
seedUsers();
