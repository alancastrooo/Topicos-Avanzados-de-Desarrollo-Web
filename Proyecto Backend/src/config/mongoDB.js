import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

export const connectMongo = async () => {
  try {
    await mongoose
      .connect(mongoUri, {})
      .then(() => console.log("Conectado a MongoDB ✔️"));
  } catch (error) {
    console.error(`Error de conexión ❌\n${error}`);
    process.exit(1);
  }
};
