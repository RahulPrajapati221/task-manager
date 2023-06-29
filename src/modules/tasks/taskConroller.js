import { successMess, errorMess, statusCodes } from "../../constant.js";
import {
  createT,
  getT,
  findById,
  validTask,
  upTask,
  findUser,
  delTask,
} from "./task-services.js";

const { success, created, succFound } = successMess;
const {
  successCode,
  createdCode,
  foundCode,
  badRequestCode,
  unauthorizedCode,
  notFoundCode,
  serverErrorCode,
} = statusCodes;

const {
  emailError,
  passError,
  ageError,
  badRequest,
  serverError,
  unauthorized,
  notFound,
} = errorMess;

export const getTasks = async (req, resp) => {
  const { match, limit, skip, sort } = getT(req.query);
  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: limit,
        skip: skip,
        sort,
      },
    });
    if (!req.user.task) {
      throw new Error(notFound);
    }
    resp
      .status(successCode)
      .send({ data: req.user.tasks, message: success });
  } catch (err) {
    resp.status(badRequestCode).send(badRequest);
  }
};

//Create new Task
export const createTask = async (req, resp) => {
  try {
    const task = {
      ...req.body,
      owner_id: req.user._id,
    };
    const nTask = await createT(task);
    resp
      .status(createdCode)
      .send({ data: nTask, message: created });
  } catch (err) {
    resp.status(badRequestCode).send(badRequest);
  }
};

//find Task using id
export const findTask = async (req, resp) => {
  try {
    const task = {
      _id: req.params.id,
      owner_id: req.user._id,
    };
    findById(task);
    if (!task) {
      return resp.status(notFoundCode).send(notFound);
    }
    resp.send({ data: task, message: succFound });
  } catch (err) {
    resp.status(serverErrorCode).send(serverError);
  }
};

//Update Task
export const updateTask = async (req, resp) => {
  const updates = Object.keys(req.body);
  const isValidOperation = validTask(updates);
  if (!isValidOperation) {
    return resp.status(badRequestCode).send(badRequest);
  }
  try {
    const _id = req.params.id;
    const task = await findUser(_id, req.user.id);

    if (!task) {
      return resp.status(notFoundCode).send(notFound);
    }
    const uTask = await upTask(task, updates, req.body);

    resp.send({ data: uTask, message: success });
  } catch (e) {
    resp.status(badRequestCode).send(badRequest);
  }
};

// Delete Task
export const deleteTask = async (req, resp) => {
  try {
    const task = await delTask(req.params.id, req.user._id);
    if (!task) {
      resp
        .status(badRequestCode)
        .send({ message: badRequest });
    }
    resp.status(successCode).send({ data: task, message: success });
  } catch (err) {
    resp.status(serverErrorCode).send(serverErrorCode);
  }
};
