import mongoose from "mongoose";
import express from "express";
import { MONGODB_URI } from "./utils/config.js";
import blogsRouter from "./controllers/blogController.js";
import userRouter from "./controllers/userController.js";
import { info, error } from "./utils/logger.js";
import loginRouter from "./controllers/loginController.js";
import middleware from "./utils/middleware.js";
import testingRouter from "./controllers/testController.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((error) => {
    console.log("Error connecting with database", error.message);
  });

app.use(express.json());

app.use(middleware.reqLogger);
app.use(middleware.tokenExtractor);

if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
}
app.use("/api", blogsRouter);
app.use("/api", userRouter);
app.use("/api", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
