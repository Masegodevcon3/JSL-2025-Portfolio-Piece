const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');

/**
 * Toggle between dark and light themes.
 */
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

themeToggleBtn.addEventListener('click', toggleTheme);
themeToggleMobileBtn.addEventListener('click', toggleTheme);