import PageBuilder from "components/PageBuilder";
import { PageBuilderRecord } from "types/datocms";
import { ContentPage } from "utils/WithRealTimeUpdates/types";

import type { PageProps, Query } from "./meta";

const Content: ContentPage<PageProps, Query> = ({ data }) => {
  const { home } = data;

  return <PageBuilder {...(home?.pageBuilder as PageBuilderRecord)} />;
};

export default Content;
