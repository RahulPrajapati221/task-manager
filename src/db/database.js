import mongoose from "mongoose";

//Datebase connection
export const connectDB = () => {
  mongoose
    .connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology:true, })
    .then((data) => console.log(`mongodb connected with server : ${data.connection.host}`))
    .catch((e) => console.log(e));
};
