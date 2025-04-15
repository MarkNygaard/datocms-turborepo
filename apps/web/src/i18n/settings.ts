import { LocalesDocument } from "types/datocms";

import { executeQueryWithoutMemoization } from "@repo/datocms";

export default async function getAvailableLocales() {
  const { _site } = await executeQueryWithoutMemoization(LocalesDocument);
  return _site.locales;
}

export async function getFallbackLocale() {
  const locales = await getAvailableLocales();
  return locales[0]; //using the first ordered locale as fallback
}
