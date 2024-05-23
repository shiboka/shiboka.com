const maxHeight = 700;
let ruffle;
let player;
let container;
let loader;
let ruffleReady = false;

let settings = {
  warnOnUnsupportedContent: false
};

function loadFlash(flash) {
  if (flash == 'error')
    return;

  fetch(`/flash/${flash}`).then((res) => {
    let loadedBytes = 0;
    let totalBytes = res.headers.get('Content-Length');
    const reader = res.body.getReader();

    return new ReadableStream({
      start(controller) {
        function push() {
          reader.read().then(({done, value}) => {
            if (done) {
              controller.close();
              return;
            }

            controller.enqueue(value);
            loadedBytes += value.byteLength;
            loader.textContent = ~~(loadedBytes / totalBytes * 100) + '%';
            push();
          });
        }

        push();
      }
    });
  }).then(async (stream) => {
    const data = await new Response(stream).arrayBuffer();
    settings.data = new Uint8Array(data);

    player.load(settings).then(() => {
      player.classList.remove('hidden');
      loader.classList.add('hidden');
    });
  });
}

function setFlash(flash) {
  fetch(`?f=${flash}`).then((res) => {
    return res.text();
  }).then((data) => {
    const [f, w, h] = data.split('\n');

    document.getElementById('title').textContent = f;

    const maxWidth = ~~(w / (h / maxHeight));
    let width, height;

    if (parseInt(h) < maxHeight) {
      width = w;
      height = h;
    } else {
      width = maxWidth;
      height = maxHeight;
    }

    container.style.height = `${height}px`;
    container.style.width = `${width}px`;
    player.setAttribute('width', width);
    player.setAttribute('height', height);

    if (ruffleReady) {
      loadFlash(f);
      return;
    }

    player.load('/flash/ruffle/loader.swf').then(() => {
      ruffleReady = true;
      document.getElementById('content').classList.remove('hidden');
      document.getElementById('load-msg').classList.add('hidden');
      loadFlash(f);
    });
  });
}

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
