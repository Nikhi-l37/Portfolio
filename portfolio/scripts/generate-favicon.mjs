import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const size = 128; // large enough for crisp display
const r = size / 2;

// Circular mask SVG
const circleMask = Buffer.from(
  `<svg width="${size}" height="${size}">
     <circle cx="${r}" cy="${r}" r="${r}" fill="white"/>
   </svg>`
);

// Read the source image and get its metadata
const img = sharp(resolve(root, 'src/assets/Nikhil.jpg'));
const meta = await img.metadata();

// Crop to a square from the top-center (close-up of face)
const cropSize = Math.min(meta.width, meta.height);
const left = Math.round((meta.width - cropSize) / 2);

await sharp(resolve(root, 'src/assets/Nikhil.jpg'))
  .extract({ left, top: 0, width: cropSize, height: cropSize }) // top-center crop
  .resize(size, size, { fit: 'cover' })
  .composite([{ input: circleMask, blend: 'dest-in' }])
  .png()
  .toFile(resolve(root, 'public/favicon.png'));

console.log('✓ Circular favicon generated → public/favicon.png');
