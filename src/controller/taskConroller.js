import Task from "../models/Task.js";


//get Tasks using filter,sort
export const getTasks = async (req, resp) => {
    const match = {};
    const sort = {};
    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }
  
    try {
      await req.user.populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort: {
            createdAt: -1,
          },
        },
      });
      resp.send(req.user.tasks);
    } catch (err) {
      resp.status(500).send(err);
    }
  }
  
//Create new Task
export const createTask = async (req, resp) => {
    try {
      const task = await Task.create({
        ...req.body,
        owner_id: req.user._id,
      });
      resp.status(201).send(task);
    } catch (err) {
      resp.status(400).send(err);
    }
  }
  
//find Task using id
export const findTask =async (req, resp) => {
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        creater: req.user._id,
      });
      if (!task) {
        return resp.status(404).send();
      }
      resp.send(task);
    } catch (err) {
      resp.status(500).send(err);
    }
  }
  
//Update Task
export const updateTask =async (req, resp) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return resp.status(400).send({ error: "Invalid updates" });
    }
  
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        owner_id: req.user._id,
      });
  
      if (!task) {
        return resp.status(404).send();
      }
      updates.forEach((update) => (task[update] = req.body[update]));
      await task.save();
      resp.send(task);
    } catch (err) {
      resp.status(500).send(err);
    }
  }
  
// Delete Task
export const deleteTask = async (req, resp) => {
    try {
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        owner_id: req.user._id,
      });
      if (!task) {
        resp.status(404);
      }
      resp.send(task);
    } catch (err) {
      resp.status(500).send(err);
    }
  }