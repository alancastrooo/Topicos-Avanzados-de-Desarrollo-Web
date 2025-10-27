import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskName: { type: String },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date },
  dueDate: { type: Date },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  tasks: { type: [taskSchema], default: [] },
});

export const Project = mongoose.model("Project", projectSchema);
