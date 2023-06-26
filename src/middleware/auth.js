const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async(req, resp, next)=>{
    try{
        const token = req.header("Authorization").replace("Bearer ","")
        const decoded = jwt.verify(token,"thisismytoken")
        const user =await User.findOne({_id: decoded._id, "tokens.token": token})
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }catch(e){
        resp.status(401).send({error:"Please authenticate "})
    }
}

module.exports = auth