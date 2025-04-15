import { defineRouting } from "next-intl/routing";

import localeData from "./locales.config.json";

const makeDynamicPath = (path: string) =>
  Object.fromEntries(localeData.locales.map((locale) => [locale, path]));

const dynamicPathnames = {
  "/[slug]": makeDynamicPath("/[slug]"),
};

export const routing = defineRouting({
  locales: localeData.locales,
  defaultLocale: localeData.defaultLocale,
  localePrefix: "as-needed",
  pathnames: dynamicPathnames,
});
