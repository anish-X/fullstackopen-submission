import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm.jsx";

test("form calls the event handler it received as props with the right details when a new blog is created", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const sendButton = screen.getByText("create");

  await user.type(screen.getByLabelText(/title/i), "Blog Title");
  await user.type(screen.getByLabelText(/author/i), "Blog author");
  await user.type(screen.getByLabelText(/url/i), "Blog.com");

  const submitButton = screen.getByRole("button", { name: /create/i });

  await user.click(submitButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog).toHaveBeenCalledWith({
    title: "Blog Title",
    author: "Blog author",
    url: "Blog.com",
  });
});
