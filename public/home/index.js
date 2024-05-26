let msg;
const flash = 'pleaseunderstand.swf';

function showFlash() {
  msg.classList.add('hidden');
  player.classList.remove('hidden');
  player.load(`/flash/${flash}`);
}

window.addEventListener('DOMContentLoaded', () => {
  window.RufflePlayer = window.RufflePlayer || {};

  ruffle = window.RufflePlayer.newest();
  player = ruffle.createPlayer();
  container = document.getElementById('flash-container');
  msg = document.getElementById('flash-msg');

  container.appendChild(player);
  player.classList.add('hidden');
  setFlash(flash, { height: 300, loader: false });
});