import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    plate: { type: String, required: true },
    type: { type: String, required: true },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConsProject",
    },
    state: {
      type: String,
      enum: ["active", "inactive", "in maintenance"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model("Vehicle", VehicleSchema);
