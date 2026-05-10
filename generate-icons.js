// generate-icons.js
// Generates valid 1024x1024 PNG icon files for Android build
// Run with: node generate-icons.js

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

/**
 * Creates a minimal valid PNG file from scratch using only Node.js builtins.
 * No external dependencies needed.
 */
function createPNG(width, height, bgColor, textColor) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk: width, height, bit depth=8, color type=2 (RGB)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  // Raw image data: each row starts with filter byte 0 (None)
  const rawData = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 3);
    rawData[rowStart] = 0; // filter type: None

    for (let x = 0; x < width * 3; x += 3) {
      // Draw orange background (#FF4500)
      rawData[rowStart + 1 + x]     = bgColor[0];
      rawData[rowStart + 1 + x + 1] = bgColor[1];
      rawData[rowStart + 1 + x + 2] = bgColor[2];
    }
  }

  // Draw a simple white rounded rect in the center for "EB" initials feel
  const margin = Math.floor(width * 0.2);
  const inner = width - margin * 2;
  for (let y = margin; y < margin + inner; y++) {
    const rowStart = y * (1 + width * 3);
    for (let x = margin; x < margin + inner; x++) {
      // dark inner block
      rawData[rowStart + 1 + x * 3]     = 8;
      rawData[rowStart + 1 + x * 3 + 1] = 8;
      rawData[rowStart + 1 + x * 3 + 2] = 8;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBytes = Buffer.from(type, 'ascii');
    const crcData = Buffer.concat([typeBytes, data]);
    const crc = crc32(crcData);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc >>> 0, 0);
    return Buffer.concat([len, typeBytes, data, crcBuf]);
  }

  // CRC32 implementation
  function crc32(buf) {
    const table = makeCRCTable();
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF);
  }

  function makeCRCTable() {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    return table;
  }

  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

// Orange brand color: #FF4500 on dark background
const png = createPNG(1024, 1024, [255, 69, 0], [255, 255, 255]);

const assetsDir = path.join(__dirname, 'assets');
fs.writeFileSync(path.join(assetsDir, 'icon.png'), png);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), png);
fs.writeFileSync(path.join(assetsDir, 'splash-icon.png'), png);
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), createPNG(64, 64, [255, 69, 0], [255, 255, 255]));

console.log('✅ Generated valid PNG assets:');
console.log('   assets/icon.png');
console.log('   assets/adaptive-icon.png');
console.log('   assets/splash-icon.png');
console.log('   assets/favicon.png');
