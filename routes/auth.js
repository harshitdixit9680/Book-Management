const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

// router.post('/',(req,res)=>{
//     console.log(req.body)
//     const user = User(req.body)
//     user.save();
//     res.send(req.body)
// })

// Creating A User Using A : POST "api/auth/" . Doesn't Require Auth 


const JWT_SECRET = "HARSHITisagoodb$oy";
router.post(
  "/createuser",
  [
    body("name", "Enter a Valid Name").isLength({ min: 3 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password Atleast Must Be 5 Charcters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    // if they are errors , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(400).json({ success,errors: errors.array() });
    }

    // Check Whether The user with this Email Exits Already

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success,errors: "sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      // .then(user=>res.json(user))
      // .catch(err=>{console.log(err)
      // res.json({error : "Please Enter Unique Value For Email",message : err.message})
      // })

      // res.send({ errors: result.array() });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      // console.log(jwtData);
      // res.json(user)
      success = true;
      res.json({ success,authToken });
    } 
    // check the catch errors
    catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occured");
    }
  }
);



// 2. this is a Login For


router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
   let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({  success,error: "Please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success,authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);



//  Route 3 : Get Loggdin user Details using :  path 'http://localhost:5000/api/auth/getuser' login required
 router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;