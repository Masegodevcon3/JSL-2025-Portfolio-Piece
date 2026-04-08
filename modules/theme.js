const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeToggleBtnMobile = document.getElementById('theme-toggle-mobile');
const themeIconMobile = document.getElementById('theme-icon-mobile');
const logo = document.getElementById('logo');

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');

  // Swap icons and logo
  if (isDark) {
    themeIcon.src = 'assets/icon-light-theme.svg';
    themeIconMobile.src = 'assets/icon-light-theme.svg';
    logo.src = 'assets/logo-dark.svg';
  } else {
    themeIcon.src = 'assets/icon-dark-theme.svg';
    themeIconMobile.src = 'assets/icon-dark-theme.svg';
    logo.src = 'assets/logo-light.svg';
  }
}

if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
if (themeToggleBtnMobile) themeToggleBtnMobile.addEventListener('click', toggleTheme);