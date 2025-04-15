import { GlobalPageProps } from "utils/globalPageProps";

import type { ContentPage, RealtimeUpdatesPage } from "./types";
import WithRealTimeUpdates from ".";

export function generateRealtimeComponent<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>({
  contentComponent: Content,
}: {
  contentComponent: ContentPage<PageProps, TResult>;
}) {
  const component: RealtimeUpdatesPage<PageProps, TResult, TVariables> = (
    props,
  ) => {
    return (
      <WithRealTimeUpdates {...props}>
        {(contentProps) => <Content {...contentProps} />}
      </WithRealTimeUpdates>
    );
  };

  return component;
}
