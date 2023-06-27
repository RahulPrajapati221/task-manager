import User from "../models/User.js";

//Register user
 export const createUser = async (req, resp) => {
//   try {
    const user = await User.create(req.body);
    const token = await user.generateAuthToken();
    resp.status(201).send({ user, token });
//   } catch (err) {
//     resp.status(400).send(err);
//   }
}

// login user
export const loginUser = async (req, resp) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    resp.send({ user, token });
  } catch (err) {
    resp.status(400).send(err);
  }
}

//User profile
export const userProfile = async (req, resp) => {
    try {
      resp.status(201).send(req.user);
    } catch (err) {
      resp.status(500).send(err);
    }
  }

// logout user
export const logOutUser =  async (req, resp) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    resp.send();
  } catch (err) {
    resp.status(500).send(err);
  }
}

// logout user from all sessions
export const logOutAll =  async (req, resp) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    resp.send();
  } catch (err) {
    resp.status(500).send(err);
  }
}

// // find user by user-id
// export const findUser =  async (req, resp) => {
//     try {
//       const user = await User.findById({ _id: req.params.id });
//       if (!user) {
//         return resp.status(404).send();
//       }
//       resp.send(user);
//     } catch (err) {
//       resp.status(500).send(err);
//     }
// }

// update user
export const updateUser =  async (req, resp) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!isValidOperation) {
    return resp.status(400).send({ error: "Invalid updates" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    if (!req.user) {
      return resp.status(404).send();
    }
    resp.send(req.user);
  } catch (err) {
    resp.status(500).send(err);
  }
}

// delete user
export const deleteUser = async (req, resp) => {
  try {
    await req.user.deleteOne();
    resp.send(req.user);
  } catch (err) {
    resp.status(500).send(err);
  }
}

