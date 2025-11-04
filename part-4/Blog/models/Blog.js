import mongoose from "mongoose";

const BlogSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

BlogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Blog = mongoose.model("Blog", BlogSchema);
export default Blog;
