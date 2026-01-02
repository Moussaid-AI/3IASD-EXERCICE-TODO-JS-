// Tableau des tâches
let tasks = [];
let currentFilter = "all";

// Sélection des éléments HTML
const taskInput = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");
const counter = document.querySelector("#counter");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearDoneBtn = document.querySelector("#clearDoneBtn");
const clearAllBtn = document.querySelector("#clearAllBtn");

// Sauvegarder dans localStorage
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Charger depuis localStorage
function load() {
  const data = localStorage.getItem("tasks");
  if (data) tasks = JSON.parse(data);
}

// Afficher les tâches
function render() {
  taskList.innerHTML = "";

  let visibleTasks = tasks;
  if (currentFilter === "active") visibleTasks = tasks.filter(t => !t.done);
  if (currentFilter === "done") visibleTasks = tasks.filter(t => t.done);

  visibleTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "item" + (task.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      task.done = !task.done;
      save();
      render();
    });

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = task.text;

    const btn = document.createElement("button");
    btn.textContent = "Supprimer";
    btn.addEventListener("click", () => {
      tasks = tasks.filter(t => t !== task);
      save();
      render();
    });

    li.append(checkbox, span, btn);
    taskList.appendChild(li);
  });

  // compteur
  const remaining = tasks.filter(t => !t.done).length;
  counter.textContent = remaining + " restantes";
}

// Ajouter une tâche
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  tasks.push({ text: text, done: false });
  taskInput.value = "";
  save();
  render();
}

// Événements
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    render();
  });
});

clearDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.done);
  save();
  render();
});

clearAllBtn.addEventListener("click", () => {
  tasks = [];
  save();
  render();
});

// Initialisation
load();
render();
