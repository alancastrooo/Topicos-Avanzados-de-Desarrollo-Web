import { connectMongo } from "./config/mongoDB.js";
import app from "./config/app.js"
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;


await connectMongo();

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
