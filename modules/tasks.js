import { storage } from './storage.js';
import { api } from './api.js';

export const tasksModule = {
  tasks: [],

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

  renderAll() {
    ['To Do', 'Doing', 'Done'].forEach(status => this.renderColumn(status));
  },

  renderColumn(status) {
    const container = document.querySelector(`#${status.toLowerCase().replace(' ', '')} .task-container`);
    container.innerHTML = '';

    const sortedTasks = this.tasks
      .filter(t => t.status === status)
      .sort((a, b) => this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority));

    sortedTasks.forEach(task => {
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

  getTaskById(id) {
    return this.tasks.find(t => t.id === id);
  },

  updateTask(updatedTask) {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      storage.saveTasks(this.tasks);
      this.renderAll();
    }
  },

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    storage.saveTasks(this.tasks);
    this.renderAll();
  },

  addTask(task) {
    this.tasks.push(task);
    storage.saveTasks(this.tasks);
    this.renderAll();
  },

  getPriorityValue(priority) {
    switch(priority) {
      case 'High': return 3;
      case 'Medium': return 2;
      case 'Low': return 1;
      default: return 0;
    }
  }
};