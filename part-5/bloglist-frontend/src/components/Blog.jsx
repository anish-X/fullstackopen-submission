const Blog = ({
  blog,
  user,
  handleLike,
  handleDelete,
  view,
  toggleBlogView,
}) => {
  const showDelete = user && blog.user && blog.user.username === user.username;
  return (
    <div
      className="blog"
      style={{
        paddingTop: 10,
        paddingLeft: 2,
        border: "1px solid black",
        margin: "auto",
      }}
    >
      <div className="blog-header">
        {blog.title} {blog.author}
      </div>
      <button className="toggle-btn" onClick={() => toggleBlogView(blog.id)}>
        {view ? "hide" : "show"}
      </button>
      {view && (
        <div>
          <div>
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
            likes {blog.likes}{" "}
            <button onClick={() => handleLike(blog)}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {showDelete && (
            <div className="remove-btn">
              <button
                style={{
                  backgroundColor: "red",
                  borderRadius: "1rem",
                  border: "none",
                }}
                onClick={() => handleDelete(blog)}
              >
                remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
