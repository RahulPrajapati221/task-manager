import {
  createTask,
  getTask,
  findTaskById,
  updateTaskDetails,
  findUser,
  deleteTaskById,
} from "./task-services.js";
import {
  successMess,
  statusCodes,
  errorMess,
  taskMsgs,
} from "../../constant.js";
import { validUpdate } from "../../utils/validateUpdate.js";

export const getTasks = async (req, resp) => {
  const taskGot = getTask(req.query);

  const { match, limit, skip, sort } = taskGot;
  const user = req.user;
  try {
    await user.populate({
      path: "tasks",
      match,
      options: {
        limit,
        skip,
        sort,
      },
    });
    const userTasks = req.user.tasks;
    resp
      .status(statusCodes.successCode)
      .send({ data: userTasks, message: successMess.success });
  } catch (err) {
    resp.status(statusCodes.badRequestCode).send(errorMess.badRequest);
  }
};

//Create new Task
export const createTasks = async (req, resp) => {
  try {
    const task = {
      ...req.body,
      owner_id: req.user._id,
    };
    const newTask = await createTask(task);
    resp
      .status(statusCodes.createdCode)
      .send({ data: newTask, message: successMess.created });
  } catch (err) {
    resp
      .status(statusCodes.statusCodes.badRequestCode)
      .send(errorMess.badRequest);
  }
};

//find Task using id
export const findTask = async (req, resp) => {
  try {
    const task = {
      _id: req.params.id,
      owner_id: req.user._id,
    };
    const Task = findTaskById(task);
    if (!task) {
      return resp
        .status(statusCodes.notFoundCode)
        .send(errorMess.notFound(taskMsgs.taskNotfound));
    }
    resp.send({ data: Task });
  } catch (err) {
    resp.status(statusCodes.serverErrorCode).send(serverError);
  }
};

//Update Task
export const updateTask = async (req, resp) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const updateField = { updates, allowedUpdates };

  const isValidOperation = validUpdate(updateField);
  if (!isValidOperation) {
    return resp.status(statusCodes.badRequestCode).send(errorMess.badRequest);
  }
  try {
    const _id = req.params.id;
    const task = await findUser(_id, req.user.id);

    if (!task) {
      return resp
        .status(statusCodes.notFoundCode)
        .send(errorMess.notFound(taskMsgs.taskNotfound));
    }
    const Task = await updateTaskDetails(task, updates, req.body);

    resp.send({ data: Task, message: success });
  } catch (e) {
    resp.status(statusCodes.badRequestCode).send(errorMess.badRequest);
  }
};

// Delete Task
export const deleteTask = async (req, resp) => {
  try {
    const task = await deleteTaskById(req.params.id, req.user._id);
    resp.status(statusCodes.successCode).send({ data: task });
  } catch (err) {
    resp.status(statusCodes.serverErrorCode).send(errorMess.serverError);
  }
};
