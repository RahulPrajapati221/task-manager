import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const auth = async(req, resp, next)=>{
    try{
        const token = req.header("Authorization").replace("Bearer ","")
        const decoded = jwt.verify(token,"thisismykey")
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

