import { Router } from "express";
import { createProject, deleteProject, getProjectById, getProjects, updateProject } from "../controllers/projectsController.js";

const projectsRouter = Router()

// api_url/projects
projectsRouter.post('', createProject) // crear un nuevo proyecto
projectsRouter.get('', getProjects) // obtener todos los proyectos
projectsRouter.get('/:id', getProjectById) // obtener proyecto por id
projectsRouter.put('/:id', updateProject) // actualizar proyecto por id
projectsRouter.delete('/:id', deleteProject) // eliminar proyecto por id

export default projectsRouter;