import fs from "fs/promises";
import path from "path";

import "dotenv/config";

import { fetchLocales } from "./fetch-locales";

async function generateLocaleConfig() {
  const { locales, defaultLocale } = await fetchLocales();

  const data = {
    locales,
    defaultLocale,
  };

  const outputPath = path.join(process.cwd(), "src/i18n/locales.config.json");
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2), "utf8");

  console.log(
    `✅ locales.config.json generated with locales: ${locales.join(", ")} (default: ${defaultLocale})`,
  );
}

generateLocaleConfig().catch((err) => {
  console.error("❌ Failed to generate locales config:", err);
  process.exit(1);
});
