import {
  LayoutDocument,
  LayoutQuery,
  LayoutQueryVariables,
} from "types/datocms";
import { GlobalPageProps } from "utils/globalPageProps";

export type PageProps = GlobalPageProps & {
  children: React.ReactNode;
};

export type Query = LayoutQuery;
export type Variables = LayoutQueryVariables;

export const query = LayoutDocument;
