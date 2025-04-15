import type { BuildVariablesFn } from "utils/WithRealTimeUpdates/types";
import { generateWrapper } from "utils/WithRealTimeUpdates/generateWrapper";

import type { PageProps, Query, Variables } from "./meta";
import Content from "./Content";
import { query } from "./meta";
import RealTime from "./RealTime";

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

const layout = generateWrapper<PageProps, Query, Variables>({
  query,
  buildVariables: buildVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default layout;
