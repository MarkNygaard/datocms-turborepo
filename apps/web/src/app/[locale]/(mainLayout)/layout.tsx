import type { BuildVariablesFn } from "utils/WithRealTimeUpdates/types";
import { routing } from "i18n/routing";
import { generateStaticWrapper } from "utils/WithRealTimeUpdates/generateStaticWrapper";

import type { PageProps, Query, Variables } from "./meta";
import Content from "./Content";
import { query } from "./meta";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const buildVariables: BuildVariablesFn<PageProps, Variables> = async ({
  params,
  fallbackLocale,
}) => {
  const { locale } = await params;
  return {
    locale: locale,
    fallbackLocale: [fallbackLocale],
  };
};

const layout = generateStaticWrapper<PageProps, Query, Variables>({
  query,
  buildVariables: buildVariables,
  contentComponent: Content,
});

export default layout;
