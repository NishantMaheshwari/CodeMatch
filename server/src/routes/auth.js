const express = require("express");
const authRouter = express.Router();
const User = require("../Models/user");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { validateSignupData } = require("../utils/validation");

//signup api for signing the user
authRouter.post("/signup", async (req, res) => {
  try {
    //Validate the data
    validateSignupData(req);
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      about,
      skills,
    } = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const checkEmail=await User.findOne({emailId});
    console.log(checkEmail)
    if(checkEmail){
      throw new Error("Email Already Exist")
    }


    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      about,
      skills,
    });
    const savedUser = await user.save();
    const token = await savedUser.getjwt();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res
      .status(200)
      .json({ message: "User added successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

authRouter.post('/signupBulk', async (req, res) => {
  try {
    const usersArray = req.body.users; // Expect: { users: [ {firstName, lastName, ...}, ... ] }

    if (!Array.isArray(usersArray) || usersArray.length === 0) {
      return res.status(400).json({ error: "Users array is required" });
    }

    const savedUsers = [];

    for (const userData of usersArray) {
      const { firstName, lastName, emailId, password, age, gender, about, skills, photoUrl } = userData;

      // Skip if email already exists
      const existingUser = await User.findOne({ emailId });
      if (existingUser) continue;

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
        age,
        gender,
        about,
        skills,
        photoUrl
      });

      const savedUser = await newUser.save();
      savedUsers.push(savedUser);
    }

    res.status(201).json({
      message: `${savedUsers.length} users added successfully`,
      data: savedUsers,
    });
  } catch (err) {
    console.error("Bulk signup error:", err);
    res.status(500).json({ error: err.message });
  }
});


authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Email");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).json({ user });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("User Logged out successfully");
});

module.exports = authRouter;