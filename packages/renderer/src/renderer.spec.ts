import { Renderer } from './renderer';
import { Layer, VerticalAlign, TextAlign, ImageFit } from './layer';

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

  it('should downsize image to contain', async () => {
    const drawImage = ctx.drawImage as jest.Mock
    const layer = new Layer({ img: 'abc', w: 150, imgFit: ImageFit.Contain });

    await renderer.render(canvas, layer);
    const [img, x, y, w, h] = drawImage.mock.calls[0];

    expect(w).toBe(150);
    expect(h).toBe(50);
    expect(x).toBe(0);
    expect(y).toBe(175);
  });

  it('should draw text with lineHeight offset', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ txt: 'as', font: 'Roboto', fontSize: 14, lineH: 1.5 });

    await renderer.render(canvas, layer);
    
    const [text, x, y] = fillText.mock.calls[0];

    expect(y).toBe(17.5);
  });

  it('should render on y axis', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ txt: 'as', font: 'Roboto', y: 1, fontSize: 14, lineH: 1.5 });

    await renderer.render(canvas, layer);
    
    const [text, x, y] = fillText.mock.calls[0];

    expect(y).toBe(18.5);
  });

  it('should render image valign middle', async () => {
    const drawImage = ctx.drawImage as jest.Mock
    const layer = new Layer({ valign: VerticalAlign.Middle, img: 'abc' });

    await renderer.render(canvas, layer);
    const [img, x, y, w, h] = drawImage.mock.calls[0];

    expect(y).toBe(150);
  });

  it('should containt fit and render image valign middle', async () => {
    const drawImage = ctx.drawImage as jest.Mock
    const layer = new Layer({ valign: VerticalAlign.Middle, img: 'abc', w: 150, imgFit: ImageFit.Contain });

    await renderer.render(canvas, layer);
    const [img, x, y, w, h] = drawImage.mock.calls[0];

    expect(y).toBe(150);
  });

  it('should render image valign bottom', async () => {
    const drawImage = ctx.drawImage as jest.Mock
    const layer = new Layer({ valign: VerticalAlign.Bottom, img: 'abc' });

    await renderer.render(canvas, layer);
    const [img, x, y, w, h] = drawImage.mock.calls[0];

    expect(y).toBe(300);
  });

  it('should render text valign middle', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ valign: VerticalAlign.Middle, font: 'Roboto', txt: 'abc', fontSize: 10 });

    await renderer.render(canvas, layer);
    const [txt, x, y] = fillText.mock.calls[0];

    expect(y).toBe(205);
  });

  it('should render text valign bottom', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ valign: VerticalAlign.Bottom, font: 'Roboto', txt: 'abc', fontSize: 10 });

    await renderer.render(canvas, layer);
    const [txt, x, y] = fillText.mock.calls[0];

    expect(y).toBe(400);
  });

  it('should render text center', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ txt: 'abcd', txtAlign: TextAlign.Center, font: 'Roboto' });

    await renderer.render(canvas, layer);
    const [txt, x, y] = fillText.mock.calls[0];

    expect(x).toBe(400);
  });

  it('should render text center', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ txt: 'abcd', x: 100, txtAlign: TextAlign.Center, font: 'Roboto' });

    await renderer.render(canvas, layer);
    const [txt, x, y] = fillText.mock.calls[0];

    expect(x).toBe(500);
  });

  it('should render text center', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ txt: 'abcd', x: 100, w: 200, txtAlign: TextAlign.Center, font: 'Roboto' });

    await renderer.render(canvas, layer);
    const [txt, x, y] = fillText.mock.calls[0];

    expect(x).toBe(200);
  });

  it('should split text in lines if does not fit', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ txt: 'ab cd efg', w: 3, fontSize: 10, font: 'Roboto' });

    await renderer.render(canvas, layer);

    expect(fillText.mock.calls.length).toBe(3);
    expect(fillText.mock.calls[0][0]).toBe('ab');
    expect(fillText.mock.calls[1][0]).toBe('cd');
    expect(fillText.mock.calls[2][0]).toBe('efg');
  });

  it('should split text in lines if does not fit', async () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ txt: 'ab cdef efg', w: 3, fontSize: 10, font: 'Roboto' });

    await renderer.render(canvas, layer);

    expect(fillText.mock.calls.length).toBe(3);
    expect(fillText.mock.calls[0][0]).toBe('ab');
    expect(fillText.mock.calls[1][0]).toBe('cdef');
    expect(fillText.mock.calls[2][0]).toBe('efg');
  });
});
