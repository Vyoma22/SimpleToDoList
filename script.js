const todoList = JSON.parse(localStorage.getItem('todoList')) || [];
const todoListElement = document.querySelector("#taskList");

document.querySelector("#addTaskBtn").addEventListener("click", addTodo);

document.querySelector("#taskInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addTodo();
  }
});

function saveToLocalStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

function addTodo() {
  const todoText = document.querySelector("#taskInput").value;
  if (todoText === "") {
    alert("You did not enter any item");
    return;
  }

  const dueDate = document.querySelector("#dueDate").value;
  const todoPriority = document.querySelector("#taskPriority").value;

  const todoObject = {
    id: todoList.length,
    todoText: todoText,
    isDone: false,
    priority: todoPriority,
    dueDate: dueDate,
  };

  todoList.unshift(todoObject);
  saveToLocalStorage();
  displayTodos();
}

function doneTodo(todoId) {
  const selectedTodoIndex = todoList.findIndex((item) => item.id == todoId);

  todoList[selectedTodoIndex].isDone
    ? (todoList[selectedTodoIndex].isDone = false)
    : (todoList[selectedTodoIndex].isDone = true);

  saveToLocalStorage(); // Save the updated list to local storage
  displayTodos();
}

function deleteItem(x) {
  const index = todoList.findIndex((item) => item.id == x);

  if (index !== -1) {
    todoList.splice(index, 1);
    saveToLocalStorage();
    displayTodos();
  }
}

function displayTodos() {
  todoListElement.innerHTML = "";
  document.querySelector("#taskInput").value = "";
  document.querySelector("#dueDate").value = "";

  const priorityValues = {
    high: 3,
    medium: 2,
    low: 1,
  };

  todoList.sort((a, b) => {
    const priorityA = priorityValues[a.priority] || 0;
    const priorityB = priorityValues[b.priority] || 0;

    return priorityB - priorityA;
  });

  todoList.forEach((item) => {
    const listElement = document.createElement("li");

    const delBtn = document.createElement("i");
    delBtn.classList.add("delete-button");
    delBtn.setAttribute("data-id", item.id);
    delBtn.innerText = "X";

    const priorityElement = document.createElement("span");
    priorityElement.className = "priority-text";
    priorityElement.innerText = `    Priority: ${item.priority}`;

    const dueDateElement = document.createElement("span");
    dueDateElement.className = "due-date-text";
    dueDateElement.innerText = `    Due Date: ${item.dueDate}`;

    listElement.innerHTML = item.todoText;
    listElement.setAttribute("data-id", item.id);

    if (item.isDone) {
      listElement.classList.add("checked");
    }

    listElement.addEventListener("click", function (e) {
      const target = e.target;
      if (target.tagName !== "I") {
        const selectedId = e.target.getAttribute("data-id");
        doneTodo(selectedId);
      }
    });

    delBtn.addEventListener("click", function (e) {
      e.stopPropagation(); 
      const delId = e.target.getAttribute("data-id");
      deleteItem(delId);
    });
    listElement.appendChild(document.createElement("br"));
    listElement.appendChild(priorityElement);
    listElement.appendChild(document.createElement("br"));
    listElement.appendChild(dueDateElement);
    todoListElement.appendChild(listElement);
    listElement.appendChild(delBtn);
  });
}
displayTodos();