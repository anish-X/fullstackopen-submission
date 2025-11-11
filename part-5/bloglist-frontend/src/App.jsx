import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Login from "./components/Login";
import loginService from "./services/login.js";
import Notification from "./components/Notification.jsx";
import BlogForm from "./components/BlogForm.jsx";
import Togglable from "./components/Togglable.jsx";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({
    message: null,
    status: null,
  });
  const [showBlog, setShowBlog] = useState(null);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  const showNotification = (message, status) => {
    setNotification({ message, status });
    setTimeout(() => setNotification({ message: null, status: null }), 5000);
  };

  const toggleBlogView = (id) => {
    setShowBlog(showBlog === id ? null : id);
  };

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      showNotification(`Welcome ${user.username}`, "success");
    } catch (error) {
      showNotification("Wrong username or password", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
    blogService.setToken(null);
  };

  const createBlog = async (blogObject) => {
    try {
      const createBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(createBlog));
      showNotification(
        `A new blog ${createBlog.title} by ${user.name}`,
        "success"
      );
    } catch (exception) {
      showNotification(
        exception.response?.data?.error || "Failed to create blog",
        "error"
      );
    }
  };

  const handleLike = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id,
      });

      setBlogs(
        blogs.map((b) =>
          b.id === blog.id ? { ...updatedBlog, user: blog.user } : b
        )
      );
    } catch (error) {
      setNotification("Failed to like a blog", "error");
    }
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs(sortedBlogs.filter((b) => b.id !== blog.id));
        showNotification(`Blog ${blog.title} removed`, "success");
      } catch (error) {
        setNotification("Failed to delete blog", "error");
      }
    }
  };

  const showBlogForm = () => {
    if (user === null) {
      <Login onLogin={handleLogin} />;
    }
    return (
      <Togglable buttonLabel="create new blog">
        <BlogForm createBlog={createBlog} />
      </Togglable>
    );
  };

  return (
    <div>
      <Notification
        message={notification.message}
        status={notification.status}
      />

      {user === null ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div>
          <h2>blogs</h2>
          <div>
            <span>{user.name} logged in</span>
            <button type="submit" onClick={handleLogout}>
              logout
            </button>
          </div>
          {/* <BlogForm createBlog={createBlog} /> */}
          <div style={{ marginTop: "1rem" }}>
            {showBlogForm()}
            {sortedBlogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                handleLike={handleLike}
                handleDelete={handleDelete}
                view={showBlog === blog.id}
                toggleBlogView={toggleBlogView}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
