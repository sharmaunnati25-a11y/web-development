// ============================================================
// To-Do Application JavaScript - Experiment 3
// DOM Manipulation, Event Handling, and LocalStorage
// ============================================================

// State Management
const STORAGE_KEY = 'unnati_webdev_todos';
let todos = [];
let currentFilter = 'all';

// DOM Elements
const todoForm = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const itemsLeftText = document.getElementById('itemsLeftText');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

const countAll = document.getElementById('countAll');
const countActive = document.getElementById('countActive');
const countCompleted = document.getElementById('countCompleted');

const filterButtons = document.querySelectorAll('[data-filter]');

// 1. Initialize Application
function init() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    try {
      todos = JSON.parse(savedData);
    } catch (e) {
      todos = [];
    }
  } else {
    // Helpful initial default tasks for CS Data Science student
    todos = [
      { id: 1, title: 'Practice C++ Data Structures & Algorithms', priority: 'High', completed: true },
      { id: 2, title: 'Refine Suryascope Rooftop Solar project UI', priority: 'Normal', completed: false },
      { id: 3, title: 'Complete Web Development Lab Experiments 1-6', priority: 'High', completed: false },
      { id: 4, title: 'Study Pandas and NumPy data manipulation functions', priority: 'Low', completed: false }
    ];
    saveTodos();
  }

  setupEventListeners();
  render();
}

// 2. Event Listeners Setup
function setupEventListeners() {
  // Add new task
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;

    const newTask = {
      id: Date.now(),
      title: title,
      priority: prioritySelect.value,
      completed: false
    };

    todos.unshift(newTask);
    saveTodos();
    taskInput.value = '';
    render();
  });

  // Filter switching
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  // Clear completed tasks
  clearCompletedBtn.addEventListener('click', () => {
    const hasCompleted = todos.some(t => t.completed);
    if (!hasCompleted) return;
    
    todos = todos.filter(t => !t.completed);
    saveTodos();
    render();
  });
}

// 3. Save to LocalStorage
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 4. Toggle Task Completion
function toggleTask(id) {
  todos = todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  render();
}

// 5. Delete Task
function deleteTask(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  render();
}

// 6. Render UI
function render() {
  // Filter logic
  let filteredTodos = todos;
  if (currentFilter === 'active') {
    filteredTodos = todos.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTodos = todos.filter(t => t.completed);
  }

  // Clear existing DOM list
  taskList.innerHTML = '';

  // Handle empty state
  if (filteredTodos.length === 0) {
    emptyState.classList.remove('d-none');
  } else {
    emptyState.classList.add('d-none');
  }

  // Populate list
  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `list-group-item d-flex justify-content-between align-items-center task-item ${todo.completed ? 'task-completed' : ''}`;
    
    // Checkbox and Title
    const leftDiv = document.createElement('div');
    leftDiv.className = 'd-flex align-items-center gap-3 flex-grow-1 me-2';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input task-checkbox mt-0';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`);
    checkbox.addEventListener('change', () => toggleTask(todo.id));

    const titleSpan = document.createElement('span');
    titleSpan.className = 'task-text fw-medium text-break';
    titleSpan.textContent = todo.title;

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(titleSpan);

    // Right Controls (Priority badge + Delete Button)
    const rightDiv = document.createElement('div');
    rightDiv.className = 'd-flex align-items-center gap-2';

    const priorityBadge = document.createElement('span');
    priorityBadge.className = `badge rounded-pill small px-2 py-1 priority-badge-${todo.priority}`;
    priorityBadge.textContent = todo.priority;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-outline-danger btn-sm border-0 delete-btn';
    deleteBtn.innerHTML = '<i class="bi bi-trash3"></i>';
    deleteBtn.title = 'Delete task';
    deleteBtn.setAttribute('aria-label', `Delete "${todo.title}"`);
    deleteBtn.addEventListener('click', () => deleteTask(todo.id));

    rightDiv.appendChild(priorityBadge);
    rightDiv.appendChild(deleteBtn);

    li.appendChild(leftDiv);
    li.appendChild(rightDiv);
    taskList.appendChild(li);
  });

  // Update Counters
  const totalCount = todos.length;
  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  countAll.textContent = totalCount;
  countActive.textContent = activeCount;
  countCompleted.textContent = completedCount;

  itemsLeftText.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} remaining`;
}

// Run on load
document.addEventListener('DOMContentLoaded', init);
