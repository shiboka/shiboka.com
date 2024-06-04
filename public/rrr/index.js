let imgRenderer;

window.addEventListener('hashchange', () => {
  imgRenderer.refresh(decodeURIComponent(location.hash.substring(1)));
});

window.addEventListener('DOMContentLoaded', () => {
  const images = document.getElementsByClassName('img');
  const rand = Math.floor(Math.random() * images.length);
  const image = images[rand];

  imgRenderer = new ImageRenderer();

  if (location.hash) {
    window.dispatchEvent(new Event('hashchange'));
    return;
  }

  imgRenderer.start(image);
});
