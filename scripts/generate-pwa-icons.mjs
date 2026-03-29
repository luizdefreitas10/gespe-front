import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const srcSvg = join(publicDir, "arpe-light-logo.svg");

async function main() {
  const svg = await readFile(srcSvg);
  const sizes = [
    [192, "icon-192.png"],
    [512, "icon-512.png"],
    [180, "apple-touch-icon.png"],
  ];
  for (const [size, name] of sizes) {
    await sharp(svg)
      .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(join(publicDir, name));
    console.log("Wrote", name);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
