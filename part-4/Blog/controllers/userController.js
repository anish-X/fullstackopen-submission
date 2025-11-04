import User from "../models/User.js";
import express from "express";
import bcrypt from "bcryptjs";

const userRouter = express.Router();

userRouter.post("/user", async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and Password are required" });
  }

  if (!username.length > 2 || !password.length > 2) {
    return res
      .status(400)
      .json({ error: "Username and password length should be more than 3" });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser)
    return res.status(400).json({ error: "Username should be unique" });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  try {
    const user = new User({
      username,
      passwordHash,
      name,
    });

    const createUser = await user.save();
    res.status(201).json(createUser);
  } catch (error) {
    console.error("Error creating user", error.message);
  }
});

userRouter.get("/user", async (req, res) => {
  try {
    const user = await User.find({}).populate("blogs", {
      title: 1,
      url: 1,
      author: 1,
      likes: 1,
    });
    if (!user) return res.status(400).json({ error: "Database error" });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user", error.message);
  }
});

export default userRouter;
