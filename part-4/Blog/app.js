import mongoose from "mongoose";
import express from "express";
import { MONGODB_URI } from "./utils/config.js";
import blogsRouter from "./controllers/blogController.js";
import { info, error } from "./utils/logger.js";
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

app.use((req, res, next) => {
  info("Method:", req.method);
  info("Path:  ", req.path);
  info("Body:  ", req.body);
  info("---");
  next();
});

app.use("/api", blogsRouter);

app.use((err, req, res, next) => {
  error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
});

export default app;
