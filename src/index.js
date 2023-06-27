import express from "express"
const app = express();
import "./db/database.js"
import userRouter from "./routes/usersRoutes.js"
import taskRouter from "./routes/tasksRoutes.js"

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
