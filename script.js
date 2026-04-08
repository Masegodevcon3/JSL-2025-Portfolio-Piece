// ============================================
// KANBAN BOARD - MAIN JAVASCRIPT
// Handles: API fetching, localStorage, rendering,
// task editing/deletion, sidebar, and theme toggle.
// ============================================

// --- Constants ---
const API_URL = "https://jsl-kanban-api.vercel.app/";
const TASKS_KEY = "kanban-tasks";
const THEME_KEY = "kanban-theme";
const STATUSES = ["todo", "doing", "done"];
const STATUS_LABELS = { todo: "TODO", doing: "DOING", done: "DONE" };
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
const PRIORITY_LABELS = { high: "High", medium: "Medium", low: "Low" };

// --- DOM Elements ---
const boardEl = document.getElementById("board");
const loadingMsg = document.getElementById("loadingMsg");
const errorMsg = document.getElementById("errorMsg");
const errorText = document.getElementById("errorText");
const retryBtn = document.getElementById("retryBtn");
const sidebar = document.getElementById("sidebar");
const showSidebarBtn = document.getElementById("showSidebarBtn");
const hideSidebarBtn = document.getElementById("hideSidebarBtn");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const themeToggle = document.getElementById("themeToggle");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const editTitle = document.getElementById("editTitle");
const editDesc = document.getElementById("editDesc");
const editStatus = document.getElementById("editStatus");
const editPriority = document.getElementById("editPriority");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");

// --- State ---
let tasks = [];
let selectedTaskId = null;
let confirmDelete = false;
let mobileOverlay = null;

// ============================================
// LOCAL STORAGE MODULE
// ============================================

/**
 * Saves the tasks array to localStorage.
 * @param {Array} taskList - Array of task objects to save
 */
function saveTasks(taskList) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(taskList));
}

/**
 * Loads tasks from localStorage.
 * @returns {Array|null} The stored tasks array, or null if none found
 */
function loadTasks() {
  const data = localStorage.getItem(TASKS_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Saves the theme preference to localStorage.
 * @param {string} theme - "dark" or "light"
 */
function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Loads the theme preference from localStorage.
 * @returns {string|null} "dark", "light", or null
 */
function loadTheme() {
  return localStorage.getItem(THEME_KEY);
}

// ============================================
// API MODULE
// ============================================

/**
 * Fetches tasks from the remote API and normalises the data.
 * @returns {Promise<Array>} A promise resolving to an array of task objects
 * @throws {Error} If the network request fails
 */
async function fetchTasks() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks: " + response.statusText);
  }
  const data = await response.json();
  const taskArray = Array.isArray(data) ? data : data.tasks || [];

  return taskArray.map(function (item, index) {
    return {
      id: item.id || "task-" + index,
      title: item.title || "Untitled",
      description: item.description || "",
      status: normaliseStatus(item.status),
      priority: normalisePriority(item.priority),
    };
  });
}

/**
 * Converts an API status string to our internal format.
 * @param {string} status - Raw status from the API
 * @returns {string} Normalised status: "todo", "doing", or "done"
 */
function normaliseStatus(status) {
  const s = (status || "").toLowerCase().trim();
  if (s === "doing" || s === "in progress" || s === "in-progress") return "doing";
  if (s === "done" || s === "complete" || s === "completed") return "done";
  return "todo";
}

/**
 * Converts an API priority string to our internal format.
 * @param {string} priority - Raw priority from the API
 * @returns {string} Normalised priority: "high", "medium", or "low"
 */
function normalisePriority(priority) {
  const p = (priority || "").toLowerCase().trim();
  if (p === "high") return "high";
  if (p === "medium" || p === "med") return "medium";
  return "low";
}

// ============================================
// RENDERING MODULE
// ============================================

/**
 * Renders all three columns and their task cards onto the board.
 * Clears the board first, then creates columns for each status.
 */
function renderBoard() {
  // Clear previous content
  boardEl.innerHTML = "";

  STATUSES.forEach(function (status) {
    // Filter and sort tasks for this column
    const columnTasks = tasks
      .filter(function (t) { return t.status === status; })
      .sort(function (a, b) { return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]; });

    // Create the column element
    const columnEl = document.createElement("div");
    columnEl.className = "column";

    // Column header with coloured dot
    columnEl.innerHTML =
      '<div class="column-header">' +
        '<div class="column-dot ' + status + '"></div>' +
        '<span class="column-title">' + STATUS_LABELS[status] + " (" + columnTasks.length + ")</span>" +
      "</div>";

    // Tasks container
    const tasksContainer = document.createElement("div");
    tasksContainer.className = "column-tasks";

    if (columnTasks.length === 0) {
      // Show empty state
      tasksContainer.innerHTML = '<div class="empty-column">No tasks yet</div>';
    } else {
      // Create a card for each task
      columnTasks.forEach(function (task) {
        const card = createTaskCard(task);
        tasksContainer.appendChild(card);
      });
    }

    columnEl.appendChild(tasksContainer);
    boardEl.appendChild(columnEl);
  });
}

/**
 * Creates a task card DOM element.
 * @param {Object} task - The task object to create a card for
 * @returns {HTMLElement} The task card element
 */
function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.setAttribute("data-id", task.id);

  let html =
    '<div class="task-title">' + escapeHTML(task.title) + "</div>";

  if (task.description) {
    html += '<div class="task-desc">' + escapeHTML(task.description) + "</div>";
  }

  html +=
    '<div class="task-priority">' +
      '<div class="priority-dot ' + task.priority + '"></div>' +
      '<span class="priority-label">' + PRIORITY_LABELS[task.priority] + "</span>" +
    "</div>";

  card.innerHTML = html;

  // Open edit modal on click
  card.addEventListener("click", function () {
    openModal(task.id);
  });

  return card;
}

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} str - The string to escape
 * @returns {string} The escaped string
 */
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ============================================
// MODAL MODULE
// ============================================

/**
 * Opens the edit modal for a specific task.
 * Populates the form fields with the task's current data.
 * @param {string} taskId - The ID of the task to edit
 */
function openModal(taskId) {
  const task = tasks.find(function (t) { return t.id === taskId; });
  if (!task) return;

  selectedTaskId = taskId;
  confirmDelete = false;
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.remove("confirm");

  // Populate form fields
  editTitle.value = task.title;
  editDesc.value = task.description;
  editStatus.value = task.status;
  editPriority.value = task.priority;

  // Show modal
  modalOverlay.classList.remove("hidden");
}

/**
 * Closes the edit modal and resets state.
 */
function closeModal() {
  modalOverlay.classList.add("hidden");
  selectedTaskId = null;
  confirmDelete = false;
}

/**
 * Saves the edited task data and updates the board.
 * Updates both the in-memory array and localStorage.
 */
function handleSave() {
  if (!selectedTaskId) return;

  tasks = tasks.map(function (t) {
    if (t.id === selectedTaskId) {
      return {
        ...t,
        title: editTitle.value,
        description: editDesc.value,
        status: editStatus.value,
        priority: editPriority.value,
      };
    }
    return t;
  });

  saveTasks(tasks);
  renderBoard();
  closeModal();
}

/**
 * Handles the delete button click.
 * First click shows confirmation, second click deletes the task.
 */
function handleDelete() {
  if (!selectedTaskId) return;

  if (confirmDelete) {
    // Second click: actually delete
    tasks = tasks.filter(function (t) { return t.id !== selectedTaskId; });
    saveTasks(tasks);
    renderBoard();
    closeModal();
  } else {
    // First click: show confirmation
    confirmDelete = true;
    deleteBtn.textContent = "Confirm Delete";
    deleteBtn.classList.add("confirm");
  }
}

// ============================================
// SIDEBAR MODULE
// ============================================

/**
 * Hides the sidebar on desktop.
 */
function hideSidebar() {
  sidebar.classList.add("collapsed");
  sidebar.classList.remove("open");
  showSidebarBtn.classList.remove("hidden");
  removeMobileOverlay();
}

/**
 * Shows the sidebar on desktop.
 */
function showSidebar() {
  sidebar.classList.remove("collapsed");
  showSidebarBtn.classList.add("hidden");
}

/**
 * Toggles the sidebar on mobile (opens/closes as an overlay).
 */
function toggleMobileSidebar() {
  const isOpen = sidebar.classList.contains("open");

  if (isOpen) {
    sidebar.classList.remove("open");
    removeMobileOverlay();
  } else {
    sidebar.classList.add("open");
    sidebar.classList.remove("collapsed");
    addMobileOverlay();
  }
}

/**
 * Adds a dark overlay behind the mobile sidebar.
 */
function addMobileOverlay() {
  if (mobileOverlay) return;
  mobileOverlay = document.createElement("div");
  mobileOverlay.className = "mobile-overlay";
  mobileOverlay.addEventListener("click", function () {
    sidebar.classList.remove("open");
    removeMobileOverlay();
  });
  document.body.appendChild(mobileOverlay);
}

/**
 * Removes the mobile overlay.
 */
function removeMobileOverlay() {
  if (mobileOverlay) {
    mobileOverlay.remove();
    mobileOverlay = null;
  }
}

// ============================================
// THEME MODULE
// ============================================

/**
 * Initialises the theme based on localStorage or system preference.
 */
function initTheme() {
  const stored = loadTheme();
  let isDark;

  if (stored) {
    isDark = stored === "dark";
  } else {
    isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  applyTheme(isDark);
}

/**
 * Applies the dark or light theme to the document.
 * @param {boolean} isDark - Whether to apply dark mode
 */
function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  saveTheme(isDark ? "dark" : "light");
}

/**
 * Toggles between dark and light mode.
 */
function toggleTheme() {
  const isDark = document.documentElement.classList.contains("dark");
  applyTheme(!isDark);
}

// ============================================
// INITIALISATION
// ============================================

/**
 * Main initialisation function.
 * Loads data from localStorage or fetches from API,
 * sets up event listeners, and renders the board.
 */
async function init() {
  // Set up theme
  initTheme();

  // Set up event listeners
  hideSidebarBtn.addEventListener("click", hideSidebar);
  showSidebarBtn.addEventListener("click", showSidebar);
  mobileMenuBtn.addEventListener("click", toggleMobileSidebar);
  themeToggle.addEventListener("click", toggleTheme);
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) closeModal();
  });
  saveBtn.addEventListener("click", handleSave);
  deleteBtn.addEventListener("click", handleDelete);
  retryBtn.addEventListener("click", loadFromAPI);

  // Load tasks: try localStorage first, then API
  const stored = loadTasks();

  if (stored && stored.length > 0) {
    tasks = stored;
    loadingMsg.classList.add("hidden");
    renderBoard();
  } else {
    await loadFromAPI();
  }
}

/**
 * Fetches tasks from the API, saves to localStorage, and renders.
 * Shows loading/error states as needed.
 */
async function loadFromAPI() {
  loadingMsg.classList.remove("hidden");
  errorMsg.classList.add("hidden");

  try {
    tasks = await fetchTasks();
    saveTasks(tasks);
    loadingMsg.classList.add("hidden");
    renderBoard();
  } catch (err) {
    loadingMsg.classList.add("hidden");
    errorText.textContent = err.message;
    errorMsg.classList.remove("hidden");
  }
}

// Start the app
init();
