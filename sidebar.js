const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-sidebar');
const mobileMenu = document.getElementById('mobile-menu');
const openMobileBtn = document.getElementById('open-mobile');
const closeMobileBtn = document.getElementById('close-mobile');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
});

openMobileBtn.addEventListener('click', () => {
  mobileMenu.classList.remove('hidden');
});

closeMobileBtn.addEventListener('click', () => {
  mobileMenu.classList.add('hidden');
});