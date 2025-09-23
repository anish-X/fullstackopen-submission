import mongoose from "mongoose";
import express from "express";
import { MONGODB_URI } from "./utils/config.js";
import blogsRouter from "./controllers/blogController.js";
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
app.use("/api", blogsRouter);

export default app;
