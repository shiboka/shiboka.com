// Declare flashLoader in the global scope
let flashLoader;

// Function to show the page
function showPage() {
  document.getElementById('load-msg').classList.remove('hidden');
  document.getElementById('warn-msg').classList.add('hidden');

  if (location.hash) {
    window.dispatchEvent(new Event('hashchange'));
    return;
  }

  const flashes = document.getElementsByClassName('flash');
  const rand = ~~(Math.random() * flashes.length);
  flashLoader.setFlash(flashes[rand].textContent);
}

// Event listener for DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  window.RufflePlayer = window.RufflePlayer || {};

  // Initialize flashLoader
  flashLoader = new FlashLoader();
  flashLoader.ruffle = window.RufflePlayer.newest();
  flashLoader.player = flashLoader.ruffle.createPlayer();
  flashLoader.container = document.getElementById('container');
  flashLoader.loader = document.getElementById('loader');

  flashLoader.container.appendChild(flashLoader.player);
  flashLoader.player.classList.add('hidden');

  let enterLink = document.getElementById('enter-link');
  enterLink.addEventListener('click', showPage);
});

// Event listener for hashchange
window.addEventListener('hashchange', () => {
  flashLoader.loader.textContent = '0%';
  flashLoader.loader.classList.remove('hidden');
  flashLoader.player.classList.add('hidden');
  flashLoader.player.pause();
  scroll(0, 0);
  flashLoader.setFlash(decodeURIComponent(location.hash.slice(1)));
});
