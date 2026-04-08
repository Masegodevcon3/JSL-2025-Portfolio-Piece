export const api = {
  async fetchTasks() {
    const response = await fetch('https://jsl-kanban-api.vercel.app/');
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  }
};