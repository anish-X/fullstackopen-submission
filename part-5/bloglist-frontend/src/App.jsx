import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Login from "./components/Login";
import loginService from "./services/login.js";
import Notification from "./components/Notification.jsx";
import BlogForm from "./components/BlogForm.jsx";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({
    message: null,
    status: null,
  });

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const showNotification = (message, status) => {
    setNotification({ message, status });
    setTimeout(() => setNotification({ message: null, status: null }), 5000);
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
          <BlogForm createBlog={createBlog} />
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
