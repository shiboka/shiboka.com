const ImageRenderer = require('../../../public/rrr/rrr'); // adjust the path to your rrr.js file

describe('loadImg', () => {
  it('should load an image correctly', () => {
    global.Image = jest.fn(() => ({
      addEventListener: jest.fn((event, callback) => {
        if (event === 'load') {
          callback();
        }
      }),
      crossOrigin: '',
      src: '',
    }));

    window.innerWidth = 800;
    document.getElementById = jest.fn(id => {
      if (id === 'img-ref' || id === 'cnv') {
        return {
          getContext: jest.fn(() => ({
            drawImage: jest.fn(),
            fillRect: jest.fn(),
          })),
          width: 0,
          height: 0,
        };
      }
    });

    const renderer = new ImageRenderer();
    renderer.loadImg('test.jpg');

    expect(renderer.img.crossOrigin).toBe('anonymous');
    expect(renderer.img.src).toContain('test.jpg');
    expect(renderer.width).toBeDefined();
    expect(renderer.height).toBeDefined();
  });

  it('should handle an error loading an image', () => {
    console.error = jest.fn();

    global.Image = jest.fn(() => ({
      addEventListener: jest.fn((event, callback) => {
        if (event === 'error') {
          callback('Failed to load image');
        }
      }),
      crossOrigin: '',
      src: '',
    }));

    const renderer = new ImageRenderer();
    renderer.loadImg('test.jpg');

    expect(console.error).toHaveBeenCalledWith('Error loading image: Failed to load image');
  });
});

describe('renderPixels', () => {
  let renderer;

  beforeEach(() => {
    const mockCanvas = {
      getContext: jest.fn(() => ({
        getImageData: jest.fn(() => ({ data: [255, 255, 255, 255] })),
        fillRect: jest.fn(),
      })),
      width: 500,
      height: 500,
    };

    document.getElementById = jest.fn(() => mockCanvas);

    renderer = new ImageRenderer();
  });

  it('should render pixels without errors', () => {
    expect(() => {
      renderer.renderPixels();
    }).not.toThrow();
  });

  it('should call fillRect the correct number of times', () => {
    renderer.renderPixels();
    expect(renderer.cnvCtx.fillRect).toHaveBeenCalledTimes(renderer.pxlAmount);
  });

  it('should decrease the pixel size', () => {
    const initialSize = renderer.pxlSize;
    renderer.renderPixels();
    expect(renderer.pxlSize).toBeLessThan(initialSize);
  });

  it('should increase the pixel amount', () => {
    const initialAmount = renderer.pxlAmount;
    renderer.renderPixels();
    expect(renderer.pxlAmount).toBeGreaterThan(initialAmount);
  });

  it('should reset the render step', () => {
    renderer.renderStep = renderer.pxlMaxSize * renderer.pxlAmp;
    renderer.renderPixels();
    expect(renderer.renderStep).toBe(1);
  });

  it('should handle an error getting image data', () => {
    console.error = jest.fn();
    renderer.imgRefCtx.getImageData = jest.fn(() => {
      throw new Error('Failed to get image data');
    });

    renderer.renderPixels();
    expect(console.error).toHaveBeenCalledWith('Error getting image data: Failed to get image data');
  });

  it('should handle an error rendering pixels', () => {
    console.error = jest.fn();
    renderer.cnvCtx.fillRect = jest.fn(() => {
      throw new Error('Failed to render pixels');
    });

    renderer.renderPixels();
    expect(console.error).toHaveBeenCalledWith('Error rendering pixels: Failed to render pixels test');
  });
});