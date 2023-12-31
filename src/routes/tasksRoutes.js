import express from "express";
import {
  getTasks,
  createTasks,
  findTask,
  updateTask,
  deleteTask,
} from "../modules/tasks/taskController.js";
import { auth } from "../middleware/auth.js";
const router = new express.Router();

router.get("/myTasks", auth, getTasks);

router.post("/new", auth, createTasks);

router
  .route("/:id")
  .get(auth, findTask)
  .patch(auth, updateTask)
  .delete(auth, deleteTask);

export default router;
