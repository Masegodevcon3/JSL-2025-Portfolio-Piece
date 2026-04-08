export const storage = {
  saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  },
  loadTasks() {
    const data = localStorage.getItem('tasks');
    return data ? JSON.parse(data) : [];
  }
};