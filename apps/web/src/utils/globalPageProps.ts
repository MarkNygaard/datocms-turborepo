import { SiteLocale } from "types/datocms";

export type GlobalPageProps = {
  params: {
    slug: string;
    locale: SiteLocale;
  };
};

export async function buildUrl(
  globalPageProps: GlobalPageProps,
  path?: string,
) {
  const locale = await globalPageProps.params.locale;
  return `/${locale}${path || ""}`;
}
