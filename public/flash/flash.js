const FLASH_DIRECTORY = '/flash';
const MAX_HEIGHT = 700;
const WINDOW_PADDING = 60;

class FlashLoader {
  constructor() {
    this.ruffle = null;
    this.player = null;
    this.container = null;
    this.loader = null;
    this.ruffleReady = false;
    this.defaultOptions = {
      loader: true,
    };
    this.settings = {
      warnOnUnsupportedContent: false
    };
  }
  
  // Add type checking
  async setFlash(flash, options = this.defaultOptions) {
    try {
      if (!this.validateParameters(flash, options)) return;
    
      const data = await this.fetchAndSplitData(flash);
      if (!data) return;
    
      const [f, w, h] = data;
      this.updateTitle(f, options);
    
      const { width, height } = this.calculateDimensions(w, h);
      this.setDimensions(width, height);
    
      if (options.loader) this.setElementsAndLoadFlash(f);
    } catch (e) {
      console.error(`Failed to set flash: ${e}`);
    }
  }
  
  validateParameters(flash, options) {
    if (typeof flash !== 'string' || typeof options !== 'object') {
      console.error('Invalid parameters for setFlash');
      return false;
    }
    return true;
  }

  updateTitle(flash, options) {
    try {
      const titleElement = document.getElementById('title');
      if (options.loader) titleElement.textContent = flash;
    } catch (e) {
      console.error(`Failed to update title: ${e}`);
    }
  }
  
  setElementsAndLoadFlash(flash) {
    try {
      const contentElement = document.getElementById('content');
      const loadMsgElement = document.getElementById('load-msg');
      const msgContentElement = document.getElementById('msg-content');
      this.loadFlashWithRuffle(flash, contentElement, loadMsgElement, msgContentElement);
    } catch (e) {
      console.error(`Failed to load flash: ${e}`);
    }
  }
  
  async fetchAndSplitData(flash) {
    try {
      const data = await this.fetchFlash(flash);
      return data.split('\n');
    } catch (e) {
      console.error(`Failed to parse flash data: ${e}`);
      return ['error', 200, 200];
    }
  }
  
  async fetchFlash(flash) {
    try {
      const res = await fetch(`${FLASH_DIRECTORY}?f=${flash}`);
      return await res.text();
    } catch (e) {
      console.error(`Failed to fetch flash data: ${e}`);
      return null;
    }
  }
  
  calculateDimensions(w, h) {
    try {
      const aspectRatio = w / h;
      const maxWidth = MAX_HEIGHT * aspectRatio;
      const windowWidth = window.innerWidth;
      const width = windowWidth > maxWidth ? maxWidth : windowWidth - WINDOW_PADDING;
      const height = width / aspectRatio;
      return { width, height };
    } catch (e) {
      console.error(`Failed to calculate dimensions: ${e}`);
      return { width: 200, height: 200 };
    }
  }
  
  setDimensions(width, height) {
    try {
      this.container.style.width = `${width}px`;
      this.container.style.height = `${height}px`;
      this.player.setAttribute('width', width);
      this.player.setAttribute('height', height);
    } catch (e) {
      console.error(`Failed to set dimensions: ${e}`);
    }
  }
  
  loadFlashWithRuffle(f, contentElement, loadMsgElement, msgContentElement) {
    try {
      if (this.ruffleReady) {
        this.loadFlash(f);
        return;
      }
    
      this.player.load(`${FLASH_DIRECTORY}/ruffle/loader.swf`).then(() => {
        this.ruffleReady = true;
        contentElement.classList.remove('hidden');
        loadMsgElement.classList.add('hidden');
        msgContentElement.classList.add('hidden');
        this.loadFlash(f);
      });
    } catch (e) {
      console.error(`Failed to load flash into Ruffle: ${e}`);
    }
  }
  
  async loadFlash(flash) {
    try {
      if (flash == 'error') return;
    
      const res = await fetch(`${FLASH_DIRECTORY}/${flash}`);
      let loadedBytes = 0;
      const totalBytes = res.headers.get('Content-Length');
      const reader = res.body.getReader();
    
      const stream = new ReadableStream({
        start: async (controller) => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            loadedBytes += value.byteLength;
            this.loader.textContent = ~~(loadedBytes / totalBytes * 100) + '%';
          }
        }
      });
    
      const data = await new Response(stream).arrayBuffer();
      this.settings.data = new Uint8Array(data);
    
      await this.player.load(this.settings);
      this.player.classList.remove('hidden');
      this.loader.classList.add('hidden');
    } catch (e) {
      console.error(`Failed to load flash: ${e}`);
    }
  }
}