export function validateProjectData(data, isUpdate = false) {
    const errors = [];

    if (!isUpdate) {
        if (!data.title ||
            typeof data.title !== "string" ||
            data.title.trim() === "") {
            errors.push(
                "El campo 'title' es obligatorio y debe ser una cadena de texto."
            );
        }
        if (!data.description ||
            typeof data.description !== "string" ||
            data.description.trim() === "") {
            errors.push(
                "El campo 'description' es obligatorio y debe ser una cadena de texto."
            );
        }
    }

    if (data.title !== undefined &&
        (typeof data.title !== "string" || data.title.trim() === "")) {
        errors.push("El campo 'title' debe ser una cadena de texto válida.");
    }

    if (data.description !== undefined &&
        (typeof data.description !== "string" || data.description.trim() === "")) {
        errors.push("El campo 'description' debe ser una cadena de texto válida.");
    }

    if (data.startDate !== undefined &&
        Number.isNaN(Date.parse(data.startDate))) {
        errors.push("El campo 'startDate' debe ser una fecha válida.");
    }

    if (data.dueDate !== undefined && Number.isNaN(Date.parse(data.dueDate))) {
        errors.push("El campo 'dueDate' debe ser una fecha válida.");
    }

    if (data.status !== undefined &&
        !["Pending", "In Progress", "Completed"].includes(data.status)) {
        errors.push(
            "El campo 'status' solo puede ser 'Pending', 'In Progress' o 'Completed'."
        );
    }

    if (data.tasks !== undefined) {
        if (Array.isArray(data.tasks)) {
            data.tasks.forEach((task, index) => {
                if (typeof task === "object") {
                    if (!task.taskName ||
                        typeof task.taskName !== "string" ||
                        task.taskName.trim() === "") {
                        errors.push(
                            `La tarea en la posición ${index} debe tener un campo 'taskName' válido.`
                        );
                    }
                    if (task.completed !== undefined &&
                        typeof task.completed !== "boolean") {
                        errors.push(
                            `El campo 'completed' en la tarea ${index} debe ser un valor booleano.`
                        );
                    }
                } else {
                    errors.push(
                        `La tarea en la posición ${index} no es un objeto válido.`
                    );
                }
            });
        } else {
            errors.push("El campo 'tasks' debe ser un arreglo.");
        }
    }

    return errors;
}
