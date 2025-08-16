import express from "express";
// TODO Use below import statement for importing middlewares from users.js for your routes
// TODO import { ....... } from "./users.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { database } from "./users.js";
import makeDatabase from "./database.js";

const db = makeDatabase({ isPersistent: false });

let app = express();
app.use(express.json());
// TODO: Create routes here, e.g. app.post("/register", .......)

const JWT_SECRET = "your_secret_key";

app.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = db.create({ username, password: hashedPassword });
    res.status(201).json({ id: newUser.id, username: newUser.username });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password are required" });

    let foundUser;
    for (const id in database) {
      const u = database.getById(id);
      if (u && u.username === username) foundUser = u;
    }

    if (!foundUser)
      return res.status(401).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, foundUser.password);
    if (!isValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: foundUser.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = database.getById(payload.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    res.json({ username: user.username });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.post('/auth/logout', (req, res) => {
  res.status(204).send();
});

// Serve the front-end application from the `client` folder
app.use(express.static("client"));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
