const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoItemsList = document.querySelector('.todo-items');
const filterButtons = document.querySelectorAll('.filter-button');
let todos = [];
let currentFilter = 'all';

todoForm.addEventListener('submit', function(event) {
  event.preventDefault();
  addTodo(todoInput.value);
});

filterButtons.forEach(button => {
  button.addEventListener('click', function() {
    currentFilter = this.id;
    filterButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    renderTodos(todos);
  });
});

function addTodo(item) {
  if (item !== '') {
    const todo = {
      id: Date.now(),
      name: item,
      completed: false
    };
    todos.push(todo);
    addToLocalStorage(todos);
    todoInput.value = '';
  }
}

function renderTodos(todos) {
  todoItemsList.innerHTML = '';
  let filteredTodos = todos;
  if (currentFilter === 'remaining') {
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (currentFilter === 'completed') {
    filteredTodos = todos.filter(todo => todo.completed);
  }
  filteredTodos.forEach(function(item) {
    const checked = item.completed ? 'checked' : '';
    const li = document.createElement('li');
    li.setAttribute('class', 'item' + (item.completed ? ' checked' : ''));
    li.setAttribute('data-key', item.id);
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${checked}>
      ${item.name}
      <button class="delete-button"><i class="fas fa-trash"></i></button>
    `;
    todoItemsList.append(li);
  });
}

function addToLocalStorage(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos(todos);
}

function getFromLocalStorage() {
  const reference = localStorage.getItem('todos');
  if (reference) {
    todos = JSON.parse(reference);
    renderTodos(todos);
  }
}

function toggle(id) {
  todos.forEach(function(item) {
    if (item.id == id) {
      item.completed = !item.completed;
    }
  });
  addToLocalStorage(todos);
}

function deleteTodo(id) {
  todos = todos.filter(function(item) {
    return item.id != id;
  });
  addToLocalStorage(todos);
}

getFromLocalStorage();

todoItemsList.addEventListener('click', function(event) {
  if (event.target.type === 'checkbox') {
    toggle(event.target.parentElement.getAttribute('data-key'));
  }
  if (event.target.classList.contains('delete-button')) {
    deleteTodo(event.target.parentElement.getAttribute('data-key'));
  }
});
