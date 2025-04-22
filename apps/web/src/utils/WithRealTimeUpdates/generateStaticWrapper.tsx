import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { notFound } from "next/navigation";
import { getFallbackLocale } from "i18n/settings";
import { GlobalPageProps } from "utils/globalPageProps";

import { queryDatoCMS } from "@repo/datocms";

import type { BuildVariablesFn, ContentPage } from "./types";

export function generateStaticWrapper<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>(options: {
  query: TypedDocumentNode<TResult, TVariables>;
  buildVariables?: BuildVariablesFn<PageProps, TVariables>;
  contentComponent: ContentPage<PageProps, TResult>;
}) {
  return async function Page(unsanitizedPageProps: PageProps) {
    const fallbackLocale = await getFallbackLocale();
    if (!fallbackLocale) {
      throw new Error("Missing fallback locale");
    }

    const { searchParams, ...pagePropsWithoutSearchParams } =
      unsanitizedPageProps as PageProps & { searchParams?: unknown };

    const pageProps = pagePropsWithoutSearchParams as PageProps;

    const variables =
      (await options.buildVariables?.({
        ...pageProps,
        fallbackLocale,
      })) || ({} as TVariables);

    let data: TResult;
    try {
      data = await queryDatoCMS(options.query, variables, false);
    } catch (err) {
      console.error("Failed to fetch data from DatoCMS:", err);
      notFound();
    }

    const { contentComponent: Content } = options;
    return <Content {...pageProps} data={data} />;
  };
}
