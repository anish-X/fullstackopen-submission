import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((e) => console.log("Error connecting mongodb", e.message));

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{3}-\d+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid number`,
    },
    minLenght: 8,
    required: true,
  },
});

phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Phonebook = mongoose.model("Phonebook", phonebookSchema);

export default Phonebook;
