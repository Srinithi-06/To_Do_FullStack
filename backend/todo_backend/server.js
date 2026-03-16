const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/todo")
  .then(() => console.log("DB Connection Success....."))
  .catch((err) => console.log("DB Connection Error:", err));

const Login = require("./model/LoginModel");
const Todo = require("./model/TodoModel");


app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await Login.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new Login({ username, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Login.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =====================
   TODO ROUTES
===================== */

// ADD SINGLE TODO (NORMALIZED)
app.post("/api/todos", async (req, res) => {
  try {
    const { task, month, day, userId } = req.body;

    const newTodo = new Todo({
      task: task.trim(),
      month: month.trim().toLowerCase(),
      day: day.toString().trim(),
      completed: false,
      userId
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ADD MULTIPLE TODOS (NORMALIZED)
app.post("/api/todos/bulk", async (req, res) => {
  try {
    const { month, day, tasks, userId } = req.body;

    if (!month || !day || !tasks || !Array.isArray(tasks) || !userId) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const todosToInsert = tasks.map((task) => ({
      task: task.trim(),
      month: month.trim().toLowerCase(),
      day: day.toString().trim(),
      completed: false,
      userId
    }));

    const savedTodos = await Todo.insertMany(todosToInsert);
    res.status(201).json(savedTodos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET ALL TODOS
app.get("/api/todos/month/:month/:userId", async (req, res) => {
  try {
    const { month, userId } = req.params;

    const todos = await Todo.find({
      month: month.toLowerCase(),
      userId
    });

    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// UPDATE TODO
app.put("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// TOGGLE COMPLETED
app.put("/api/todos/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE TODO
app.delete("/api/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =====================
   FILTER ROUTES (FIXED)
===================== */

// MONTH FILTER (LOWERCASE MATCH)
app.get("/api/todos/month/:month", async (req, res) => {
  try {
    const month = req.params.month.toLowerCase();
    const todos = await Todo.find({ month });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// COMPLETED BY MONTH
app.get("/api/todos/month/:month/completed", async (req, res) => {
  try {
    const month = req.params.month.toLowerCase();
    const todos = await Todo.find({ month, completed: true });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// INCOMPLETE BY MONTH
app.get("/api/todos/month/:month/incomplete", async (req, res) => {
  try {
    const month = req.params.month.toLowerCase();
    const todos = await Todo.find({ month, completed: false });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =====================
   SERVER START
===================== */
app.listen(PORT, () =>
  console.log(`Server is running on PORT ${PORT}`)
);
