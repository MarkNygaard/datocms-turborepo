import Footer from "components/Layout/Footer";
import Header from "components/Layout/Header";
import Meta from "components/Layout/Meta";
import { ContentPage } from "utils/WithRealTimeUpdates/types";

import type { PageProps, Query } from "./meta";

const Content: ContentPage<PageProps, Query> = ({ data, children, params }) => {
  return (
    <>
      <Meta data={data} />
      <Header data={data} locale={params.locale} />
      <div className="flex-1">{children}</div>
      <Footer data={data} languages={data._site.locales} />
    </>
  );
};

export default Content;
