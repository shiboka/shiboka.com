const CDN_BUCKET = 'shiboka-com';
const CDN_URL = `https://storage.googleapis.com/download/storage/v1/b/${CDN_BUCKET}/o`;
const IMAGE_DIRECTORY = 'rrr';
const MAX_HEIGHT = 500;
const WINDOW_PADDING = 60;
const MAX_STEP = 200;

class ImageRenderer {
  constructor() {
    this.interval = null;
    this.delay = 10;
    this.pxlMaxSize = 80;
    this.pxlMinSize = 4;
    this.pxlSize = this.pxlMaxSize;
    this.pxlAmp = 20;
    this.pxlAmount = 1;
    this.renderStep = 0;
    this.imgRef = document.getElementById('img-ref');
    this.imgRefCtx = this.imgRef.getContext('2d');
    this.cnv = document.getElementById('cnv');
    this.cnvCtx = this.cnv.getContext('2d');
  }
  
  renderPixels() {
    try {
      // makes the size decrease at a nice rate
      if (!(this.renderStep % (Math.floor(this.pxlMaxSize / this.pxlSize) * this.pxlAmp)) && this.pxlSize > this.pxlMinSize)
        this.pxlSize--;
      
      // increase amount of rects per 200 iterations
      if (!(this.renderStep % MAX_STEP))
        this.pxlAmount++;
      
      // this is as high as we need to count to
      if (this.renderStep == this.pxlMaxSize * this.pxlAmp)
        this.renderStep = 0;
      
      // finally, draw the rects onto the canvas.
      for (let i = 0; i < this.pxlAmount; i++) {
        let x = Math.floor(Math.random() * this.cnv.width);
        let y = Math.floor(Math.random() * this.cnv.height);
        let pxl;

        try {
          pxl = this.imgRefCtx.getImageData(x, y, 1, 1).data;
        } catch (e) {
          console.error(`Error getting image data: ${e}`);
        }

        this.cnvCtx.fillStyle = `rgb(${pxl[0]}, ${pxl[1]}, ${pxl[2]})`;
        this.cnvCtx.fillRect(x - this.pxlSize / 2, y - this.pxlSize / 2, this.pxlSize, this.pxlSize);
      }
      
      this.renderStep++;
    } catch (e) {
      console.error(`Error rendering pixels: ${e}`);
    }
  }
  
  loadImg(file) {
    try {
      this.img = new Image();
      this.img.crossOrigin = 'anonymous';
      const encodedFile = encodeURIComponent(`${IMAGE_DIRECTORY}/${file}`);
      this.img.src = `${CDN_URL}/${encodedFile}?alt=media`;

      this.img.addEventListener('error', (e) => {
        console.error(`Error loading image: ${e}`);
      });
    
      this.img.addEventListener('load', () => {
        // set up the canvas and draw the image
        const aspectRatio = this.img.height / this.img.width;
        const maxWidth = Math.floor(MAX_HEIGHT / aspectRatio);
        const windowWidth = window.innerWidth;
      
        if (windowWidth > maxWidth) {
          this.width = maxWidth;
        } else {
          this.width = windowWidth - WINDOW_PADDING;
          this.pxlMaxSize = 60;
          this.pxlMinSize = 2;
        }
      
        this.height = this.width * aspectRatio;
      
        this.imgRef.width = this.width;
        this.imgRef.height = this.height;
        this.cnv.width = this.width;
        this.cnv.height = this.height;
      
        this.imgRefCtx.drawImage(this.img, 0, 0, this.width, this.height);
      
        // reset values for the render loop
        this.renderStep = 0;
        this.pxlAmount = 1;
        this.pxlSize = this.pxlMaxSize;
      
        // clear canvas and start render loop
        this.cnvCtx.fillStyle = 'black';
        this.cnvCtx.fillRect(0, 0, this.width, this.height);
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