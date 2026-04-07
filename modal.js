import { tasksModule } from './tasks.js';

const modalEl = document.getElementById('task-modal');
const form = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const titleInput = document.getElementById('task-title');
const descInput = document.getElementById('task-desc');
const statusSelect = document.getElementById('task-status');
const prioritySelect = document.getElementById('task-priority');
const deleteBtn = document.getElementById('delete-task');

let currentTask = null;

/**
 * Open modal and populate with task data.
 * @param {Object} task
 */
export function open(task) {
  currentTask = task;
  taskIdInput.value = task.id;
  titleInput.value = task.title;
  descInput.value = task.description;
  statusSelect.value = task.status;
  prioritySelect.value = task.priority;
  modalEl.classList.remove('hidden');
}

/**
 * Close modal and reset form.
 */
function close() {
  modalEl.classList.add('hidden');
  form.reset();
  currentTask = null;
}

document.getElementById('close-modal').addEventListener('click', close);
document.getElementById('cancel').addEventListener('click', close);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const updatedTask = {
    ...currentTask,
    title: titleInput.value,
    description: descInput.value,
    status: statusSelect.value,
    priority: prioritySelect.value
  };
  tasksModule.updateTask(updatedTask);
  close();
});

deleteBtn.onclick = () => {
  if (confirm('Are you sure you want to delete this task?')) {
    tasksModule.deleteTask(currentTask.id);
    close();
  }
};