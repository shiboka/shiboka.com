// variables for the image and canvas
const maxWidth = 600;
let width;
let height;
let img;
let img_ref;
let img_ref_ctx;
let cnv_ctx;

// variables for the render loop
const delay = 10;
let max_size = 80;
const min_size = 4;
const amp = 20;
let interval;
let step;
let amount;
let size;

function renderPixels() {
  // makes the size decrease at a nice rate
  if (!(step % (~~(max_size/size)*amp)) && size > min_size)
    size--;

  // increase amount of rects per 200 iterations
  if (!(step % 200))
    amount++;

  // this is as high as we need to count to
  if (step == max_size * amp)
    step = 0;

  // finally, draw the rects onto the canvas.
  for (let i = 0; i < amount; i++) {
    let x = ~~(Math.random() * width);
    let y = ~~(Math.random() * height);
    let pxl = img_ref_ctx.getImageData(x, y, 1, 1).data;
    cnv_ctx.fillStyle = `rgb(${pxl[0]}, ${pxl[1]}, ${pxl[2]})`;
    cnv_ctx.fillRect(x - size/2, y - size/2, size, size);
  }

  step++;
}

function loadImg(file) {
  img = new Image();
  img.src = `/rrr/${file}`;

  img.addEventListener('load', () => {
    // set up the canvas and draw the image
    maxHeight = ~~(img.height / (img.width / maxWidth));

    const setResponsiveVideo = () => {
      const aspectRatio = maxHeight / maxWidth;
      const windowWidth = window.innerWidth;
 
      if (windowWidth > maxWidth) {
        width = maxWidth;
      } else {
        width = windowWidth - 60;
        max_size = 60;
      }

      height = width * aspectRatio;

      img_ref.width = width;
      img_ref.height = height;
      cnv.width = width;
      cnv.height = height;
    };

    setResponsiveVideo();

    img_ref_ctx.drawImage(img, 0, 0, width, height);

    // reset values for the render loop
    step = 0;
    amount = 1;
    size = max_size;

    // clear canvas and start render loop
    cnv_ctx.fillStyle = 'black';
    cnv_ctx.fillRect(0, 0, width, height);
    interval = window.setInterval(renderPixels, delay);
  });
}

window.addEventListener('hashchange', () => {
  clearInterval(interval);
  loadImg(decodeURIComponent(location.hash.slice(1)));
});

window.addEventListener('DOMContentLoaded', () => {
  img_ref = document.getElementById('img-ref');
  img_ref_ctx = img_ref.getContext('2d');

  const cnv = document.getElementById('cnv');
  cnv_ctx = cnv.getContext('2d');

  if (location.hash) {
    window.dispatchEvent(new Event('hashchange'));
    return;
  }

  const images = document.getElementsByClassName('img');
  const rand = ~~(Math.random() * images.length);
  loadImg(images[rand].textContent);
});
