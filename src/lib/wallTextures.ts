import * as THREE from 'three';
import { WallTexture } from '@/store/roomStore';

// Generate procedural textures for walls
export const createWallTexture = (type: WallTexture, baseColor: string): THREE.CanvasTexture | null => {
  if (type === 'none') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Parse base color
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 232, g: 228, b: 223 };
  };

  const rgb = hexToRgb(baseColor);
  const darken = (amount: number) =>
    `rgb(${Math.max(0, rgb.r - amount)}, ${Math.max(0, rgb.g - amount)}, ${Math.max(0, rgb.b - amount)})`;
  const lighten = (amount: number) =>
    `rgb(${Math.min(255, rgb.r + amount)}, ${Math.min(255, rgb.g + amount)}, ${Math.min(255, rgb.b + amount)})`;

  switch (type) {
    case 'brick':
      drawBrickPattern(ctx, canvas.width, canvas.height, baseColor, darken, lighten);
      break;
    case 'wood':
      drawWoodPattern(ctx, canvas.width, canvas.height, baseColor, darken, lighten);
      break;
    case 'wallpaper-stripe':
      drawStripePattern(ctx, canvas.width, canvas.height, baseColor, darken, lighten);
      break;
    case 'wallpaper-damask':
      drawDamaskPattern(ctx, canvas.width, canvas.height, baseColor, darken, lighten);
      break;
    case 'concrete':
      drawConcretePattern(ctx, canvas.width, canvas.height, baseColor, darken, lighten);
      break;
    default:
      return null;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
};

const drawBrickPattern = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseColor: string,
  darken: (n: number) => string,
  lighten: (n: number) => string
) => {
  const brickWidth = 64;
  const brickHeight = 32;
  const mortarWidth = 4;

  // Mortar background
  ctx.fillStyle = darken(40);
  ctx.fillRect(0, 0, width, height);

  // Draw bricks
  for (let row = 0; row < height / brickHeight; row++) {
    const offset = row % 2 === 0 ? 0 : brickWidth / 2;
    for (let col = -1; col < width / brickWidth + 1; col++) {
      const x = col * brickWidth + offset;
      const y = row * brickHeight;

      // Brick color variation
      const variation = Math.random() * 20 - 10;
      ctx.fillStyle = variation > 0 ? lighten(variation) : darken(-variation);
      ctx.fillRect(x + mortarWidth / 2, y + mortarWidth / 2, brickWidth - mortarWidth, brickHeight - mortarWidth);

      // Brick highlight
      ctx.fillStyle = lighten(15);
      ctx.fillRect(x + mortarWidth / 2, y + mortarWidth / 2, brickWidth - mortarWidth, 2);
      ctx.fillRect(x + mortarWidth / 2, y + mortarWidth / 2, 2, brickHeight - mortarWidth);

      // Brick shadow
      ctx.fillStyle = darken(20);
      ctx.fillRect(x + brickWidth - mortarWidth / 2 - 2, y + mortarWidth / 2, 2, brickHeight - mortarWidth);
      ctx.fillRect(x + mortarWidth / 2, y + brickHeight - mortarWidth / 2 - 2, brickWidth - mortarWidth, 2);
    }
  }
};

const drawWoodPattern = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseColor: string,
  darken: (n: number) => string,
  lighten: (n: number) => string
) => {
  const plankWidth = 64;

  // Base color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, width, height);

  // Draw vertical planks with grain
  for (let i = 0; i < width / plankWidth; i++) {
    const x = i * plankWidth;

    // Plank edge
    ctx.fillStyle = darken(30);
    ctx.fillRect(x, 0, 2, height);

    // Wood grain lines
    for (let j = 0; j < 15; j++) {
      const grainY = Math.random() * height;
      const grainLength = 20 + Math.random() * 40;
      ctx.strokeStyle = darken(10 + Math.random() * 15);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 10 + Math.random() * (plankWidth - 20), grainY);
      ctx.lineTo(x + 10 + Math.random() * (plankWidth - 20), grainY + grainLength);
      ctx.stroke();
    }

    // Knots
    if (Math.random() > 0.7) {
      const knotX = x + 20 + Math.random() * (plankWidth - 40);
      const knotY = Math.random() * height;
      const gradient = ctx.createRadialGradient(knotX, knotY, 0, knotX, knotY, 8);
      gradient.addColorStop(0, darken(40));
      gradient.addColorStop(0.7, darken(25));
      gradient.addColorStop(1, baseColor);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(knotX, knotY, 8, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

const drawStripePattern = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseColor: string,
  darken: (n: number) => string,
  lighten: (n: number) => string
) => {
  const stripeWidth = 32;

  for (let i = 0; i < width / stripeWidth; i++) {
    ctx.fillStyle = i % 2 === 0 ? baseColor : darken(20);
    ctx.fillRect(i * stripeWidth, 0, stripeWidth, height);

    // Subtle texture within stripes
    if (i % 2 === 0) {
      for (let j = 0; j < height; j += 4) {
        ctx.fillStyle = lighten(5);
        ctx.fillRect(i * stripeWidth, j, stripeWidth, 1);
      }
    }
  }
};

const drawDamaskPattern = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseColor: string,
  darken: (n: number) => string,
  lighten: (n: number) => string
) => {
  // Background
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, width, height);

  const patternSize = 128;
  ctx.fillStyle = darken(15);

  for (let row = 0; row < height / patternSize; row++) {
    for (let col = 0; col < width / patternSize; col++) {
      const centerX = col * patternSize + patternSize / 2;
      const centerY = row * patternSize + patternSize / 2;

      // Diamond shape
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 40);
      ctx.lineTo(centerX + 30, centerY);
      ctx.lineTo(centerX, centerY + 40);
      ctx.lineTo(centerX - 30, centerY);
      ctx.closePath();
      ctx.fill();

      // Decorative curves
      ctx.strokeStyle = darken(20);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY - 50, 15, 0.5, 2.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY + 50, 15, 3.6, 5.7);
      ctx.stroke();

      // Corner flourishes
      ctx.beginPath();
      ctx.arc(centerX - 40, centerY - 40, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + 40, centerY - 40, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX - 40, centerY + 40, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + 40, centerY + 40, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

const drawConcretePattern = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseColor: string,
  darken: (n: number) => string,
  lighten: (n: number) => string
) => {
  // Base color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, width, height);

  // Add noise/speckles
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 3;
    const isDark = Math.random() > 0.5;
    ctx.fillStyle = isDark ? darken(20 + Math.random() * 30) : lighten(10 + Math.random() * 20);
    ctx.fillRect(x, y, size, size);
  }

  // Add subtle cracks
  ctx.strokeStyle = darken(15);
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    let x = Math.random() * width;
    let y = Math.random() * height;
    ctx.moveTo(x, y);
    for (let j = 0; j < 10; j++) {
      x += (Math.random() - 0.5) * 40;
      y += Math.random() * 30;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
};

export const TEXTURE_OPTIONS: { value: WallTexture; label: string }[] = [
  { value: 'none', label: 'Solid Color' },
  { value: 'brick', label: 'Brick' },
  { value: 'wood', label: 'Wood Panels' },
  { value: 'wallpaper-stripe', label: 'Striped Wallpaper' },
  { value: 'wallpaper-damask', label: 'Damask Wallpaper' },
  { value: 'concrete', label: 'Concrete' },
];