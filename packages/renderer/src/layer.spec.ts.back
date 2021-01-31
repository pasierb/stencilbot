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

  describe('fontWeight', () => {
    it('should parse font weight', () => {
      const layer = new Layer({ font: 'Ubuntu:700' });

      expect(layer.fontWeight).toBe('700');
    });

    it('should parse font weight', () => {
      const layer = new Layer({ font: 'Comic Neue:regular' });

      expect(layer.fontWeight).toBe(undefined);
    });

    it('should parse font weight', () => {
      const layer = new Layer({ font: 'Ubuntu:500italic' });

      expect(layer.fontWeight).toBe('500');
    });

    it('should parse font weight', () => {
      const layer = new Layer({ font: 'Ubuntu:italic' });

      expect(layer.fontWeight).toBe(undefined);
    });
  });

  describe('fontStyle', () => {
    it('should parse font weight', () => {
      const layer = new Layer({ font: 'Ubuntu:700' });

      expect(layer.fontStyle).toBe(undefined);
    });

    it('should parse font style Comic Neue:regular', () => {
      const layer = new Layer({ font: 'Comic Neue:regular' });

      expect(layer.fontStyle).toBe(undefined);
    });

    it('should parse font weight', () => {
      const layer = new Layer({ font: 'Ubuntu:500italic' });

      expect(layer.fontStyle).toBe('italic');
    });

    it('should parse font weight', () => {
      const layer = new Layer({ font: 'Ubuntu:italic' });

      expect(layer.fontStyle).toBe('italic');
    });
  });
});
