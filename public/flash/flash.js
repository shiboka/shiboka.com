let ruffle;
let player;
let container;
let loader;
let ruffleReady = false;

let defaultOptions = {
  height: 700,
  loader: true,
}

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

function setFlash(flash, options = defaultOptions) {
  fetch(`/flash?f=${flash}`).then((res) => {
    return res.text();
  }).then((data) => {
    const [f, w, h] = data.split('\n');

    if (options.loader)
      document.getElementById('title').textContent = f;

    const maxHeight = options.height;
    const maxWidth = ~~(w / (h / maxHeight));
    let width, height;

    if (parseInt(h) < maxHeight) {
      width = w;
      height = h;
    } else {
      width = maxWidth;
      height = maxHeight;
    }

    const setResponsiveVideo = () => {
      const aspectRatio = height / width;
      const windowWidth = window.innerWidth;
      const newWidth = windowWidth > width ? width : windowWidth - 60;
      const newHeight = newWidth * aspectRatio;

      container.style.width = `${newWidth}px`;
      container.style.height = `${newHeight}px`;
      player.setAttribute('width', newWidth);
      player.setAttribute('height', newHeight);
    };

    setResponsiveVideo();

    if (options.loader) {
      if (ruffleReady) {
        loadFlash(f);
        return;
      }

      player.load('/flash/ruffle/loader.swf').then(() => {
        ruffleReady = true;
        document.getElementById('content').classList.remove('hidden');
        document.getElementById('load-msg').classList.add('hidden');
        document.getElementById('msg-content').classList.add('hidden');
        loadFlash(f);
      });
    }
  });
}


