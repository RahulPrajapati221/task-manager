const express = require("express");
const app = express();
const User = require("./models/User");
const Task = require("./models/Task");
require("./db/database");

const port = 3000;

app.use(express.json());

//user-routes
app.get("/users", async (req, resp) => {
  try {
    const users = await User.find();
    resp.status(201).send(user);
  } catch (err) {
    resp.status(500).send(err);
  }
});

app.post("/user", async (req, resp) => {
  try {
    const user = await User.create(req.body);
    resp.status(201).send(user);
  } catch (err) {
    resp.status(400).send(err);
  }
});

// find user by user-id
app.get("/user/:id", async (req, resp) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      return resp.status(404).send();
    }
    resp.send(user);
  } catch (err) {
    resp.status(500).send(err);
  }
});

// update user
app.patch("/user/:id", async (req, resp) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name","email","password","age"]
    const isValidOperation  = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return resp.status(400).send({error:"Invalid updates"})
    }


  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return resp.status(404).send();
    }
    resp.send(user);
  } catch (err) {
    resp.status(500).send(err);
  }
});

// delete user
app.delete('/user/:id', async (req, res) => {
    try {
       const user= await User.findByIdAndDelete(req.params.id)
        res.send(user)
    } catch (err) {
        res.status(500).send(err)
    }
})



//Task-routes
app.get("/tasks", async (req, resp) => {
  try {
    const tasks = await Task.find();
    resp.send(tasks);
  } catch (err) {
    resp.send(err);
  }
});

app.post("/tasks", async (req, resp) => {
  try {
    const task = await Task.create(req.body);
    resp.status(201).send(task);
  } catch (err) {
    resp.status(400).send(err);
  }
});

// find Task by task-id
app.get("/task/:id", async (req, resp) => {
  try {
    const task = Task.findById({ _id: req.params.id });
    if (!task) {
      return resp.status(404).send();
    }
    resp.send(task);
  } catch (err) {
    resp.status(500).send(err);
  }
});

// update tasks
app.patch("/task/:id", async (req, resp) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description","completed"]
    const isValidOperation  = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return resp.status(400).send({error:"Invalid updates"})
    }


  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return resp.status(404).send();
    }
    resp.send(task);
  } catch (err) {
    resp.status(500).send(err);
  }
});

// delete Task 
app.delete('/task/:id', async (req, res) => {
    try {
       const task= await Task.findByIdAndDelete(req.params.id)
        res.send(task)
    } catch (err) {
        res.status(500).send(err)
    }
})


app.listen(port, () => {
  console.log("server running on port "+port);
});
