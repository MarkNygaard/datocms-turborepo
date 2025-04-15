import { routing } from "i18n/routing";
import { generateWrapper } from "utils/WithRealTimeUpdates/generateWrapper";
import { BuildVariablesFn } from "utils/WithRealTimeUpdates/types";

import type { PageProps, Query, Variables } from "./meta";
import Content from "./Content";
import { query } from "./meta";
import RealTime from "./RealTime";

export const dynamicParams = true;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
