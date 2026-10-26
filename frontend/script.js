
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");

const API_URL = "http://localhost:3000/tasks";

// Shfaq detyrat ne faqe
function displayTasks(tasks) {
    taskList.innerHTML = "";

    tasks.forEach(function(task) {
        const li = document.createElement("li");
        const taskName = document.createElement("span");

        taskName.textContent = task.text;

        if (task.completed) {
            taskName.classList.add("completed");
        }

        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed
            ? "Undo"
            : "Complete";

        completeButton.addEventListener("click", async function() {
            try {
                const response = await fetch(API_URL + "/" + task.id, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        completed: !task.completed
                    })
                });

                if (!response.ok) {
                    throw new Error("Nuk u perditesua detyra");
                }

                loadTasks();
            } catch (error) {
                alert(error.message);
            }
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", async function() {
            try {
                const response = await fetch(API_URL + "/" + task.id, {
                    method: "DELETE"
                });

                if (!response.ok) {
                    throw new Error("Nuk u fshi detyra");
                }

                loadTasks();
            } catch (error) {
                alert(error.message);
            }
        });

        li.appendChild(taskName);
        li.appendChild(completeButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

// Merr detyrat nga backend
async function loadTasks() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Nuk u moren detyrat nga serveri");
        }

        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error(error);
        alert("Kontrollo nese backend-i eshte duke punuar.");
    }
}

// Shton nje detyre te re
async function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: taskText
            })
        });

        if (!response.ok) {
            throw new Error("Detyra nuk u shtua");
        }

        taskInput.value = "";

        loadTasks();
    } catch (error) {
        console.error(error);
        alert("Nuk u shtua detyra. Kontrollo backend-in.");
    }
}

// Butoni Add Task
addTaskButton.addEventListener("click", addTask);

// Shton detyre kur shtyp Enter
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Ngarkon detyrat kur hapet faqja
loadTasks();
