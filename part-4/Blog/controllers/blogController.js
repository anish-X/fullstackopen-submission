import express from "express";
import { Blog } from "../models/Blog.js";

const blogsRouter = express.Router();

blogsRouter.get("/blogs", (req, res) => {
  try {
    Blog.find({}).then((blogs) => {
      res.json(blogs);
    });
  } catch (error) {
    console.error("Error: ", error.message);
  }
});

blogsRouter.post("/blogs", (req, res) => {
  try {
    const blog = new Blog(req.body);

    blog.save().then((result) => res.status(201).json(result));
  } catch (error) {
    console.error("Error: ", error.message);
  }
});

export default blogsRouter;
