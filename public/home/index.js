const audio = new Audio('/sound/lains_theme.mp3');
audio.loop = true;
let playing = false;

document.getElementById('home_img').onclick = function() {
	playing ? audio.pause() : audio.play();
	playing = !playing;
}

