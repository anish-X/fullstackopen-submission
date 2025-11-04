import express from "express";
import Blog from "../models/Blog.js";
import middleware from "../utils/middleware.js";

const blogsRouter = express.Router();

blogsRouter.get("/blogs", async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/blogs", middleware.userExtractor, async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({ error: "userId missing or not valid" });
    }
    const blog = new Blog({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes || 0,
      user: user._id,
    });
    const savedBlog = await blog.save();
    if (!user.blogs) {
      user.blogs = [];
    }
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors || {})
        .map((e) => e.message)
        .join(", ");
      return res.status(400).json({ error: messages || error.message });
    }
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
    user: req.body.user,
  };
  try {
    const result = await Blog.findByIdAndUpdate(id, updatedBlog, {
      new: true,
      runValidators: true,
      context: "query",
    }).populate("user", { username: true, name: true });

    if (!result) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete(
  "/blogs/:id",
  middleware.userExtractor,
  async (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(400).json({ error: "userId missing or not valid" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return response.status(404).json({ error: "blog not found" });
    }

    if (blog.user.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ error: "permission denied: only creator can delete" });
    }

    try {
      const id = req.params.id;
      const removedBlog = await Blog.findByIdAndDelete(id);

      if (!removedBlog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

export default blogsRouter;
