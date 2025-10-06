import { connectMDB } from "./config/mongoDB.js";
import app from "./config/server.js"
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;

await connectMDB()

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
