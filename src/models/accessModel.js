import mongoose from "mongoose";

const accessSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resource: { 
      type: String, 
      required: true,
      // enum: ["ConsProject", "Vehicle", "User"] // Los nombres de los modelos
    },
    resourceId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      refPath: "resource" // Esto hace la referencia dinámica
    },
    action: {
      type: String,
      enum: ["create", "retrieve", "update", "delete"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Access = mongoose.model("Access", accessSchema);