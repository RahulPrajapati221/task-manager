const mongoose = require("mongoose");
const connectionURL = "mongodb://127.0.0.1:27017/task-manager"


//Datebase connection
mongoose.connect(connectionURL).then(()=>{
    console.log("Database connected")
}).catch((error)=>{
    console.log(error)
})


