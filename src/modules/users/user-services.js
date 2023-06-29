import User from "../../models/User.js";
import {generateToken} from "../../utils/generateToken.js"

export const createUser = async (reqBody) =>{
  const user = await User.create(reqBody);
  const token = await generateToken(user);
  return { user, token };
};

export const userLogin=(user) =>{
  const token = generateToken(user);
  return token;
}

export const validUpdate = (updates) =>{
  const allowedUpdates = ["name", "email", "password", "age"];

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  return isValidOperation;
}

export const upUser = async(updates, user, reqBody) =>{
  updates.forEach((update) => (user[update] = reqBody[update]));

  await user.save();

  return user;
}

export const findUser = async(email, password) =>{
  const user = await User.findByCredentials(email, password);
  const token = await userLogin(user);

  return { user, token };
}

export const delUser = async(requser_id) =>{
  await User.findOneAndDelete({
    _id: requser_id,
  });
}