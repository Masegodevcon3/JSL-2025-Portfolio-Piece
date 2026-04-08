const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-sidebar');
const sidebarIcon = document.getElementById('sidebar-icon');
const mobileMenu = document.getElementById('mobile-menu');
const openMobileBtn = document.getElementById('open-mobile');
const closeMobileBtn = document.getElementById('close-mobile');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
  // Swap icon based on visibility
  if (sidebar.classList.contains('hidden')) {
    sidebarIcon.src = 'assets/icon-show-sidebar.svg';
  } else {
    sidebarIcon.src = 'assets/icon-hide-sidebar.svg';
  }
});

openMobileBtn.addEventListener('click', () => {
  mobileMenu.classList.remove('hidden');
});
closeMobileBtn.addEventListener('click', () => {
  mobileMenu.classList.add('hidden');
});