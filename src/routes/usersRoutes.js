import express from "express";
import { auth } from "../middleware/auth.js";
import {
  registerUser,
  loginUser,
  userProfile,
  logOutUser,
  logOutAll,
  updateUser,
  deleteUser,
} from "../modules/users/userController.js";
const router = new express.Router();

//Register user
router.post("/register", registerUser);

//User profile
router
  .route("/me")
  .get(auth, userProfile)
  .patch(auth, updateUser)
  .delete(auth, deleteUser);

// login user
router.post("/login", loginUser);

// logout user
router.post("/logout", auth, logOutUser);

// logout user from all sessions
router.post("/logoutAll", auth, logOutAll);

export default router;
