import jwt from "jsonwebtoken";
import User from "../modules/users/user-model.js";
import { errorMess, constants } from "../constant.js";

export const auth = async (req, resp, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error(errorMess.notFound(constants.user));
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    resp.status(401).send({ error: errorMess.unauthorized });
  }
};
