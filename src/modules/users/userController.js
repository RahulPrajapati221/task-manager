import {createUser, 
        findUser, 
        validUpdate, 
        upUser, 
        delUser} from "./user-services.js"
import { successMess, errorMess, statusCodes } from "../../constant.js";

const {
  success,
  succFound,
  login,
  Logout,
  created
}=successMess;

const {
  successCode,
  createdCode,
  foundCode,
  badRequestCode,
  unauthorizedCode,
  notFoundCode,
  serverErrorCode,
} = statusCodes;

const {
  loginError,
  badRequest,
  serverError,
  unauthorized,
  notFound,
} = errorMess;



//Register user
 export const registerUser = async (req, resp) => {
  try {
    const user =await createUser(req.body)
    resp.status(createdCode)
    .send({data:user ,message:created});
  } catch (err) {
    resp.status(serverErrorCode)
    .send(serverError);
  }
}

// login user
export const loginUser = async (req, resp) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await findUser(email, password);
    resp.status(successCode)
    .send({data: user, token, message: login})
  } catch (err) {
    resp.status(unauthorizedCode, loginError)
    .send(badRequest);
  }
}

//User profile
export const userProfile = async (req, resp) => {
    try {
      resp.status(foundCode)
      .send({data:req.user ,message:succFound});
    } catch (err) {
      resp.status(serverErrorCode)
      .send(serverError);
    }
  }

// logout user
export const logOutUser =  async (req, resp) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    resp.status(successCode).send({message: success});
  } catch (err) {
    resp.status(serverErrorCode).send(serverError);
  }
}

// logout user from all sessions
export const logOutAll =  async (req, resp) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    resp.status(successCode)
    .send({message: `${Logout}`});
  } catch (err) {
    resp.status(serverErrorCode)
    .send(serverError);
  }
}


// update user
export const updateUser =  async (req, resp) => {
  const updates = Object.keys(req.body);
  const isValidOperation = validUpdate(updates);
  if (!isValidOperation) {
    return resp.status(badRequestCode)
    .send({ message:badRequest });
  }

  try {
    const user = req.user
    if (!user) {
      return resp.status(badRequestCode)
      .send(badRequest);
    }
    const User = await upUser(updates, user, req.body);
    resp.status(createdCode)
    .send({ data: User, message:created});
  } catch (err) {
    resp.status(serverErrorCode)
    .send(serverError);
  }
}

// delete user
export const deleteUser = async (req, resp) => {
  try {
    delUser(req.user._id);
    resp.status(successCode)
    .send({ data: req.user, message:success });
  } catch (err) {
    resp.status(serverErrorCode)
    .send(serverErrorCode);
  }
}

