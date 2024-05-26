const flash = 'pleaseunderstand.swf';
let msg;

function showFlash() {
  msg.classList.add('hidden');
  player.classList.remove('hidden');
  setFlash(flash, { height: 300, loader: false });
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
});