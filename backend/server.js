
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let tasks = [];
let nextId = 1;

// Faqja kryesore
app.get("/", function(req, res) {
    res.send("Task Manager API is running!");
});

// Merr te gjitha detyrat
app.get("/tasks", function(req, res) {
    res.json(tasks);
});

// Shton nje detyre
app.post("/tasks", function(req, res) {
    const taskText = req.body.text;

    if (!taskText || taskText.trim() === "") {
        return res.status(400).json({
            message: "Task text is required"
        });
    }

    const newTask = {
        id: nextId,
        text: taskText.trim(),
        completed: false
    };

    nextId++;

    tasks.push(newTask);

    res.status(201).json(newTask);
});

// Ndryshon statusin e detyres
app.patch("/tasks/:id", function(req, res) {
    const id = Number(req.params.id);

    const task = tasks.find(function(item) {
        return item.id === id;
    });

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    if (typeof req.body.completed === "boolean") {
        task.completed = req.body.completed;
    }

    res.json(task);
});

// Fshin nje detyre
app.delete("/tasks/:id", function(req, res) {
    const id = Number(req.params.id);

    const index = tasks.findIndex(function(item) {
        return item.id === id;
    });

    if (index === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    tasks.splice(index, 1);

    res.json({
        message: "Task deleted successfully"
    });
});

// Nis serverin
app.listen(PORT, function() {
    console.log("Server is running on port " + PORT);
});
