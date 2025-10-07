import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
})

export const Usuario = mongoose.model("Usuario", usuarioSchema)