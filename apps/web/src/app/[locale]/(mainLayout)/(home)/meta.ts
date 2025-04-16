import { HomeDocument, HomeQuery, HomeQueryVariables } from "types/datocms";
import { GlobalPageProps } from "utils/globalPageProps";

export type PageProps = GlobalPageProps & {
  children: React.ReactNode;
};

export type Query = HomeQuery;
export type Variables = HomeQueryVariables;

export const query = HomeDocument;
