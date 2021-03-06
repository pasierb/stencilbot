declare module "node-canvas-with-twemoji-and-discord-emoji" {
  export function fillTextWithTwemoji(ctx: CanvasRenderingContext2D, text: string, x: number, y: number): Promise<void>
  export function measureText(ctx: CanvasRenderingContext2D, text: string): { width: number }
}
