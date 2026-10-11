
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const todoList = document.getElementById("todoList");
const doneList = document.getElementById("doneList");

let tasks = JSON.parse(localStorage.getItem("vinayakTasks")) || [
    { id: 1, title: "Finish personal budget tracking", date: "Today", done: false },
    { id: 2, title: "Complete online course (Selenium)", date: "Tomorrow", done: false },
    { id: 3, title: "Update resume", date: "Oct 16", done: false },
    { id: 4, title: "Go for a walk / exercise", date: "Oct 17", done: false },
    { id: 5, title: "Plan next weekend trip", date: "Oct 18", done: false },
    { id: 6, title: "Drink enough water", date: "Oct 12", done: true },
    { id: 7, title: "Read a book", date: "Oct 11", done: true },
    { id: 8, title: "Clean study desk", date: "Oct 10", done: true }
];

let currentView = "all";

// Display current date
document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });

// Save tasks in the browser
function saveTasks() {
    localStorage.setItem("vinayakTasks", JSON.stringify(tasks));
}

// Display tasks
function renderTasks() {
    todoList.innerHTML = "";
    doneList.innerHTML = "";

    const pendingTasks = tasks.filter(task => !task.done);
    const completedTasks = tasks.filter(task => task.done);

    document.getElementById("todoCount").textContent = pendingTasks.length;
    document.getElementById("doneCount").textContent = completedTasks.length;
    document.getElementById("boardTodoCount").textContent = pendingTasks.length;
    document.getElementById("boardDoneCount").textContent = completedTasks.length;

    pendingTasks.forEach(task => {
        todoList.appendChild(createTaskElement(task));
    });

    completedTasks.forEach(task => {
        doneList.appendChild(createTaskElement(task));
    });

    if (pendingTasks.length === 0) {
        todoList.innerHTML =
            '<p class="empty-message">No pending tasks. Great job!</p>';
    }

    if (completedTasks.length === 0) {
        doneList.innerHTML =
            '<p class="empty-message">Completed tasks will appear here.</p>';
    }

    // Filter the selected view
    document.querySelectorAll(".task-board").forEach(board => {
        board.style.display = "";
    });

    if (currentView === "todo") {
        document.querySelector(".todo-board").style.display = "";
        document.querySelector(".done-board").style.display = "none";
    } else if (currentView === "done") {
        document.querySelector(".todo-board").style.display = "none";
        document.querySelector(".done-board").style.display = "";
    }
}

// Create one task card
function createTaskElement(task) {
    const item = document.createElement("div");
    item.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", "Mark task complete");

    checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        saveTasks();
        renderTasks();
    });

    const details = document.createElement("div");
    details.className = "task-details";

    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.title;

    const date = document.createElement("p");
    date.className = "task-date";
    date.textContent = "▢  " + task.date;

    details.appendChild(title);
    details.appendChild(date);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    if (!task.done) {
        const editButton = document.createElement("button");
        editButton.textContent = "✎";
        editButton.title = "Edit task";

        editButton.addEventListener("click", () => {
            const updatedTitle = prompt("Edit your task:", task.title);

            if (updatedTitle !== null && updatedTitle.trim() !== "") {
                task.title = updatedTitle.trim();
                saveTasks();
                renderTasks();
            }
        });

        actions.appendChild(editButton);
    } else {
        const undoButton = document.createElement("button");
        undoButton.textContent = "↶";
        undoButton.title = "Move back to To Do";

        undoButton.addEventListener("click", () => {
            task.done = false;
            saveTasks();
            renderTasks();
        });

        actions.appendChild(undoButton);
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "♧";
    deleteButton.title = "Delete task";

    deleteButton.addEventListener("click", () => {
        const confirmed = confirm("Do you want to delete this task?");

        if (confirmed) {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        }
    });

    actions.appendChild(deleteButton);

    item.appendChild(checkbox);
    item.appendChild(details);
    item.appendChild(actions);

    return item;
}

// Add a new task
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (title === "") {
        return;
    }

    tasks.unshift({
        id: Date.now(),
        title: title,
        date: "Added today",
        done: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

// Sidebar navigation
document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
        currentView = button.dataset.view;
        renderTasks();
    });
});

// Initial display
renderTasks();
