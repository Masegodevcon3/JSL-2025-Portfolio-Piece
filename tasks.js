import { storage } from './storage.js';
import { api } from './api.js';

export const tasksModule = {
  tasks: [],

  /**
   * Initialize tasks: fetch from API or load from local storage.
   */
  async init() {
    try {
      const fetchedTasks = await api.fetchTasks();
      this.tasks = fetchedTasks;
    } catch (err) {
      console.error('Fetch error:', err);
      this.tasks = storage.loadTasks();
    }
    storage.saveTasks(this.tasks);
    this.renderAll();
  },

  /**
   * Render all task columns.
   */
  renderAll() {
    ['To Do', 'Doing', 'Done'].forEach(status => this.renderColumn(status));
  },

  /**
   * Render tasks for a specific column.
   * @param {string} status - Column status.
   */
  renderColumn(status) {
    const container = document.querySelector(`#${status.toLowerCase().replace(' ', '')} .task-container`);
    container.innerHTML = '';

    const filtered = this.tasks
      .filter(t => t.status === status)
      .sort((a, b) => this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority));

    filtered.forEach(task => {
      const taskEl = document.createElement('div');
      taskEl.className = 'task';
      taskEl.dataset.id = task.id;
      taskEl.innerHTML = `
        <div>${task.title} (${task.priority})</div>
        <button class="edit-btn">Edit</button>
      `;
      taskEl.querySelector('.edit-btn').addEventListener('click', () => {
        modal.open(task);
      });
      container.appendChild(taskEl);
    });
  },

  /**
   * Get task by ID.
   * @param {string} id - Task ID.
   * @returns {Object} - Task object.
   */
  getTaskById(id) {
    return this.tasks.find(t => t.id === id);
  },

  /**
   * Update an existing task.
   * @param {Object} updatedTask - Updated task object.
   */
  updateTask(updatedTask) {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      storage.saveTasks(this.tasks);
      this.renderAll();
    }
  },

  /**
   * Delete task by ID.
   * @param {string} id - Task ID.
   */
  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    storage.saveTasks(this.tasks);
    this.renderAll();
  },

  /**
   * Add a new task.
   * @param {Object} task - New task object.
   */
  addTask(task) {
    this.tasks.push(task);
    storage.saveTasks(this.tasks);
    this.renderAll();
  },

  /**
   * Convert priority string to numeric value for sorting.
   * @param {string} priority
   * @returns {number}
   */
  getPriorityValue(priority) {
    switch (priority) {
      case 'High': return 3;
      case 'Medium': return 2;
      case 'Low': return 1;
      default: return 0;
    }
  }
};