import sharp from "sharp";
import { mkdirSync } from "node:fs";

// Derbi ikona: dijagonalni split (LIQUI plava / FORMULA crvena) + tamni disk s "M".
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path d="M0 0 L512 0 L0 512 Z" fill="#2f6bff"/>
  <path d="M512 0 L512 512 L0 512 Z" fill="#e23744"/>
  <circle cx="256" cy="256" r="168" fill="#0a0c10"/>
  <text x="256" y="256" text-anchor="middle" dominant-baseline="central"
        font-family="Arial, Helvetica, sans-serif" font-weight="700"
        font-size="210" fill="#ffffff">M</text>
</svg>`;

mkdirSync("public/icons", { recursive: true });

const targets = [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["maskable-512.png", 512],
  ["apple-icon.png", 180],
];

for (const [name, size] of targets) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(`public/icons/${name}`);
  console.log("wrote", name);
}
