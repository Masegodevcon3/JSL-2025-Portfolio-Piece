/**
 * API module for fetching tasks.
 */
export const api = {
  /**
   * Fetch tasks from the API endpoint.
   * @returns {Promise<Array>} - Promise resolving to task array.
   */
  async fetchTasks() {
    const response = await fetch('https://jsl-kanban-api.vercel.app/');
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  }
};