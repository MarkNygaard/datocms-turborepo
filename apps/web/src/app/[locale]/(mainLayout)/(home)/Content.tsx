import { notFound } from "next/navigation";
import PageBuilder from "components/PageBuilder";
import { ContentRecord } from "types/datocms";
import { ContentPage } from "utils/WithRealTimeUpdates/types";

import type { PageProps, Query } from "./meta";

const Content: ContentPage<PageProps, Query> = ({ data }) => {
  const page = data.home;

  console.log("🧠 Props received by component:", JSON.stringify(data, null, 2));

  if (!page) {
    notFound();
  }

  return <PageBuilder {...(page.pageBuilder as ContentRecord)} />;
};

export default Content;
