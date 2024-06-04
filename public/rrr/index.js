let imgRenderer;

window.addEventListener('hashchange', () => {
  imgRenderer.refresh(location.hash.slice(1));
});

window.addEventListener('DOMContentLoaded', () => {
  if (location.hash) {
    window.dispatchEvent(new Event('hashchange'));
    return;
  }
  
  const images = document.getElementsByClassName('img');
  const rand = Math.floor(Math.random() * images.length);
  const image = images[rand];

  imgRenderer = new ImageRenderer();
  imgRenderer.start(image);
});
