import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const directory = "public/images/social";
const logo = (await readFile("public/images/demo1-brand/seoul-bareun-logo.svg", "utf8"))
  .replace('<svg xmlns="http://www.w3.org/2000/svg"', '<svg x="196" y="164" width="808" height="180"');

const artwork = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <title>서울바른내과 홈페이지 데모버전</title>
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect width="1200" height="12" fill="#3472b9"/>
  ${logo}
  <text x="600" y="436" text-anchor="middle" font-family="Malgun Gothic, Noto Sans KR, sans-serif" font-size="34" fill="#687b8c">홈페이지 데모버전</text>
  <rect y="618" width="1200" height="12" fill="#3472b9"/>
</svg>`;

await mkdir(directory, { recursive: true });
await writeFile(`${directory}/seoul-bareun-demo-v1.svg`, artwork);
await sharp(Buffer.from(artwork)).png().toFile(`${directory}/seoul-bareun-demo-v1.png`);
console.log("Created 1200 × 630 share thumbnail.");
