import express from "express";
import logger from "morgan";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

let phoneBook = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

logger.token("body", (req) => JSON.stringify(req.body));
app.use(
  logger(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (req, res) => {
  res.json(phoneBook);
});

app.get("/info", (req, res) => {
  res.send(`
    <p>Phonebook has info for ${phoneBook.length} people</p>
    <p>${new Date().toString()}</p>
    `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = phoneBook.find((contact) => contact.id === id);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  phoneBook = phoneBook.filter((contact) => contact.id !== id);
  res.status(204).end();
});

const generatedId = () => {
  const maxId =
    phoneBook.length > 0 ? Math.random() * (500 - phoneBook.length) : 0;

  return String(maxId + 1);
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ message: "provide valid field" });
  }

  let name = phoneBook.find((contact) => contact.name === body.name);

  if (name) {
    return res.status(409).json({ message: "Name already exists" });
  }

  const contact = {
    name: body.name,
    number: body.number,
    id: generatedId(),
  };

  phoneBook = phoneBook.concat(contact);

  res.json(phoneBook);
});

const PORT = process.env.PORT ? process.env.PORT : 3001;

app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
