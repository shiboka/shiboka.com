let playing = false;

function toggleAudio() {
  let player = document.getElementById('player');

  playing ? player.pause() : player.play();
  playing = !playing;
}

window.addEventListener('DOMContentLoaded', () => {
  let player = document.getElementById('player');
  let seekbar = document.getElementById('seekbar');
  player.loop = true;

  player.addEventListener('timeupdate', () => {
    seekbar.setAttribute("value", player.currentTime / player.duration);
  });
});
