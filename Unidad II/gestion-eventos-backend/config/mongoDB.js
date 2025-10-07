import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const uri = process.env.MONGO_URI;


const connectMDB = async () => { 
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log("Conectado a MongoDB ")
  } catch (error) {
    console.error("Error al conectar a MongoDB")
    process.exit(1)
  }
}


export default connectMDB;