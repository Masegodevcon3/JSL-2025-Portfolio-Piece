import { tasksModule } from './modules/tasks.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize tasks
  tasksModule.init();

  // Hide loading after init
  document.getElementById('loading').style.display = 'none';

  // Sidebar and theme event handlers are in their modules
});