const FlashLoader = require('../../../public/flash/flash');

describe('setFlash', () => {
  let flashLoader;

  beforeEach(() => {
    flashLoader = new FlashLoader();
    flashLoader.fetchAndSplitData = jest.fn();
    flashLoader.updateTitle = jest.fn();
    flashLoader.calculateDimensions = jest.fn();
    flashLoader.setDimensions = jest.fn();
    flashLoader.setElementsAndLoadFlash = jest.fn();
  });

  it('should fetch and split data, update title, calculate and set dimensions, and load flash if parameters are valid', async () => {
    flashLoader.validateParameters = jest.fn().mockReturnValue(true);
    flashLoader.fetchAndSplitData.mockResolvedValue(['test', 200, 200]);
    flashLoader.calculateDimensions.mockReturnValue({ width: 200, height: 200 });

    await flashLoader.setFlash('test');

    expect(flashLoader.validateParameters).toHaveBeenCalledWith('test');
    expect(flashLoader.fetchAndSplitData).toHaveBeenCalledWith('test');
    expect(flashLoader.updateTitle).toHaveBeenCalledWith('test');
    expect(flashLoader.calculateDimensions).toHaveBeenCalledWith(200, 200);
    expect(flashLoader.setDimensions).toHaveBeenCalledWith(200, 200);
    expect(flashLoader.setElementsAndLoadFlash).toHaveBeenCalledWith('test');
  });

  it('should handle validateParameters failure gracefully', async () => {
    flashLoader.validateParameters = jest.fn().mockReturnValue(false);
    await flashLoader.setFlash('test', {});
    expect(flashLoader.validateParameters).toHaveBeenCalledWith('test');
    expect(flashLoader.fetchAndSplitData).not.toHaveBeenCalled();
  });

  it('should handle error from fetchAndSplitData gracefully', async () => {
    flashLoader.validateParameters = jest.fn().mockReturnValue(true);
    flashLoader.fetchAndSplitData.mockResolvedValue(['error', 200, 200]);
    flashLoader.updateTitle = jest.fn();
    flashLoader.calculateDimensions = jest.fn().mockReturnValue({ width: 200, height: 200 });
    flashLoader.setDimensions = jest.fn();
    flashLoader.setElementsAndLoadFlash = jest.fn();

    await flashLoader.setFlash('test');

    expect(flashLoader.validateParameters).toHaveBeenCalledWith('test');
    expect(flashLoader.fetchAndSplitData).toHaveBeenCalledWith('test');
    expect(flashLoader.updateTitle).toHaveBeenCalledWith('error');
    expect(flashLoader.calculateDimensions).toHaveBeenCalledWith(200, 200);
    expect(flashLoader.setDimensions).toHaveBeenCalledWith(200, 200);
    expect(flashLoader.setElementsAndLoadFlash).toHaveBeenCalledWith('error');
  });

  it('should handle error from updateTitle gracefully', async () => {
    console.error = jest.fn();

    flashLoader.validateParameters = jest.fn().mockReturnValue(true);
    flashLoader.fetchAndSplitData.mockResolvedValue(['test', 200, 200]);
    flashLoader.updateTitle.mockImplementation(() => {
      throw new Error('Test error');
    });

    await expect(flashLoader.setFlash('test')).rejects.toThrow('Test error');

    expect(flashLoader.validateParameters).toHaveBeenCalledWith('test');
    expect(flashLoader.fetchAndSplitData).toHaveBeenCalledWith('test');
    expect(flashLoader.updateTitle).toHaveBeenCalledWith('test');
  });

  it('should handle error from calculateDimensions gracefully', async () => {
    flashLoader.validateParameters = jest.fn().mockReturnValue(true);
    flashLoader.fetchAndSplitData.mockResolvedValue(['test', 200, 200]);
    flashLoader.updateTitle = jest.fn();
    flashLoader.calculateDimensions.mockImplementation(() => {
      throw new Error('Test error');
    });
    flashLoader.setDimensions = jest.fn();
    flashLoader.setElementsAndLoadFlash = jest.fn();

    await expect(flashLoader.setFlash('test')).rejects.toThrow('Test error');

    expect(flashLoader.validateParameters).toHaveBeenCalledWith('test');
    expect(flashLoader.fetchAndSplitData).toHaveBeenCalledWith('test');
    expect(flashLoader.updateTitle).toHaveBeenCalledWith('test');
    expect(flashLoader.calculateDimensions).toHaveBeenCalledWith(200, 200);
  });

  it('should handle error from setDimensions gracefully', async () => {
    flashLoader.validateParameters = jest.fn().mockReturnValue(true);
    flashLoader.fetchAndSplitData.mockResolvedValue(['test', 200, 200]);
    flashLoader.updateTitle = jest.fn();
    flashLoader.calculateDimensions.mockReturnValue({ width: 200, height: 200 });
    flashLoader.setDimensions.mockImplementation(() => {
      throw new Error('Test error');
    });
    flashLoader.setElementsAndLoadFlash = jest.fn();

    await expect(flashLoader.setFlash('test')).rejects.toThrow('Test error');

    expect(flashLoader.validateParameters).toHaveBeenCalledWith('test');
    expect(flashLoader.fetchAndSplitData).toHaveBeenCalledWith('test');
    expect(flashLoader.updateTitle).toHaveBeenCalledWith('test');
    expect(flashLoader.calculateDimensions).toHaveBeenCalledWith(200, 200);
    expect(flashLoader.setDimensions).toHaveBeenCalledWith(200, 200);
  });

  it('should handle error from setElementsAndLoadFlash gracefully', async () => {
    flashLoader.validateParameters = jest.fn().mockReturnValue(true);
    flashLoader.fetchAndSplitData.mockResolvedValue(['test', 200, 200]);
    flashLoader.updateTitle = jest.fn();
    flashLoader.calculateDimensions.mockReturnValue({ width: 200, height: 200 });
    flashLoader.setDimensions = jest.fn();
    flashLoader.setElementsAndLoadFlash.mockImplementation(() => {
      throw new Error('Test error');
    });

    await expect(flashLoader.setFlash('test')).rejects.toThrow('Test error');

    expect(flashLoader.validateParameters).toHaveBeenCalledWith('test');
    expect(flashLoader.fetchAndSplitData).toHaveBeenCalledWith('test');
    expect(flashLoader.updateTitle).toHaveBeenCalledWith('test');
    expect(flashLoader.calculateDimensions).toHaveBeenCalledWith(200, 200);
    expect(flashLoader.setDimensions).toHaveBeenCalledWith(200, 200);
    expect(flashLoader.setElementsAndLoadFlash).toHaveBeenCalledWith('test');
  });
});

describe('validateParameters', () => {
  let flashLoader;

  beforeEach(() => {
    flashLoader = new FlashLoader();
  });

  it('should return true when the input is a string', () => {
    const result = flashLoader.validateParameters('test');
    expect(result).toBe(true);
  });

  it('should return false when the input is not a string', () => {
    const result = flashLoader.validateParameters(123);
    expect(result).toBe(false);
  });

  it('should log an error when the input is not a string', () => {
    console.error = jest.fn();
    flashLoader.validateParameters(123);
    expect(console.error).toHaveBeenCalledWith('Invalid parameters for setFlash');
  });
});

describe('fetchAndSplitData', () => {
  let flashLoader;

  beforeEach(() => {
    flashLoader = new FlashLoader();
  });

  it('should return an array of data split by newlines', async () => {
    const flash = 'test\n200\n200';
    flashLoader.fetchFlash = jest.fn().mockResolvedValue(flash);

    const result = await flashLoader.fetchAndSplitData('flash');

    expect(result).toEqual(['test', '200', '200']);
  });

  it('should return an array with an error message and default dimensions when an error occurs', async () => {
    const error = new Error('Test error');
    flashLoader.fetchFlash = jest.fn().mockRejectedValue(error);

    const result = await flashLoader.fetchAndSplitData('flash');

    expect(result).toEqual(['error', 200, 200]);
  });
});

describe('fetchFlash', () => {
  let flashLoader;
  let FLASH_DIRECTORY = 'flash';

  beforeAll(() => {
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    flashLoader = new FlashLoader();
    fetch.mockClear();
  });

  it('fetches successfully data from an API', async () => {
    const flash = 'flash';
    const data = 'data';
    fetch.mockImplementationOnce(() => Promise.resolve({ text: () => data }));

    const result = await flashLoader.fetchFlash(flash);

    expect(fetch).toHaveBeenCalledWith(`${FLASH_DIRECTORY}?f=${flash}`);
    expect(result).toEqual(data);
  });

  it('throws an error when network request fails', async () => {
    const flash = 'flash';
    fetch.mockImplementationOnce(() => Promise.reject(new Error('API is down')));

    await expect(flashLoader.fetchFlash(flash)).rejects.toThrow('API is down');
  });
});

describe('updateTitle', () => {
  let flashLoader;

  beforeEach(() => {
    flashLoader = new FlashLoader();
  });

it('should update the title with the flash name', () => {
    let title = document.createElement('div');
    title.id = 'title';

    document.body.appendChild(title);
    flashLoader.updateTitle('test');

    expect(document.getElementById('title').textContent).toBe('test');
    document.body.removeChild(title);
});

  it('should log an error when an error occurs', () => {
    console.error = jest.fn();
    flashLoader.updateTitle('test');
    
    expect(console.error).toHaveBeenCalledWith('Failed to update title: Cannot set properties of null (setting \'textContent\')');
  });
});

describe('calculateDimensions', () => {
  let WINDOW_PADDING = 60;
  let flashLoader;
  let originalWindowWidth;

  beforeAll(() => {
    originalWindowWidth = window.innerWidth;
  });

  beforeEach(() => {
    flashLoader = new FlashLoader();
  });

  afterEach(() => {
    window.innerWidth = originalWindowWidth;
  });

  it('should calculate dimensions based on window width if window width is less than maxWidth', () => {
    window.innerWidth = 300;
    let width = 1000;
    let height = 1000;
    let aspectRatio = width / height;
    let expectedWidth = 300 - WINDOW_PADDING;
    let expectedHeight = expectedWidth / aspectRatio;

    const dimensions = flashLoader.calculateDimensions(width, height);
    expect(dimensions).toEqual({ width: expectedWidth, height: expectedHeight });
  });

  it('should return original dimensions if height is less than MAX_HEIGHT', () => {
    window.innerWidth = 2000;
    const dimensions = flashLoader.calculateDimensions(300, 300);
    expect(dimensions).toEqual({ width: 300, height: 300 });
  });

  it('should return dimensions with MAX_HEIGHT if height is more than MAX_HEIGHT', () => {
    window.innerWidth = 2000;
    const dimensions = flashLoader.calculateDimensions(1000, 1000);
    expect(dimensions).toEqual({ width: 500, height: 500 });
  });

  it('should handle errors and return default dimensions', () => {
    console.error = jest.fn();
    const dimensions = flashLoader.calculateDimensions(null, null);
    expect(dimensions).toEqual({ width: 200, height: 200 });
    expect(console.error).toHaveBeenCalledWith('Failed to calculate dimensions: Invalid dimensions');
  });
});

describe('setDimensions', () => {
  let flashLoader;
  let containerMock;
  let playerMock;

  beforeEach(() => {
    flashLoader = new FlashLoader();
    containerMock = { style: { width: '', height: '' } };
    playerMock = { setAttribute: jest.fn() };
    flashLoader.container = containerMock;
    flashLoader.player = playerMock;
  });

  it('should set the dimensions correctly', () => {
    flashLoader.setDimensions(100, 200);
    expect(containerMock.style.width).toBe('100px');
    expect(containerMock.style.height).toBe('200px');
    expect(playerMock.setAttribute).toHaveBeenCalledWith('width', 100);
    expect(playerMock.setAttribute).toHaveBeenCalledWith('height', 200);
  });

  it('should handle errors correctly', () => {
    console.error = jest.fn();
    playerMock.setAttribute = jest.fn(() => { throw new Error('Test error'); });
    flashLoader.setDimensions(100, 200);
    expect(console.error).toHaveBeenCalledWith('Failed to set dimensions: Test error');
  });
});

describe('setElementsAndLoadFlash', () => {
  let flashLoader;
  let mockFlash;

  beforeEach(() => {
    flashLoader = new FlashLoader();
    mockFlash = 'mockFlash';
    document.getElementById = jest.fn();
    flashLoader.loadFlashWithRuffle = jest.fn();
  });

  it('should call setElementsAndLoadFlash correctly', () => {
    const mockContentElement = {};
    const mockLoadMsgElement = {};
    const mockMsgContentElement = {};
    document.getElementById
      .mockReturnValueOnce(mockContentElement)
      .mockReturnValueOnce(mockLoadMsgElement)
      .mockReturnValueOnce(mockMsgContentElement);

    flashLoader.setElementsAndLoadFlash(mockFlash);

    expect(document.getElementById).toHaveBeenCalledWith('content');
    expect(document.getElementById).toHaveBeenCalledWith('load-msg');
    expect(document.getElementById).toHaveBeenCalledWith('msg-content');
    expect(flashLoader.loadFlashWithRuffle).toHaveBeenCalledWith(mockFlash, mockContentElement, mockLoadMsgElement, mockMsgContentElement);
  });

  it('should handle errors correctly', () => {
    const testError = new Error('Test error');
    console.error = jest.fn();
    document.getElementById.mockImplementation(() => { throw testError; });

    expect(() => flashLoader.setElementsAndLoadFlash(mockFlash)).toThrow(testError);
    expect(console.error).toHaveBeenCalledWith(`Failed to load flash: ${testError.message}`);
  });
});

describe('loadFlashWithRuffle', () => {
  let FLASH_DIRECTORY = 'flash';
  let flashLoader;
  let mockFlash;

  beforeEach(() => {
    flashLoader = new FlashLoader();
    mockFlash = 'mockFlash';
    flashLoader.player = { load: jest.fn().mockResolvedValue() };
    flashLoader.loadFlash = jest.fn();
  });

  it('should call loadFlashWithRuffle correctly', async () => {
    const mockContentElement = { classList: { remove: jest.fn(), add: jest.fn() } };
    const mockLoadMsgElement = { classList: { remove: jest.fn(), add: jest.fn() } };
    const mockMsgContentElement = { classList: { remove: jest.fn(), add: jest.fn() } };

    await flashLoader.loadFlashWithRuffle(mockFlash, mockContentElement, mockLoadMsgElement, mockMsgContentElement);

    expect(flashLoader.player.load).toHaveBeenCalledWith(`${FLASH_DIRECTORY}/ruffle/loader.swf`);
    expect(mockContentElement.classList.remove).toHaveBeenCalledWith('hidden');
    expect(mockLoadMsgElement.classList.add).toHaveBeenCalledWith('hidden');
    expect(mockMsgContentElement.classList.add).toHaveBeenCalledWith('hidden');
    expect(flashLoader.loadFlash).toHaveBeenCalledWith(mockFlash);
  });

  it('should handle errors in loadFlashWithRuffle correctly', () => {
    const testError = new Error('Test error');
    console.error = jest.fn();
    flashLoader.player.load.mockImplementation(() => { throw testError; });

    flashLoader.loadFlashWithRuffle(mockFlash);

    expect(console.error).toHaveBeenCalledWith(`Failed to load flash into Ruffle: ${testError.message}`);
  });
});

describe('loadFlash', () => {
  let flashLoader;

  beforeAll(() => {
    global.fetch = jest.fn();
    global.ReadableStream = jest.fn();
    global.Response = jest.fn();
  });

  beforeEach(() => {
    flashLoader = new FlashLoader();
    fetch.mockClear();
    ReadableStream.mockClear();
    Response.mockClear();
  });

  it('should load flash correctly', async () => {
    const mockFlash = 'testFlash';
    const mockData = new Uint8Array([1, 2, 3]);

    fetch.mockResolvedValueOnce({
      headers: { get: jest.fn().mockReturnValue(100) },
      body: { getReader: jest.fn().mockReturnValue({
        read: jest.fn().mockResolvedValueOnce({ done: true })
      }) }
    });

    ReadableStream.mockImplementation(() => ({ getReader: jest.fn() }));
    Response.mockImplementation(() => ({ arrayBuffer: jest.fn().mockResolvedValueOnce(mockData) }));

    await flashLoader.loadFlash(mockFlash);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(ReadableStream).toHaveBeenCalledTimes(1);
    expect(Response).toHaveBeenCalledTimes(1);
  });

  it('should handle errors correctly', async () => {
    const mockFlash = 'testFlash';

    fetch.mockRejectedValueOnce(new Error('Fetch error'));
    await flashLoader.loadFlash(mockFlash);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith('Failed to load flash: Fetch error');
  });
});