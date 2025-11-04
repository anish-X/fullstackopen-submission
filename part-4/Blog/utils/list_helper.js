import _ from "lodash";

const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  if (blogs.length === 1) return blogs[0].likes;
};

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  return blogs.reduce((curr, blog) => (blog.likes > curr.likes ? blog : curr));
};

const mostBlogs = (blogs) => {
  const authorsBlogCount = _.countBy(blogs, "author"); // { author : number of blogs}

  const authorsCount = _.map(authorsBlogCount, (count, author) => ({
    author: author,
    blogs: count,
  }));

  return _.maxBy(authorsCount, "blogs");
};

const mostLikes = (blogs) => {
  const authorBlogs = _.groupBy(blogs, "author");
  const authorLikes = _.map(authorBlogs, (authorBlog, author) => ({
    author: author,
    likes: _.sumBy(authorBlog, "likes"),
  }));

  return _.maxBy(authorLikes, "likes");
};

export default { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes };
