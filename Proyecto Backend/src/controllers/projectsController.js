import { validateProjectData } from "../helpers/validateRequest.js";
import { Project } from "../models/projectModel.js";

export const createProject = async (req, res, next) => {
  try {
    const errors = validateProjectData(req.body, false);

    if (errors.length > 0) {
      const err = new Error(errors.join(" \n"));
      err.statusCode = 400;
      throw err;
    }

    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (_req, res, next) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error("ID inválido o no proporcionado.");
      err.statusCode = 400;
      throw err;
    }

    const project = await Project.findById(id);

    if (!project) {
      const err = new Error("Proyecto no encontrado");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error("ID inválido o no proporcionado.");
      err.statusCode = 400;
      throw err;
    }

    const errors = validateProjectData(req.body, true);
    if (errors.length > 0) {
      const err = new Error(errors.join(" \n"));
      err.statusCode = 400;
      throw err;
    }

    const updatedProject = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      const err = new Error("Proyecto no encontrado");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido o no proporcionado." });
    }

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      const err = new Error("Proyecto no encontrado");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({ message: "Proyecto eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};
