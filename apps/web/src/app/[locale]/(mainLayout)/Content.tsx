import Footer from "components/Layout/Footer";
import Header from "components/Layout/Header";
import Meta from "components/Layout/Meta";
import { ContentPage } from "utils/WithRealTimeUpdates/types";

import type { PageProps, Query } from "./meta";

const Content: ContentPage<PageProps, Query> = ({ data, children }) => {
  return (
    <>
      <Meta data={data} />
      <Header data={data} />
      <div className="flex-1">{children}</div>
      <Footer data={data} languages={data._site.locales} />
    </>
  );
};

export default Content;
