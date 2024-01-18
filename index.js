const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Define a custom token for morgan to log the request body for POST requests
morgan.token("req-body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

// Middleware for logging with custom format
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// Get all persons
app.get("/api/persons", (req, res) => {
  res.status(200).json(persons);
});

// Get persons info
app.get("/info", (req, res) => {
  res.send(
    `Phonebook has info for ${persons.length} people. <br><br> ${Date()}`
  );
});

// Get single person
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (!person) {
    res.status(404).send(`Person with id: ${id} NOT found`);
  }
  res.status(200).json(person);
});

// Delete a person
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons.filter((person) => person.id !== id);
  res.send(`Person with id:${id} has been deleted successfully!`);
});

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.floor(Math.random() * (200 - 5 + 1) + 5) : 0;
  return maxId + 1;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;
  body.id = generateId();
  if (!body.name || !body.number) {
    res.status(404).json({ error: "name/number is missing!" });
  }
  const existingName = persons.find((person) => person.name === body.name);

  if (existingName) {
    res.status(400).json({ error: "name must be unique" });
  }

  persons = persons.concat(body);
  res.status(201).send(persons);
});

app.listen(PORT, () => {
  console.log(`server running @ http://localhost:${PORT}`);
});
