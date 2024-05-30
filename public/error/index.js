let player;
let playing = false;

function toggleAudio() {
  playing ? player.pause() : player.play()
  playing = !playing
}

window.addEventListener('DOMContentLoaded', () => {
  player = document.getElementById('player');
  let seekbar = document.getElementById('seekbar');
  player.loop = true;

  player.addEventListener('timeupdate', () => {
    seekbar.setAttribute("value", player.currentTime / player.duration);
  });
});
