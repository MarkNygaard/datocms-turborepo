import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { Metadata } from "next";
import type { SeoOrFaviconTag, TitleMetaLinkTag } from "react-datocms/seo";
import { draftMode } from "next/headers";
import { getFallbackLocale } from "i18n/settings";
import { toNextMetadata } from "react-datocms/seo";
import { GlobalPageProps } from "utils/globalPageProps";

import { queryDatoCMS } from "@repo/datocms";

import { BuildVariablesFn } from "./types";

export function generateMetadataFn<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>(options: {
  query: TypedDocumentNode<TResult, TVariables>;
  buildVariables?: BuildVariablesFn<PageProps, TVariables>;
  generate: (
    data: TResult,
  ) => TitleMetaLinkTag[] | SeoOrFaviconTag[] | undefined;
}) {
  return async function generateMetadata(
    pageProps: PageProps,
  ): Promise<Metadata> {
    const fallbackLocale = await getFallbackLocale();
    if (!fallbackLocale) {
      throw new Error("Missing fallback locale");
    }

    const { isEnabled: isDraft } = await draftMode();

    const variables =
      (await options.buildVariables?.({
        ...pageProps,
        fallbackLocale,
      })) || ({} as TVariables);

    const data = await queryDatoCMS(options.query, variables, isDraft);

    const tags = options.generate(data);

    return tags ? toNextMetadata(tags) : {};
  };
}
