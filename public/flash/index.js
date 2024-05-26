function showPage() {
  document.getElementById('load-msg').classList.remove('hidden');
  document.getElementById('warn-msg').classList.add('hidden');

  if (location.hash) {
    window.dispatchEvent(new Event('hashchange'));
    return;
  }

  const flashes = document.getElementsByClassName('flash');
  const rand = ~~(Math.random() * flashes.length);
  setFlash(flashes[rand].textContent);
}

window.addEventListener('hashchange', () => {
  loader.textContent = '0%';
  loader.classList.remove('hidden');
  player.classList.add('hidden');
  player.pause();
  scroll(0, 0);
  setFlash(decodeURIComponent(location.hash.slice(1)));
});

window.addEventListener('DOMContentLoaded', () => {
  window.RufflePlayer = window.RufflePlayer || {};

  ruffle = window.RufflePlayer.newest();
  player = ruffle.createPlayer();
  container = document.getElementById('container');
  loader = document.getElementById('loader');

  container.appendChild(player);
  player.classList.add('hidden');
});
