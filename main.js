import { tasksModule } from './modules/tasks.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize tasks
  tasksModule.init();

  // Hide loading indicator
  document.getElementById('loading').style.display = 'none';

  // Sidebar and theme toggling handled in modules
});