import { Renderer } from './renderer';
import { Layer, VerticalAlign, TextAlign } from './layer';

class TestRenderer extends Renderer {
  async loadImage(uri: string) {
    return new Image(300, 100);
  }
}

describe('renderer', () => {
  let canvas: HTMLCanvasElement;
  let renderer: TestRenderer;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;

    ctx = canvas.getContext('2d')!;
    renderer = new TestRenderer();
  })

  it('should draw text with lineHeight offset', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ text: 'as', fontSize: 14, lineHeight: 1.5 });

    await renderer.render(canvas, layer);
    
    const [text, x, y] = fillText.mock.calls[0];

    expect(y).toBe(17.5);
  });

  it('should render on y axis', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ text: 'as', y: 1, fontSize: 14, lineHeight: 1.5 });

    await renderer.render(canvas, layer);
    
    const [text, x, y] = fillText.mock.calls[0];

    expect(y).toBe(18.5);
  });

  it('should render image valign middle', async () => {
    const drawImage = ctx.drawImage as jest.Mock
    const layer = new Layer({ valign: VerticalAlign.Middle, imageUri: 'abc' });

    await renderer.render(canvas, layer);
    const [img, x, y, w, h] = drawImage.mock.calls[0];

    expect(y).toBe(150);
  });

  it('should render image valign bottom', async () => {
    const drawImage = ctx.drawImage as jest.Mock
    const layer = new Layer({ valign: VerticalAlign.Bottom, imageUri: 'abc' });

    await renderer.render(canvas, layer);
    const [img, x, y, w, h] = drawImage.mock.calls[0];

    expect(y).toBe(300);
  });

  it('should render text valign middle', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ valign: VerticalAlign.Middle, text: 'abc', fontSize: 10 });

    await renderer.render(canvas, layer);
    const [txt, x, y] = fillText.mock.calls[0];

    expect(y).toBe(205);
  });

  it('should render text valign bottom', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ valign: VerticalAlign.Bottom, text: 'abc', fontSize: 10 });

    await renderer.render(canvas, layer);
    const [txt, x, y] = fillText.mock.calls[0];

    expect(y).toBe(400);
  });

  it('should render text center', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ text: 'abcd', textAlign: TextAlign.Center });

    await renderer.render(canvas, layer);
    const [txt, x, y] = fillText.mock.calls[0];

    expect(x).toBe(400);
  });

  it('should render text center', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ text: 'abcd', x: 100, textAlign: TextAlign.Center });

    await renderer.render(canvas, layer);
    const [txt, x, y] = fillText.mock.calls[0];

    expect(x).toBe(500);
  });

  it('should render text center', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ text: 'abcd', x: 100, width: 200, textAlign: TextAlign.Center });

    await renderer.render(canvas, layer);
    const [txt, x, y] = fillText.mock.calls[0];

    expect(x).toBe(200);
  });

  it('should split text in lines if does not fit', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ text: 'ab cd efg', width: 3, fontSize: 10 });

    await renderer.render(canvas, layer);

    expect(fillText.mock.calls.length).toBe(3);
    expect(fillText.mock.calls[0][0]).toBe('ab');
    expect(fillText.mock.calls[1][0]).toBe('cd');
    expect(fillText.mock.calls[2][0]).toBe('efg');
  });

  it('should split text in lines if does not fit', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ text: 'ab cdef efg', width: 3, fontSize: 10 });

    await renderer.render(canvas, layer);

    expect(fillText.mock.calls.length).toBe(3);
    expect(fillText.mock.calls[0][0]).toBe('ab');
    expect(fillText.mock.calls[1][0]).toBe('cdef');
    expect(fillText.mock.calls[2][0]).toBe('efg');
  });
});
