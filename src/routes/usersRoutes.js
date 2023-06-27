import express from "express";
import { auth } from "../middleware/auth.js";
import {createUser, 
        loginUser, 
        userProfile, 
        logOutUser, 
        logOutAll, 
        updateUser,
        deleteUser} from "../controller/userController.js" 
const router = new express.Router();


//Register user
router.post("/user", createUser);

//User profile
router.get("/users/me", auth, userProfile);

// login user
router.post("/user/login", loginUser);

// logout user
router.post("/user/logout", auth, logOutUser);

// logout user from all sessions
router.post("/user/logoutAll", auth,logOutAll);

// update user
router.patch("/user/me", auth, updateUser);

// delete user
router.delete("/user/me", auth, deleteUser);

export default router;
