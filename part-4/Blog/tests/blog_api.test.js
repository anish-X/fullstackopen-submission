import assert from "node:assert";
import { test, after, beforeEach, describe } from "node:test";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import Blog from "../models/Blog.js";
import dotenv from "dotenv";
dotenv.config();

const api = supertest(app);

const initialBlogs = [
  {
    title: "Blog title: 1",
    author: "zyz",
    url: "http://url.com",
    likes: 4,
  },
  {
    title: "Blog title: 2",
    author: "zyx",
    url: "http://url.com",
    likes: 2,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe("GET request to /api/blogs to get blogs in JSON", () => {
  test("blogs returned as JSON", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, initialBlogs.length);
  });
  test("blog has id but not _id", async () => {
    const response = await api.get("/api/blogs");

    const blogs = response.body;
    blogs.forEach((blog) => {
      assert.ok(blog.id, "property id is defined");
      assert.strictEqual(
        blog._id,
        undefined,
        "property _id is defined in Blog"
      );
    });
  });
});

describe("POST request to /api/blogs", () => {
  test("creates a blog post", async () => {
    const newBlog = {
      title: "New Blog",
      author: "Blogger",
      url: "www.blogger.com/blog",
      likes: 9,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const Blogs = await Blog.find({});
    assert.strictEqual(Blogs.length, initialBlogs.length + 1);

    const titles = Blogs.map((blog) => blog.title);
    assert.ok(titles.includes("New Blog"));
  });

  test("check if likes property is missing", async () => {
    const newBlog = {
      title: "New Blog 2",
      author: "Blogger",
      url: "www.blogger.com/blog",
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, 0);
  });

  test("check if title property is missing", async () => {
    const newBlog = {
      author: "Blogger",
      url: "www.blogger.com",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });

  test("check if url property is missing", async () => {
    const newBlog = {
      title: "New Blogger 3",
      author: "Blogger",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

describe("DELETE request to /api/blogs", () => {
  test("delete blogs by id", async () => {
    const blogsAtStart = await Blog.find({});
    const blogsToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogsToDelete.id}`).expect(204);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

    const ids = blogsAtEnd.map((blog) => blog.id);
    assert.ok(!ids.includes(blogsToDelete.id));
  });
});

describe("PUT request to /api/blogs", () => {
  test("update blog by id", async () => {
    const blogsAtStart = await Blog.find({});
    const blogToUpdate = blogsAtStart[0];

    const updatedData = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 10,
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, 10);

    const blogsAtEnd = await Blog.find({});
    const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);

    assert.strictEqual(updatedBlog.likes, 10);
  });
});

after(async () => {
  await mongoose.connection.close();
});
