const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//* Register User Logic
const signup = async (req, res) => {
  const { userName, email, password, } = req.body;

  try {
    const userExist = await User.findOne({ email });
    const userNameExist = await User.findOne({ userName });

    if (userExist) {
      return res.json({
        success: false,
        message: "User Already Exist !",
        description: "Try again with another Email",
      });
    }

    if (userNameExist) {
      return res.json({ success: false, message: "Try Another User Name !" });
    }

    const saltRound = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, saltRound);

    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Registeration Successfull !!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//* Login User Logic
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "User doesn't Exist !!",
      });
    }

    const checkPasswordValid = await bcrypt.compare(
      password,
      userExist.password,
    );

    if (!checkPasswordValid) {
      return res.status(400).json({ success: false, message: "Incorrect Password !" });
    }

    const token = jwt.sign(
      {
        id: userExist._id,
        email: userExist.email,
        userName: userExist.userName,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Logged In Successfully !",
      token,
      user: {
        email: userExist.email,
        id: userExist._id,
        userName: userExist.userName,
      },
    });
  } catch (error) {
    console.log(error, "Login Error");
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { signup, login };
