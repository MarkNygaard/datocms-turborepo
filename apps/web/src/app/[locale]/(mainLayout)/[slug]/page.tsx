import { routing } from "i18n/routing";
import { PageStaticParamsDocument, SiteLocale } from "types/datocms";
import { generateWrapper } from "utils/WithRealTimeUpdates/generateWrapper";
import { BuildVariablesFn } from "utils/WithRealTimeUpdates/types";

import { queryDatoCMS } from "@repo/datocms";

import type { PageProps, Query, Variables } from "./meta";
import Content from "./Content";
import { query } from "./meta";
import RealTime from "./RealTime";

export async function generateStaticParams() {
  const locales = routing.locales;

  const allParams = await Promise.all(
    (locales as SiteLocale[]).map(async (locale) => {
      const { allPages } = await queryDatoCMS(PageStaticParamsDocument, {
        locale,
      });

      return allPages.map((page) => ({
        locale,
        slug: page.slug,
      }));
    }),
  );

  return allParams.flat();
}

const buildVariables: BuildVariablesFn<PageProps, Variables> = async ({
  params,
  fallbackLocale,
}) => {
  const { slug, locale } = await params;
  return {
    slug: slug,
    locale: locale,
    fallbackLocale: [fallbackLocale],
  };
};

const Page = generateWrapper<PageProps, Query, Variables>({
  query,
  buildVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Page;
