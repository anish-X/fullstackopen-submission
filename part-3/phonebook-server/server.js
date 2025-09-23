import express, { response } from "express";
import logger from "morgan";
import cors from "cors";
import Phonebook from "./phonebook.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

logger.token("body", (req) => JSON.stringify(req.body));
app.use(
  logger(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (req, res, next) => {
  Phonebook.find({})
    .then((contacts) => res.json(contacts))
    .catch((error) => next(error));
});

app.get("/info", (req, res, next) => {
  Phonebook.countDocuments()
    .then((totalContact) => {
      res.send(`
    <p>Phonebook has info for ${totalContact} people</p>
    <p>${new Date().toString()}</p>
    `);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Phonebook.findById(id)
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({ error: "Not found" });
      }
      res.json(contact);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  Phonebook.findById(req.params.id)
    .then((contact) => {
      if (!contact) {
        return res.status(404).end();
      }

      contact.name = name;
      contact.number = number;

      return contact.save().then((updatedContact) => {
        res.json(updatedContact);
      });
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Phonebook.findByIdAndDelete(id)
    .then((result) => res.json(result))
    .catch((error) => next(error));
});

// const generatedId = () => {
//   const maxId =
//     phoneBook.length > 0 ? Math.random() * (500 - phoneBook.length) : 0;

//   return String(maxId + 1);
// };

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ message: "provide valid field" });
  }

  Phonebook.findOne({ name })
    .then((existingName) => {
      if (existingName) {
        return res.status(409).json({ message: "Name already exists" });
      }
      const contact = new Phonebook({
        name: name,
        number,
      });

      contact
        .save()
        .then((savedContact) => {
          res.json(savedContact);
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).json({ error: error.message });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);
const PORT = process.env.PORT ? process.env.PORT : 3001;

app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
