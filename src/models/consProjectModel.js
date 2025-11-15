import mongoose from "mongoose";

const consProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    place: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    startDate: { type: Date },
    client: { type: String, required: true },
  },
  { timestamps: true }
);

export const ConsProject = mongoose.model("Cons-Project", consProjectSchema);
