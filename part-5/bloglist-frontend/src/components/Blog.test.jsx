import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  const blog = {
    title: "blog test",
    author: "blog author",
    url: "blogurl.com",
    likes: 8,
    user: { id: "bloguser", name: "blog", username: "blogname" },
  };

  test("renders blog title and author by default", () => {
    const blog = {
      title: "blog test",
      author: "blog author",
      url: "blogurl.com",
      likes: 8,
      user: { id: "bloguser", name: "blog", username: "blogname" },
    };
    const mockingToggleView = vi.fn();
    render(<Blog blog={blog} toggleBlogView={mockingToggleView} />);
    expect(screen.getByText(/blog test/i)).toBeInTheDocument();
    expect(screen.getByText(/blog author/i)).toBeInTheDocument();
  });

  test("do not render likes or url by default", async () => {
    const mockingToggleView = vi.fn();
    render(<Blog blog={blog} toggleBlogView={mockingToggleView} />);

    expect(screen.queryByText("testurl.com")).toBeNull();
    expect(screen.queryByText(/likes 10/i)).toBeNull();
  });

  test("shows blog url and likes when view button is clicked", async () => {
    const mockingToggleView = vi.fn();

    const user = userEvent.setup();

    const { rerender } = render(
      <Blog blog={blog} toggleBlogView={mockingToggleView} view={false} />
    );

    expect(screen.queryByText("testurl.com")).toBeNull();
    expect(screen.queryByText(/likes 8/i)).toBeNull();

    const showButton = screen.getByText("show");
    await user.click(showButton);

    expect(mockingToggleView).toHaveBeenCalledTimes(1);
    expect(mockingToggleView).toHaveBeenCalledWith(blog.id);

    rerender(
      <Blog blog={blog} toggleBlogView={mockingToggleView} view={true} />
    );

    expect(screen.getByText("blogurl.com")).toBeDefined();
    expect(screen.getByText(/likes 8/i)).toBeDefined();
  });

  test("like button click calls handleLike handler", async () => {
    const mockToggleView = vi.fn();
    const mockHandleLike = vi.fn();
    const user = userEvent.setup();

    render(
      <Blog
        blog={blog}
        toggleBlogView={mockToggleView}
        handleLike={mockHandleLike}
        view={true}
      />
    );

    const likeButton = screen.getByText("like");
    await user.click(likeButton);

    expect(mockHandleLike).toHaveBeenCalledTimes(1);
    expect(mockHandleLike).toHaveBeenCalledWith(blog);
  });

  test("like button clicked twice calls handler twice", async () => {
    const mockToggleView = vi.fn();
    const mockHandleLike = vi.fn();
    const user = userEvent.setup();

    render(
      <Blog
        blog={blog}
        toggleBlogView={mockToggleView}
        handleLike={mockHandleLike}
        view={true}
      />
    );

    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandleLike).toHaveBeenCalledTimes(2);
  });
});
