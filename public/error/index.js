window.addEventListener('DOMContentLoaded', () => {
  window.RufflePlayer = window.RufflePlayer || {};

  let ruffle = window.RufflePlayer.newest();
  let player = ruffle.createPlayer();
  let container = document.getElementById('container');

  container.appendChild(player);
  player.load('/error/404.swf');
});
