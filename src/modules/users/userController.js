import {
  createUser,
  findUser,
  updateUserById,
  deleteUserById,
} from "./user-services.js";
import { validUpdate } from "../../utils/validateUpdate.js";
import {
  successMess,
  errorMess,
  statusCodes,
  userMsgs,
} from "../../constant.js";

//Register user
export const registerUser = async (req, resp) => {
  try {
    const user = await createUser(req.body);
    resp
      .status(statusCodes.createdCode)
      .send({ data: user, message: successMess.created });
  } catch (err) {
    resp.status(statusCodes.serverErrorCode).send(errorMess.serverError);
  }
};

//User Login
export const loginUser = async (req, resp) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await findUser(email, password);
    resp
      .status(statusCodes.successCode)
      .send({ data: user, token, message: successMess.login });
  } catch (err) {
    resp
      .status(statusCodes.unauthorizedCode, loginError)
      .send(errorMess.badRequest);
  }
};

//User profile
export const userProfile = async (req, resp) => {
  try {
    resp.status(statusCodes.successCode).send({ data: req.user });
  } catch (err) {
    resp.status(statusCodes.serverErrorCode).send(errorMess.serverError);
  }
};

// logout user
export const logOutUser = async (req, resp) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    resp.status(statusCodes.successCode).send({ message: successMess.success });
  } catch (err) {
    resp.status(statusCodes.serverErrorCode).send(errorMess.serverError);
  }
};

// logout user from all sessions
export const logOutAll = async (req, resp) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    resp.status(statusCodes.successCode).send({ message: `${Logout}` });
  } catch (err) {
    resp.status(statusCodes.serverErrorCode).send(errorMess.serverError);
  }
};

// update user
export const updateUser = async (req, resp) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const updateField = { updates, allowedUpdates };

  const isValidOperation = validUpdate(updateField);
  if (!isValidOperation) {
    return resp
      .status(statusCodes.badRequestCode)
      .send({ message: errorMess.badRequest });
  }

  try {
    const user = req.user;
    if (!user) {
      return resp
        .status(statusCodes.notFoundCode)
        .send(errorMess.notFound(userMsgs.userNotfound));
    }
    const User = await updateUserById(updates, user, req.body);
    resp
      .status(statusCodes.createdCode)
      .send({ data: User, message: successMess.created });
  } catch (err) {
    resp.status(statusCodes.serverErrorCode).send(errorMess.serverError);
  }
};

// delete user
export const deleteUser = async (req, resp) => {
  try {
    deleteUserById(req.user._id);
    resp
      .status(statusCodes.successCode)
      .send({ data: req.user, message: success });
  } catch (err) {
    resp.status(statusCodes.serverErrorCode).send(errorMess.serverError);
  }
};
