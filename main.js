import { tasksModule } from './modules/tasks.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize tasks: fetch or load
  tasksModule.init();

  // Hide loading indicator
  document.getElementById('loading').style.display = 'none';

  // Event listeners for sidebar and theme are set in modules
});