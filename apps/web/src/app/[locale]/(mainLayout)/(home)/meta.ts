import { PageDocument, PageQuery, PageQueryVariables } from "types/datocms";
import { GlobalPageProps } from "utils/globalPageProps";

export type PageProps = GlobalPageProps & {
  children: React.ReactNode;
};

export type Query = PageQuery;
export type Variables = PageQueryVariables;

export const query = PageDocument;
