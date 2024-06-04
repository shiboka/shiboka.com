const IMAGE_DIRECTORY = '/rrr';
const MAX_HEIGHT = 700;
const WINDOW_PADDING = 60;
const MAX_STEP = 200;

class ImageRenderer {
  constructor() {
    this.interval = null;
    this.delay = 10;
    this.pxl_max_size = 80;
    this.pxl_min_size = 4;
    this.pxl_size = this.pxl_max_siz
    this.pxl_amp = 20;
    this.pxl_amount = 1;
    this.render_step = 0;
    this.img_ref = document.getElementById('img-ref');
    this.img_ref_ctx = this.img_ref.getContext('2d');
    this.cnv = document.getElementById('cnv');
    this.cnv_ctx = this.cnv.getContext('2d');
  }
  
  renderPixels() {
    try {
      // makes the size decrease at a nice rate
      if (!(this.render_step % (Math.floor(this.pxl_max_size / this.pxl_size) * this.pxl_amp)) && this.pxl_size > this.pxl_min_size)
        this.pxl_size--;
      
      // increase amount of rects per 200 iterations
      if (!(this.render_step % MAX_STEP))
        this.pxl_amount++;
      
      // this is as high as we need to count to
      if (this.render_step == this.pxl_max_size * this.pxl_pxl_amp)
        this.render_step = 0;
      
      // finally, draw the rects onto the canvas.
      for (let i = 0; i < this.pxl_amount; i++) {
        let x = Math.floor(Math.random() * this.cnv.width);
        let y = Math.floor(Math.random() * this.cnv.height);
        let pxl;

        try {
          pxl = this.img_ref_ctx.getImageData(x, y, 1, 1).data;
        } catch (e) {
          console.error(`Error getting image data: ${e}`);
        }

        this.cnv_ctx.fillStyle = `rgb(${pxl[0]}, ${pxl[1]}, ${pxl[2]})`;
        this.cnv_ctx.fillRect(x - this.pxl_size / 2, y - this.pxl_size / 2, this.pxl_size, this.pxl_size);
      }
      
      this.render_step++;
    } catch (e) {
      console.error(`Error rendering pixels: ${e}`);
    }
  }
  
  loadImg(file) {
    try {
      this.img = new Image();
      this.img.src = `${IMAGE_DIRECTORY}/${file}`;

      this.img.addEventListener('error', (e) => {
        console.error(`Error loading image: ${e}`);
      });
    
      this.img.addEventListener('load', () => {
        // set up the canvas and draw the image
        const aspectRatio = this.img.height / this.img.width;
        const maxWidth = Math.floor(aspectRatio * MAX_HEIGHT);
        const windowWidth = window.innerWidth;
      
        if (windowWidth > maxWidth) {
          this.width = maxWidth;
        } else {
          this.width = windowWidth - WINDOW_PADDING;
          this.pxl_max_size = 60;
          this.pxl_min_size = 2;
        }
      
        this.height = this.width * aspectRatio;
      
        this.img_ref.width = this.width;
        this.img_ref.height = this.height;
        this.cnv.width = this.width;
        this.cnv.height = this.height;
      
        this.img_ref_ctx.drawImage(this.img, 0, 0, this.width, this.height);
      
        // reset values for the render loop
        this.render_step = 0;
        this.pxl_amount = 1;
        this.pxl_size = this.pxl_max_size;
      
        // clear canvas and start render loop
        this.cnv_ctx.fillStyle = 'black';
        this.cnv_ctx.fillRect(0, 0, this.width, this.height);
        this.interval = window.setInterval(() => this.renderPixels(), this.delay);
      });
    } catch (e) {
      console.error(`Error loading image: ${e}`);
    }
  }
  
  refresh(image) {
    clearInterval(this.interval);
    this.loadImg(image);
  }
  
  start(image) {
    this.loadImg(image.textContent);
  }
}