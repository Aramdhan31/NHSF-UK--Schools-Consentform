/**
 * Extracts the Om mark from public/schools-logo.png into app icon assets.
 * Run: npm run icons:generate
 */
import sharp from "sharp";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const input = join(root, "public", "schools-logo.png");
const appDir = join(root, "src", "app");

// Tuned for 995×289 NHSF Schools logo (Om disc on the left).
const CROP = { left: 0, top: 12, width: 265, height: 265 };

async function main() {
  const pipeline = sharp(input).extract(CROP);

  const icon32 = await pipeline.clone().resize(32, 32).png().toBuffer();
  writeFileSync(join(appDir, "icon.png"), icon32);

  const apple = await pipeline.clone().resize(180, 180).png().toBuffer();
  writeFileSync(join(appDir, "apple-icon.png"), apple);

  console.log("Wrote src/app/icon.png (32×32) and src/app/apple-icon.png (180×180).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
