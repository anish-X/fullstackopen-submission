import express from "express";
import Blog from "../models/Blog.js";

const blogsRouter = express.Router();

blogsRouter.get("/blogs", async (req, res, next) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (error) {
    console.error("Error: ", error.message);
    next(error);
  }
});

blogsRouter.post("/blogs", async (req, res, next) => {
  try {
    const blog = new Blog({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes || 0,
    });
    const savedBlogs = await blog.save();
    res.status(201).json(savedBlogs);
  } catch (error) {
    console.error("Error: ", error.message);
    next(error);
  }
});

blogsRouter.put("/blogs/:id", async (req, res, next) => {
  const id = req.params.id;
  const updatedBlog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
  };
  try {
    const result = await Blog.findByIdAndUpdate(id, updatedBlog, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!result) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/blogs/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const removedBlog = await Blog.findByIdAndDelete(id);

    if (!removedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(204).end();
  } catch (error) {
    console.log("Error: ", error.message);
    next(error);
  }
});

export default blogsRouter;
