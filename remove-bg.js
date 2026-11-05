const sharp = require('sharp');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets', 'images');

async function removeWhiteBg(inputPath, outputPath, targetWidth, targetHeight) {
  const image = sharp(inputPath);
  const { width, height, channels } = await image.metadata();

  // Get raw pixel data
  const rawBuffer = await image
    .ensureAlpha()
    .raw()
    .toBuffer();

  // Process pixels — make near-white pixels transparent
  const threshold = 240; // pixels with R,G,B all above this become transparent
  for (let i = 0; i < rawBuffer.length; i += 4) {
    const r = rawBuffer[i];
    const g = rawBuffer[i + 1];
    const b = rawBuffer[i + 2];
    if (r > threshold && g > threshold && b > threshold) {
      rawBuffer[i + 3] = 0; // set alpha to 0
    }
  }

  await sharp(rawBuffer, { raw: { width, height, channels: 4 } })
    .resize(targetWidth, targetHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(outputPath);

  console.log(`Done: ${outputPath}`);
}

async function main() {
  // 1. Remove background from logo
  await removeWhiteBg(
    path.join(assetsDir, 'mediswift-full-logo.png'),
    path.join(assetsDir, 'mediswift-logo-transparent.png'),
    800, 240
  );

  // 2. Remove background from hero medicine image  
  const heroSource = path.join(
    'C:', 'Users', 'ummer', '.gemini', 'antigravity', 'brain',
    '8a668b9a-66c6-4074-b86d-2028ce940e82',
    'login_hero_medicine_1793860132108.jpg'
  );
  await removeWhiteBg(
    heroSource,
    path.join(assetsDir, 'login-hero-medicine.png'),
    500, 450
  );
}

main().catch(console.error);

