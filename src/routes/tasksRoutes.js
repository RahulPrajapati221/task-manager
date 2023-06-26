const express = require("express");
const Task = require("../models/Task")
const auth = require("../middleware/auth")
const router = new express.Router();


router.get("/tasks", auth, async (req, resp) => {
    // try {
      await req.user.populate("task").execPopulate()
      resp.send(req.user.tasks);
    // } catch (err) {
    //   resp.status(500).send(err);
    // }
  });
  
router.post("/tasks",auth, async (req, resp) => {
    try {
      const task = await Task.create({
          ...req.body,
          creater: req.user._id
      });
      resp.status(201).send(task);
    } catch (err) {
      resp.status(400).send(err);
    }
  });
  
  // find Task by task-id
router.get("/task/:id", auth, async (req, resp) => {
    try {
      const task =await Task.findOne({  _id:req.params.id, creater: req.user._id });
      if (!task) {
        return resp.status(404).send();
      }
      resp.send(task);
    } catch (err) {
      resp.status(500).send(err);
    }
  });
  
  // update tasks
router.patch("/task/:id", async (req, resp) => {
      const updates = Object.keys(req.body)
      const allowedUpdates = ["description","completed"]
      const isValidOperation  = updates.every((update)=>{
          return allowedUpdates.includes(update)
      })
      if(!isValidOperation){
          return resp.status(400).send({error:"Invalid updates"})
      }
  
  
    try {
      const task = await Task.findById(req.params.id)
      
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

      if (!task) {
        return resp.status(404).send();
      }
      resp.send(task);
    } catch (err) {
      resp.status(500).send(err);
    }
  });
  
  // delete Task 
router.delete('/task/:id', async (req, res) => {
      try {
         const task= await Task.findByIdAndDelete(req.params.id)
          res.send(task)
      } catch (err) {
          res.status(500).send(err)
      }
  })
  
  
module.exports = router;