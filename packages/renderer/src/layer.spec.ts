import { Layer } from './layer';

describe('Layer', () => {
  describe('fromSearchParams', () => {
    it('should parse imageUri', () => {
      const input = {
        '0.img': 'https://mpasierbski.com/images/a.png'
      };
      const output = Layer.fromSearchParams(input);

      expect(output[0].img).toBe('https://mpasierbski.com/images/a.png');
    });
  });

  describe('toSearchString', () => {
    it('should serialize img', () => {
      const layer = new Layer({ order: 0, img: 'https://mpasierbski.com/images/a.png' });
      const out = layer.toSearchString();

      expect(out).toBe(`0.img=${encodeURIComponent("https://mpasierbski.com/images/a.png")}`);
    });

    it('should serialize font', () => {
      const layer = new Layer({ order: 1, font: 'Roboto Slab:300' });
      const out = layer.toSearchString();

      expect(out).toBe(`1.font=${encodeURIComponent("Roboto Slab:300")}`);
    });
  });
});
