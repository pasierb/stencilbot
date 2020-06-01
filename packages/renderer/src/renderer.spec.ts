import { Renderer } from './renderer';
import { Layer } from './layer';

class TestRenderer extends Renderer {
  async loadImage(uri: string) {
    return new Image();
  }
}

describe('renderer', () => {
  let canvas: HTMLCanvasElement;
  let renderer: TestRenderer;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')!;
    renderer = new TestRenderer();
  })

  it('should draw text with lineHeight offset', () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ text: 'as', fontSize: 14, lineHeight: 1.5 });

    renderer.render(canvas, layer);
    
    const [text, x, y] = fillText.mock.calls[0];

    expect(y).toBe(17.5);
  });

  it('should render on y axis', () => {
    const fillText = ctx.fillText as jest.Mock
    const layer = new Layer({ text: 'as', y: 1, fontSize: 14, lineHeight: 1.5 });

    renderer.render(canvas, layer);
    
    const [text, x, y] = fillText.mock.calls[0];

    expect(y).toBe(18.5);
  })
});
