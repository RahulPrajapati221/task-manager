const express = require("express");
const app = express();
require("./db/database");
const userRouter = require("./routes/usersRoutes")
const taskRouter = require("./routes/tasksRoutes")

const port =process.env.PORT || 3000;

// app.use((req, resp, next)=>{
//  if(req.method === "GET"){
//   resp.send("get request are disabled")
//  }else{
//   next()
//  }
  
// })


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
