import fs from 'fs';
import zlib from 'zlib';

function createCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const crcTable = createCrcTable();

function calculateCrc(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = calculateCrc(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function generatePng(size, isMaskable = false) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8; // 8 bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // deflate
  ihdrData[11] = 0; // standard filter
  ihdrData[12] = 0; // no interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw image data with filter byte 0 per scanline
  const scanlineLength = 1 + size * 4;
  const rawData = Buffer.alloc(size * scanlineLength);

  const center = size / 2;
  const radius = isMaskable ? size * 0.38 : size * 0.44;

  for (let y = 0; y < size; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // filter None

    for (let x = 0; x < size; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background: Deep Slate 950 (#020617)
      let r = 2, g = 6, b = 23, a = 255;

      // Outer circular frame
      if (dist <= radius + 2 && dist >= radius - 2) {
        // Gold border
        r = 245; g = 158; b = 11;
      } else if (dist < radius) {
        // Inner badge: Dark Slate 900 (#0f172a)
        r = 15; g = 23; b = 42;

        // Draw Letter 'R' and blueprint grid
        // Horizontal grid
        if (y % Math.floor(size / 16) === 0 || x % Math.floor(size / 16) === 0) {
          r = Math.min(255, r + 15);
          g = Math.min(255, g + 25);
          b = Math.min(255, b + 45);
        }

        // Draw Amber 'R'
        const rx = (x - center) / (radius * 0.7);
        const ry = (y - center) / (radius * 0.7);

        // Vertical stem of R
        if (rx >= -0.55 && rx <= -0.25 && ry >= -0.65 && ry <= 0.65) {
          r = 245; g = 158; b = 11;
        }
        // Top loop of R
        else if (rx >= -0.55 && rx <= 0.35 && ry >= -0.65 && ry <= -0.4) {
          r = 245; g = 158; b = 11;
        }
        else if (rx >= -0.55 && rx <= 0.35 && ry >= -0.05 && ry <= 0.15) {
          r = 245; g = 158; b = 11;
        }
        else if (rx >= 0.15 && rx <= 0.45 && ry >= -0.65 && ry <= 0.15) {
          r = 245; g = 158; b = 11;
        }
        // Diagonal leg of R
        else if (rx >= -0.1 && rx <= 0.45 && ry >= 0.1 && ry <= 0.65) {
          const expectedRx = (ry - 0.1) * 0.9 - 0.05;
          if (Math.abs(rx - expectedRx) < 0.18) {
            r = 245; g = 158; b = 11;
          }
        }

        // Small Red Structural Column indicator at bottom right
        if (rx >= 0.35 && rx <= 0.55 && ry >= 0.35 && ry <= 0.55) {
          r = 244; g = 63; b = 94; // #f43f5e
        }
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

fs.writeFileSync('./public/pwa-192x192.png', generatePng(192));
fs.writeFileSync('./public/pwa-512x512.png', generatePng(512));
fs.writeFileSync('./public/pwa-maskable-512x512.png', generatePng(512, true));
fs.writeFileSync('./public/apple-touch-icon.png', generatePng(180));

console.log('PWA icons successfully generated in ./public');
