import User from "./user-model.js";
import { generateToken } from "../../utils/generateToken.js";

export const createUser = async (reqBody) => {
  const user = await User.create(reqBody);
  const token = await generateToken(user);
  return { user, token };
};

export const updateUserById = async (updates, user, reqBody) => {
  updates.forEach((update) => (user[update] = reqBody[update]));
  await user.save();
  return user;
};

export const findUser = async (email, password) => {
  const user = await User.findByCredentials(email, password);
  const token = await generateToken(user);
  return { user, token };
};

export const deleteUserById = async (user_id) => {
  await User.findOneAndDelete({
    _id: user_id,
  });
};
