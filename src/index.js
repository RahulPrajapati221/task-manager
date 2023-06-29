import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./db/database.js"
import userRouter from "./routes/usersRoutes.js"
import taskRouter from "./routes/tasksRoutes.js"
const app = express();
const port =process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use("/users",userRouter);
app.use("/tasks",taskRouter);



app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
