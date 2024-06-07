const CDN_BUCKET = 'shiboka-com';
const CDN_URL = `https://storage.googleapis.com/download/storage/v1/b/${CDN_BUCKET}/o`;
const AUDIO_DIRECTORY = 'audio';

let player;
let playing = false;

function toggleAudio() {
  playing ? player.pause() : player.play()
  playing = !playing
}

window.addEventListener('DOMContentLoaded', () => {
  player = document.getElementById('player');
  let seekbar = document.getElementById('seekbar');
  const location = document.getElementById('location').textContent;
  const file = location == "client" ? "cotten_eye_joe.mp3" : "boom.mp3"
  const encodedFile = encodeURIComponent(`${AUDIO_DIRECTORY}/${file}`);

  player.src = `${CDN_URL}/${encodedFile}?alt=media`;
  player.loop = true;

  player.addEventListener('timeupdate', () => {
    seekbar.setAttribute("value", player.currentTime / player.duration);
  });
});
