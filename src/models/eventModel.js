import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const eventSchema = new mongoose.Schema(
  {
    id: Number,
    name: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

// Inicializa el plugin con mongoose
eventSchema.plugin(AutoIncrement(mongoose), { inc_field: "id" });

export const Event = mongoose.model("Event", eventSchema);
