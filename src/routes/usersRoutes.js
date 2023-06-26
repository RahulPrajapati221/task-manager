const express = require("express");
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const auth = require("../middleware/auth")
const router = new express.Router();



router.get("/users/me",auth, async (req, resp) => {
    try {
      resp.status(201).send(req.user);
    } catch (err) {
      resp.status(500).send(err);
    }
});


router.post("/user", async (req, resp) => {
    try {
      const user = await User.create(req.body);
      const token = await user.generateAuthToken()
      resp.status(201).send({user, token});
    } catch (err) {
      resp.status(400).send(err);
    }
});

// login user
router.post("/user/login", async (req, resp) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        resp.send({user, token})  
    } catch (err) {
      resp.status(400).send(err);
    }
});
  
// logout user
router.post("/user/logout",auth, async (req, resp) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
      })
     await req.user.save()
     resp.send()
  } catch (err) {
    resp.status(500).send(err);
  }
});

  
// logout user from all sessions
router.post("/user/logoutAll",auth, async (req, resp) => {
  try {
    req.user.tokens = []
     await req.user.save()
     resp.send()
  } catch (err) {
    resp.status(500).send(err);
  }
});


// // find user by user-id
// router.get("/user/:id", async (req, resp) => {
//     try {
//       const user = await User.findById({ _id: req.params.id });
//       if (!user) {
//         return resp.status(404).send();
//       }
//       resp.send(user);
//     } catch (err) {
//       resp.status(500).send(err);
//     }
// });
  

// update user
router.patch("/user/me",auth, async (req, resp) => {
      const updates = Object.keys(req.body)
      const allowedUpdates = ["name","email","password","age"]
      const isValidOperation  = updates.every((update)=>{
          return allowedUpdates.includes(update)
      })
      if(!isValidOperation){
          return resp.status(400).send({error:"Invalid updates"})
      }

    try {
        updates.forEach((update)=> req.user[update] = req.body[update])
        await req.user.save();
      if (!req.user) {
        return resp.status(404).send();
      }
      resp.send(req.user);
    } catch (err) {
      resp.status(500).send(err);
    }
});
  

// delete user
router.delete('/user/me',auth, async (req, res) => {
      try {
        //  const user= await User.findByIdAndDelete(req.user._id)
        await req.user.deleteOne()
        res.send(req.user)
      } catch (err) {
          res.status(500).send(err)
      }
  })

  
module.exports = router;