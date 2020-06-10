import { Layer } from './layer';

describe('Layer', () => {
  describe('fromSearchParams', () => {
    it('should parse imageUri', () => {
      const input = {
        'l[0]imageUri': 'https://mpasierbski.com/images/a.png'
      };
      const output = Layer.fromSearchParams(input);

      expect(output[0].imageUri).toBe('https://mpasierbski.com/images/a.png');
    });
  });

  describe('toSearchString', () => {
    it('should ', () => {
      const layer = new Layer({ order: 0, imageUri: 'https://mpasierbski.com/images/a.png' });
      const out = layer.toSearchString();

      expect(out).toBe('l[0]imageUri=https://mpasierbski.com/images/a.png&l[0]fontSize=14&l[0]fontFamily=Roboto');
    });
  });
});
