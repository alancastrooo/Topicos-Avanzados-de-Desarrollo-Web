import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

// 🧱 Configuración del pool de conexiones
const mongoClient = new MongoClient(uri, {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
});

async function connectMDB() {
  try {
    await mongoClient.connect();

    // ✅ Obtiene la base de datos desde la URI
    const dbName = mongoClient.options.dbName;
    await mongoClient.db(dbName).command({ ping: 1 });

    console.log(
      `✅ Conectado correctamente a MongoDB -> Base de datos: ${dbName}`
    );
  } catch (err) {
    console.error("❌ Error al conectar con MongoDB:", err.message);
    process.exit(1);
  }
}

export { mongoClient, connectMDB };
