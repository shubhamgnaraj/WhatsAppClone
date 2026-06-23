import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const existUser = await User.findOne({ email });

    if (existUser) {
      res.status(400).json({ message: "user already exist in the DB" });
    }

    const user = await User.create({
      userName,
      email,
      password,
      userPhoto: "123abc"
    });

    const token = jwt.sign({ id: user._id }, "JWT-SECRET");

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(200).json({ message: "user was created suceessfylly", user });
  } catch (error) {
    res.status(400).json({ message: `Authentication errro: ${error.message}` });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });

    if (!userExist)
      return res.status(400).json({ message: "User Not exist pls register" });

    const token = jwt.sign({ id: userExist._id }, "JWT-SECRET");

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(200).json({ message: "User loogedIn successfully", userExist });
  } catch (error) {
    res.status(400).json({ message: `User not found: ${error.message}` });
  }
};
