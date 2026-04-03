import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const WIDTH = 1200;
const HEIGHT = 630;
const BG_COLOR = "#1a1a1a";
const ICON_SIZE = 160;

// Read and modify the SVG icon for OG image
let iconSvg = readFileSync(
  resolve(__dirname, "../public/favicon.svg"),
  "utf-8",
);
iconSvg = iconSvg
  .replace('stroke="currentColor"', 'stroke="white"')
  .replace('width="24"', `width="${ICON_SIZE}"`)
  .replace('height="24"', `height="${ICON_SIZE}"`);

// Title and tagline as SVG overlay
const titleSvg = `<svg width="${WIDTH}" height="120" xmlns="http://www.w3.org/2000/svg">
  <text x="50%" y="50" text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="600"
    fill="white">VestWise</text>
  <text x="50%" y="95" text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="400"
    fill="#a3a3a3">Your stock options, finally clear.</text>
</svg>`;

const iconTop = Math.round((HEIGHT - ICON_SIZE - 140) / 2);
const titleTop = iconTop + ICON_SIZE + 20;

await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 4,
    background: BG_COLOR,
  },
})
  .composite([
    {
      input: Buffer.from(iconSvg),
      top: iconTop,
      left: Math.round((WIDTH - ICON_SIZE) / 2),
    },
    {
      input: Buffer.from(titleSvg),
      top: titleTop,
      left: 0,
    },
  ])
  .png()
  .toFile(resolve(__dirname, "../public/og-image.png"));

console.log("Generated public/og-image.png (1200x630)");
