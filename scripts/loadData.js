import mongoose from "mongoose";
import { connectMongo } from "../src/config/mongoDB.js"; 
import { User } from "../src/models/userModel.js";
import { ConsProject } from "../src/models/consProjectModel.js";
import { Vehicle } from "../src/models/vehicleModel.js";
import { Access } from "../src/models/accessModel.js";

async function seedData() {
  try {
    await connectMongo();

    // Verificar que existan usuarios
    const users = await User.find({});
    if (users.length === 0) {
      console.error(
        "❌ No hay usuarios en la base de datos. Ejecuta primero seedUsers.js"
      );
      process.exit(1);
    }
    console.log(`✅ Encontrados ${users.length} usuarios`);

    // Limpiar colecciones (opcional)
    await ConsProject.deleteMany({});
    await Vehicle.deleteMany({});
    await Access.deleteMany({});
    console.log("🗑️  Datos existentes eliminados");

    // ========== CREAR PROYECTOS ==========
    const ConsProjects = [
      {
        name: "Construcción Torre Corporativa",
        place: "Ciudad de México, CDMX",
        status: "In Progress",
        startDate: new Date("2024-01-15"),
        client: "Corporativo XYZ S.A. de C.V.",
      },
      {
        name: "Remodelación Centro Comercial",
        place: "Guadalajara, Jalisco",
        status: "In Progress",
        startDate: new Date("2024-03-10"),
        client: "Inversiones Mall SA",
      },
      {
        name: "Edificio Residencial Las Palmas",
        place: "Monterrey, Nuevo León",
        status: "Completed",
        startDate: new Date("2023-06-01"),
        client: "Desarrollos Inmobiliarios Norte",
      },
      {
        name: "Puente Vehicular Norte",
        place: "Querétaro, Querétaro",
        status: "Pending",
        startDate: new Date("2024-12-01"),
        client: "Gobierno del Estado de Querétaro",
      },
      {
        name: "Planta Industrial Automotriz",
        place: "Aguascalientes, Aguascalientes",
        status: "In Progress",
        startDate: new Date("2024-02-20"),
        client: "AutoParts International",
      },
    ];

    const createdConsProjects = await ConsProject.insertMany(ConsProjects);
    console.log(`✅ ${createdConsProjects.length} proyectos creados`);

    // ========== CREAR VEHÍCULOS ==========
    const vehicles = [
      {
        plate: "ABC-123-XY",
        type: "Camión de volteo",
        ConsProject: createdConsProjects[0]._id,
        state: "active",
      },
      {
        plate: "DEF-456-ZW",
        type: "Retroexcavadora",
        ConsProject: createdConsProjects[0]._id,
        state: "active",
      },
      {
        plate: "GHI-789-UV",
        type: "Grúa torre",
        ConsProject: createdConsProjects[1]._id,
        state: "in maintenance",
      },
      {
        plate: "JKL-012-ST",
        type: "Camión mezclador",
        ConsProject: createdConsProjects[1]._id,
        state: "active",
      },
      {
        plate: "MNO-345-QR",
        type: "Montacargas",
        ConsProject: createdConsProjects[2]._id,
        state: "inactive",
      },
      {
        plate: "PQR-678-OP",
        type: "Bulldozer",
        ConsProject: createdConsProjects[4]._id,
        state: "active",
      },
      {
        plate: "STU-901-NM",
        type: "Camioneta pickup",
        ConsProject: createdConsProjects[4]._id,
        state: "active",
      },
      {
        plate: "VWX-234-KL",
        type: "Excavadora",
        ConsProject: createdConsProjects[0]._id,
        state: "active",
      },
    ];

    const createdVehicles = await Vehicle.insertMany(vehicles);
    console.log(`✅ ${createdVehicles.length} vehículos creados`);

    // ========== CREAR REGISTROS DE ACCESO ==========
    const accesses = [];

    // Generar accesos de ejemplo para diferentes usuarios
    for (let i = 0; i < users.length && i < 3; i++) {
      const user = users[i];

      // Accesos a proyectos (usa "ConsProject" que es el nombre del modelo)
      accesses.push({
        user: user._id,
        resource: "Cons-Project",
        resourceId: createdConsProjects[i % createdConsProjects.length]._id,
        action: "retrieve",
      });

      accesses.push({
        user: user._id,
        resource: "Cons-Project",
        resourceId:
          createdConsProjects[(i + 1) % createdConsProjects.length]._id,
        action: "update",
      });

      // Accesos a vehículos
      accesses.push({
        user: user._id,
        resource: "Vehicle",
        resourceId: createdVehicles[i % createdVehicles.length]._id,
        action: "retrieve",
      });
    }

    // Accesos adicionales para el admin
    if (users.length > 0) {
      const admin = users.find((u) => u.role === "admin") || users[0];

      accesses.push({
        user: admin._id,
        resource: "Cons-Project",
        resourceId: createdConsProjects[0]._id,
        action: "create",
      });

      accesses.push({
        user: admin._id,
        resource: "Vehicle",
        resourceId: createdVehicles[0]._id,
        action: "delete",
      });

      // Acceso a un usuario
      accesses.push({
        user: admin._id,
        resource: "User",
        resourceId: users[1]._id,
        action: "retrieve",
      });
    }

    const createdAccesses = await Access.insertMany(accesses);
    console.log(`✅ ${createdAccesses.length} registros de acceso creados`);

    // ========== RESUMEN ==========
    console.log("\n📊 RESUMEN DE DATOS CREADOS:");
    console.log(`  • Proyectos: ${createdConsProjects.length}`);
    console.log(`  • Vehículos: ${createdVehicles.length}`);
    console.log(`  • Registros de acceso: ${createdAccesses.length}`);

    console.log("\n📋 Proyectos por estado:");
    const pending = createdConsProjects.filter(
      (p) => p.status === "Pending"
    ).length;
    const inProgress = createdConsProjects.filter(
      (p) => p.status === "In Progress"
    ).length;
    const completed = createdConsProjects.filter(
      (p) => p.status === "Completed"
    ).length;
    console.log(`  • Pendientes: ${pending}`);
    console.log(`  • En progreso: ${inProgress}`);
    console.log(`  • Completados: ${completed}`);

    console.log("\n🚗 Vehículos por estado:");
    const active = createdVehicles.filter((v) => v.state === "active").length;
    const inactive = createdVehicles.filter(
      (v) => v.state === "inactive"
    ).length;
    const maintenance = createdVehicles.filter(
      (v) => v.state === "in maintenance"
    ).length;
    console.log(`  • Activos: ${active}`);
    console.log(`  • Inactivos: ${inactive}`);
    console.log(`  • En mantenimiento: ${maintenance}`);

    console.log("\n🎉 Seed de datos completado exitosamente!");
  } catch (error) {
    console.error("❌ Error al crear datos:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada");
  }
}

seedData();
