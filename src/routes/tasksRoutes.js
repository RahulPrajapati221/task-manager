import express from "express";
import {getTasks, createTask, findTask, updateTask, deleteTask} from "../controller/taskConroller.js"
import { auth } from "../middleware/auth.js";
const router = new express.Router();

router.get("/tasks", auth, getTasks);

router.post("/tasks", auth, createTask);

router.get("/task/:id", auth, findTask);

router.patch("/task/:id", auth, updateTask);

router.delete("/task/:id", auth, deleteTask);

export default router;
