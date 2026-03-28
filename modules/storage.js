/**
 * Storage module for saving and loading tasks.
 */
export const storage = {
  /**
   * Save tasks array to local storage.
   * @param {Array} tasks - Array of task objects.
   */
  saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  },

  /**
   * Load tasks array from local storage.
   * @returns {Array} - Array of tasks.
   */
  loadTasks() {
    const data = localStorage.getItem('tasks');
    return data ? JSON.parse(data) : [];
  }
};