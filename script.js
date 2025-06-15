document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const taskTitle = document.getElementById("taskTitle");
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");

  let currentCategory = "inbox";
  let tasks = JSON.parse(localStorage.getItem("tasks")) || {
    inbox: [],
    today: [],
    upcoming: [],
    projects: [],
  };

  function switchCategory(category) {
    currentCategory = category;
    taskTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    taskList.innerHTML = "";
    tasks[currentCategory].forEach((task) =>
      addTaskToUI(task.text, task.completed)
    );

    tabs.forEach((tab) => tab.classList.remove("active"));
    document.querySelector(`.tab[data-category="${category}"]`).classList.add("active");
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    tasks[currentCategory].push({ text: taskText, completed: false });
    addTaskToUI(taskText, false);
    saveTasks();
    taskInput.value = "";
  }

  function addTaskToUI(taskText, completed) {
    const li = document.createElement("li");
    if (completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.addEventListener("change", function () {
      const task = tasks[currentCategory].find((t) => t.text === taskText);
      task.completed = checkbox.checked;
      li.classList.toggle("completed", checkbox.checked);
      saveTasks();
    });

    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", function () {
      taskList.removeChild(li);
      tasks[currentCategory] = tasks[currentCategory].filter((task) => task.text !== taskText);
      saveTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(taskSpan);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  }

  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      switchCategory(this.getAttribute("data-category"));
    });
  });

  switchCategory("inbox");
});
