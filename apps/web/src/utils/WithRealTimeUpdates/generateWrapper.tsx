import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getFallbackLocale } from "i18n/settings";
import { GlobalPageProps } from "utils/globalPageProps";

import { queryDatoCMS } from "@repo/datocms";

import type {
  BuildVariablesFn,
  ContentPage,
  RealtimeUpdatesPage,
} from "./types";

export function generateWrapper<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>(options: {
  query: TypedDocumentNode<TResult, TVariables>;
  buildVariables?: BuildVariablesFn<PageProps, TVariables>;
  contentComponent: ContentPage<PageProps, TResult>;
  realtimeComponent: RealtimeUpdatesPage<PageProps, TResult, TVariables>;
}) {
  return async function Page(unsanitizedPageProps: PageProps) {
    const fallbackLocale = await getFallbackLocale();
    if (!fallbackLocale) {
      throw new Error("Missing fallback locale");
    }

    const { isEnabled: isDraft } = await draftMode();

    const { searchParams, ...pagePropsWithoutSearchParams } =
      unsanitizedPageProps as PageProps & { searchParams: unknown };

    const pageProps = pagePropsWithoutSearchParams as unknown as PageProps;

    const variables =
      (await options.buildVariables?.({
        ...pageProps,
        fallbackLocale,
      })) || ({} as TVariables);

    const data = await queryDatoCMS(options.query, variables, isDraft);
    if (!data) {
      notFound();
    }

    const { realtimeComponent: RealTime, contentComponent: Content } = options;

    return isDraft ? (
      <RealTime
        token={process.env.DATOCMS_READONLY_API_TOKEN || ""}
        query={options.query}
        variables={variables}
        initialData={data}
        pageProps={pageProps}
      />
    ) : (
      <Content {...pageProps} data={data} />
    );
  };
}
