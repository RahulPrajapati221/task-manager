import {
  createTask,
  getTask,
  findTaskById,
  updateTaskDetails,
  deleteTaskById,
} from "./task-services.js";
import {
  successMess,
  statusCodes,
  errorMess,
  constants,
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
    const Task = await findTaskById(task);
    if (!task) {
      return resp
        .status(statusCodes.notFoundCode)
        .send(errorMess.notFound(constants.task));
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

  const isValidOperation = validUpdate(updates, allowedUpdates);
  if (!isValidOperation) {
    return resp.status(statusCodes.badRequestCode).send(errorMess.badRequest);
  }
  try {
    const verifyId = {
      _id: req.params.id,
      owner_id: req.user._id,
    };
    const task = await findTaskById(verifyId);
    if (!task) {
      return resp
        .status(statusCodes.notFoundCode)
        .send(errorMess.notFound(constants.task));
    }
    const Task = await updateTaskDetails(task, updates, req.body);

    resp.send({ data: Task, message: successMess.success });
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
