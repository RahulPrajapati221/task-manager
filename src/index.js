import express from "express"
import "./db/database.js"
import userRouter from "./routes/usersRoutes.js"
import taskRouter from "./routes/tasksRoutes.js"
const app = express();
const port =process.env.PORT || 3000;


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
