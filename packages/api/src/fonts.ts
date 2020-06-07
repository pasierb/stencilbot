import path from 'path';
import { registerFont } from 'canvas';

export function registerDefaultFonts() {
  registerFont(path.join(__dirname, 'fonts/Roboto-Regular.ttf'), { family: 'Roboto' });
}
