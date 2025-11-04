import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import express from "express";
import User from "../models/User.js";

const loginRouter = express.Router();

loginRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const checkPassword =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && checkPassword)) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
    expiresIn: 60 * 60,
  });

  res.status(200).send({ token, username: user.username, name: user.name });
});

export default loginRouter;
